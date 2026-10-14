import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getBookmarkedPosts, getExploreUsers } from "@/lib/data";
import AppShell from "@/components/AppShell";
import PostCard from "@/components/PostCard";
import { Bookmark, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function BookmarksPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/bookmarks");
  }

  const currentUserId = session.user.id;
  const [bookmarkedPosts, exploreUsers] = await Promise.all([
    getBookmarkedPosts(currentUserId),
    getExploreUsers(currentUserId),
  ]);

  return (
    <AppShell user={session.user as any} exploreUsers={exploreUsers}>
      <div className="space-y-4">
        <div className="linear-card p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center text-zinc-300">
              <Bookmark size={15} />
            </div>
            <div>
              <h1 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Saved Bookmarks
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono">
                {bookmarkedPosts.length} archived
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {bookmarkedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post as any}
              currentUserId={currentUserId}
            />
          ))}

          {bookmarkedPosts.length === 0 && (
            <div className="linear-panel p-12 text-center rounded-xl space-y-2">
              <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mx-auto">
                <Sparkles size={16} />
              </div>
              <h3 className="text-xs font-semibold text-white">No Saved Bookmarks</h3>
              <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                Click the bookmark icon on any pulse in the feed to save it here.
              </p>
              <Link
                href="/feed"
                className="inline-block pt-1 text-xs font-semibold text-white hover:underline font-mono"
              >
                Global Stream &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
