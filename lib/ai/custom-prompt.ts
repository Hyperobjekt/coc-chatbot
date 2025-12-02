import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getCustomPrompt(): Promise<string | null> {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const result = await db
    .select({ customPrompt: user.customPrompt })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  return result[0]?.customPrompt ?? null;
}
