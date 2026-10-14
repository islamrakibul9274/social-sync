import Link from "next/link";
import { auth } from "@/auth";
import { getPosts, getExploreUsers } from "@/lib/data";
import AppShell from "@/components/AppShell";
import PostForm from "@/components/PostForm";
import PostCard from "@/components/PostCard";
import { Compass, Users, Sparkles, X } from "lucide-react";

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{
    feedType?: "all" | "following";
    tag?: string;
    search?: string;
  }>;
}) {
  const session = await auth();
  const resolvedSearchParams = await searchParams;
  const currentUserId = session?.user?.id;

  const feedType = resolvedSearchParams.feedType || "all";
  const activeTag = resolvedSearchParams.tag;
  const activeSearch = resolvedSearchParams.search;

  const [posts, exploreUsers] = await Promise.all([
    getPosts({
      feedType,
      tag: activeTag,
      search: activeSearch,
      currentUserId,
    }),
    getExploreUsers(currentUserId),
  ]);

  return (
    <AppShell user={session?.user as any} exploreUsers={exploreUsers}>
      <div className="space-y-4">
        {/* ========================================================= */}
        {/* FEED FILTER TABS & SEARCH BANNER */}
        {/* ========================================================= */}
        <div className="linear-card p-1.5 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Link
              href="/feed"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                feedType === "all" && !activeTag && !activeSearch
                  ? "bg-zinc-800 text-white font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Compass size={13} />
              <span>For You</span>
            </Link>

            {currentUserId && (
              <Link
                href="/feed?feedType=following"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  feedType === "following"
                    ? "bg-zinc-800 text-white font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Users size={13} />
                <span>Following</span>
              </Link>
            )}
          </div>

          {/* Active Tag or Search Pill */}
          {(activeTag || activeSearch) && (
            <div className="flex items-center gap-1.5 pr-1.5">
              <span className="text-[11px] font-mono text-zinc-300 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 flex items-center gap-1.5">
                {activeTag ? `#${activeTag}` : `"${activeSearch}"`}
                <Link href="/feed" className="hover:text-white">
                  <X size={11} />
                </Link>
              </span>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* POST COMPOSER */}
        {/* ========================================================= */}
        {currentUserId && (
          <PostForm user={session?.user} />
        )}

        {/* ========================================================= */}
        {/* PULSE STREAM */}
        {/* ========================================================= */}
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post as any}
              currentUserId={currentUserId}
            />
          ))}

          {posts.length === 0 && (
            <div className="linear-panel p-12 text-center rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mx-auto">
                <Sparkles size={16} />
              </div>
              <h3 className="text-xs font-semibold text-white">Stream Idle</h3>
              <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                {activeTag
                  ? `No pulses found tagged with #${activeTag}.`
                  : activeSearch
                  ? `No results found for "${activeSearch}".`
                  : "No pulses in this stream yet. Broadcast your thoughts above!"}
              </p>
              {(activeTag || activeSearch || feedType === "following") && (
                <Link
                  href="/feed"
                  className="inline-block pt-1 text-xs font-semibold text-white hover:underline font-mono"
                >
                  Clear Filters &rarr;
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}