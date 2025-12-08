// src/lib/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('User', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	createdAt: integer('createdAt', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
	focusDomain: text('focusDomain'), // User's chosen primary PERMA domain
	onboardingComplete: integer('onboardingComplete', { mode: 'boolean' }).notNull().default(false)
});

export const quests = sqliteTable('Quest', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	description: text('description').notNull(),
	domain: text('domain').notNull()
});

export const questCompletions = sqliteTable('QuestCompletion', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	date: integer('date', { mode: 'timestamp' }).notNull(),
	userId: integer('userId')
		.notNull()
		.references(() => users.id),
	questId: integer('questId')
		.notNull()
		.references(() => quests.id)
});

export const journalEntries = sqliteTable('journal_entries', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	date: text('date').notNull(), // Store as 'YYYY-MM-DD'
	content: text('content').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`)
});

export const pushSubscriptions = sqliteTable('push_subscriptions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	subscriptionJson: text('subscription_json').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`)
});
