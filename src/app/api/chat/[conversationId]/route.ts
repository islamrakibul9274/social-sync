import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getConversationMessages } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const conversationId = resolvedParams.conversationId;

    const data = await getConversationMessages(
      conversationId,
      session.user.id
    );

    if (!data) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET_CHAT_MESSAGES_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
