import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getUserConversations,
  getAllUsersForChat,
  getExploreUsers,
} from "@/lib/data";
import AppShell from "@/components/AppShell";
import ChatContainer from "@/components/chat/ChatContainer";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ conversationId?: string; userId?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/messages");
  }

  const resolvedSearchParams = await searchParams;
  const currentUserId = session.user.id;

  const [conversations, allUsers, exploreUsers] = await Promise.all([
    getUserConversations(currentUserId),
    getAllUsersForChat(currentUserId),
    getExploreUsers(currentUserId),
  ]);

  return (
    <AppShell
      user={session.user as any}
      exploreUsers={exploreUsers}
      hideRightRail={true}
    >
      <ChatContainer
        currentUserId={currentUserId}
        conversations={conversations}
        allUsers={allUsers}
        initialConversationId={resolvedSearchParams.conversationId}
        targetUserId={resolvedSearchParams.userId}
      />
    </AppShell>
  );
}
