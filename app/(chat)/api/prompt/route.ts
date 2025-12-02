import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ChatSDKError } from "@/lib/errors";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  const result = await db
    .select({ customPrompt: user.customPrompt })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  return Response.json(result[0] || { customPrompt: null });
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  try {
    const { customPrompt } = await request.json();

    await db
      .update(user)
      .set({ customPrompt })
      .where(eq(user.id, session.user.id));

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating custom prompt:", error);
    return Response.json({ error: "Failed to update custom prompt" }, { status: 500 });
  }
}
