import { relations } from "drizzle-orm";
import { boolean, index, integer, json, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import type { GardenInput } from "./garden/types";

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	stripeId: varchar("stripe_id", { length: 255 }),
	subscriptionPlan: varchar("subscription_plan", { length: 50 }).default("free").notNull(),
	subscriptionStatus: varchar("subscription_status", { length: 50 }).default("inactive"),
	rememberToken: varchar("remember_token", { length: 100 }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const sessions = pgTable(
	"sessions",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => new Date())
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
	},
	(table) => ({
		sessionsUserIdIdx: index("sessions_userId_idx").on(table.userId),
	}),
);

export const accounts = pgTable(
	"accounts",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => ({
		accountsUserIdIdx: index("accounts_userId_idx").on(table.userId),
	}),
);

export const verifications = pgTable(
	"verifications",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => ({
		verificationsIdentifierIdx: index("verifications_identifier_idx").on(table.identifier),
	}),
);

export const subscriptions = pgTable("subscriptions", {
	id: serial("id").primaryKey(),
	userId: text("user_id").notNull(),
	stripeId: varchar("stripe_id", { length: 255 }).notNull().unique(),
	stripeStatus: varchar("stripe_status", { length: 50 }).notNull(),
	stripePrice: varchar("stripe_price", { length: 50 }),
	plan: varchar("plan", { length: 50 }).default("standard").notNull(),
	quantity: integer("quantity").default(1).notNull(),
	trialEndsAt: timestamp("trial_ends_at", { mode: "date" }),
	endsAt: timestamp("ends_at", { mode: "date" }),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const gardens = pgTable(
	"gardens",
	{
		id: serial("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		name: varchar("name", { length: 80 }).notNull(),
		input: json("input").$type<GardenInput>().notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(t) => ({ gardensUserIdx: index("gardens_user_idx").on(t.userId) }),
);

export const webhookLogs = pgTable("webhook_logs", {
	id: serial("id").primaryKey(),
	eventId: varchar("event_id", { length: 255 }),
	eventType: varchar("event_type", { length: 255 }).notNull(),
	payload: text("payload").notNull(),
	status: varchar("status", { length: 50 }).default("success").notNull(),
	errorMessage: text("error_message"),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// Só ações de admin. Sem email/nome do cliente: targetId sem FK sobrevive ao apagar a conta.
export const auditLogs = pgTable(
	"audit_logs",
	{
		id: serial("id").primaryKey(),
		actorId: text("actor_id").notNull(),
		action: varchar("action", { length: 50 }).notNull(),
		targetId: text("target_id"),
		details: json("details").$type<Record<string, unknown>>(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(t) => ({ auditTargetIdx: index("audit_logs_target_idx").on(t.targetId) }),
);

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	users: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
	users: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
}));
