import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { eq } from "drizzle-orm";
import { cancelLiveSubscriptions } from "./billing";
import { db } from "./db";
import * as schema from "./schema";

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_BASE_URL,
	// Em dev a porta muda (várias apps Next abertas); sem isto o sign-out dá 403 "Invalid origin".
	trustedOrigins: process.env.NODE_ENV === "development" ? ["http://localhost:*"] : [],
	database: drizzleAdapter(db, {
		provider: "pg",
		usePlural: true,
		schema: {
			...schema,
			user: schema.users,
		},
	}),
	emailAndPassword: {
		enabled: true,
	},
	user: {
		// RGPD Art. 17. Pede a palavra-passe; sessions, accounts e gardens vão em cascata.
		deleteUser: {
			enabled: true,
			beforeDelete: async (user) => {
				const [row] = await db
					.select({ stripeId: schema.users.stripeId })
					.from(schema.users)
					.where(eq(schema.users.id, user.id));
				// Cancelar no Stripe primeiro: se falhar, não se apaga nada e o cliente não fica a pagar sem conta.
				if (row?.stripeId) {
					try {
						await cancelLiveSubscriptions(row.stripeId);
					} catch (error) {
						console.error("deleteUser: stripe cancel failed", (error as Error).message);
						throw new APIError("BAD_GATEWAY", {
							message: "Não foi possível cancelar a subscrição. Tenta mais tarde.",
						});
					}
				}
				await db.delete(schema.subscriptions).where(eq(schema.subscriptions.userId, user.id));
			},
		},
	},
	plugins: [nextCookies()],
});
