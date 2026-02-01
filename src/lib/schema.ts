import { relations } from "drizzle-orm";
import { boolean, decimal, index, integer, json, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	stripeId: varchar("stripe_id", { length: 255 }),
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

export const plants = pgTable("plants", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	scientificName: varchar("scientific_name", { length: 255 }),
	description: text("description"),
	imageUrl: varchar("image_url", { length: 2048 }),
	potSizeRequired: integer("pot_size_required").notNull(),
	soilAmountRequired: decimal("soil_amount_required", {
		precision: 8,
		scale: 2,
	}).notNull(),
	seedsPerPlant: integer("seeds_per_plant").default(1).notNull(),
	price: decimal("price", { precision: 8, scale: 2 }).default("0").notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const products = pgTable("products", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	type: varchar("type", { length: 50 }).notNull(),
	description: text("description"),
	imageUrl: varchar("image_url", { length: 2048 }),
	price: decimal("price", { precision: 8, scale: 2 }).notNull(),
	storeName: varchar("store_name", { length: 255 }).notNull(),
	storeUrl: varchar("store_url", { length: 2048 }).notNull(),
	size: decimal("size", { precision: 8, scale: 2 }),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const calculations = pgTable("calculations", {
	id: serial("id").primaryKey(),
	userId: text("user_id").notNull(),
	plantsData: json("plants_data").notNull(),
	productsData: json("products_data").notNull(),
	totalCost: decimal("total_cost", { precision: 10, scale: 2 }).notNull(),
	plantsCount: integer("plants_count").notNull(),
	estimatedSavings: decimal("estimated_savings", { precision: 10, scale: 2 }).default("0").notNull(),
	isPublic: boolean("is_public").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
	id: serial("id").primaryKey(),
	userId: text("user_id").notNull(),
	stripeId: varchar("stripe_id", { length: 255 }).notNull().unique(),
	stripeStatus: varchar("stripe_status", { length: 50 }).notNull(),
	stripePrice: varchar("stripe_price", { length: 50 }),
	quantity: integer("quantity").default(1).notNull(),
	trialEndsAt: timestamp("trial_ends_at", { mode: "date" }),
	endsAt: timestamp("ends_at", { mode: "date" }),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

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
