import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import type { PlanType } from "@/lib/plans";
import { users } from "@/lib/schema";

export async function getUserPlan(userId: string): Promise<PlanType> {
	const [user] = await db
		.select({ subscriptionPlan: users.subscriptionPlan })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	return (user?.subscriptionPlan as PlanType) || "free";
}
