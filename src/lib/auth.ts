import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
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
	plugins: [nextCookies()],
});
