import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getUserProfile, getExploreUsers } from "@/lib/data";
import AppShell from "@/components/AppShell";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const session = await auth();
  const currentUserId = session?.user?.id;

  const [user, exploreUsers] = await Promise.all([
    getUserProfile(resolvedParams.id, currentUserId),
    getExploreUsers(currentUserId),
  ]);

  if (!user) return notFound();

  const isOwnProfile = currentUserId === user.id;

  return (
    <AppShell user={session?.user as any} exploreUsers={exploreUsers}>
      <div className="space-y-4">
        {/* Back Link */}
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors font-mono"
        >
          <ArrowLeft size={13} />
          <span>Stream</span>
        </Link>

        {/* Profile Card Header */}
        <ProfileHeader
          user={{
            ...user,
            postsCount: user.posts.length,
          }}
          isOwnProfile={isOwnProfile}
          currentUserId={currentUserId}
        />

        {/* User's Pulses Stream */}
        <div className="space-y-3 pt-2">
          <h2 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-1">
            Broadcast History ({user.posts.length})
          </h2>

          {user.posts.map((post) => (
            <PostCard
              key={post.id}
              post={post as any}
              currentUserId={currentUserId}
            />
          ))}

          {user.posts.length === 0 && (
            <div className="linear-panel p-12 text-center rounded-xl space-y-2">
              <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mx-auto">
                <Sparkles size={16} />
              </div>
              <p className="text-xs font-semibold text-white">No Pulses Broadcast</p>
              <p className="text-[11px] text-zinc-500">
                This creator has not broadcast any pulses yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}