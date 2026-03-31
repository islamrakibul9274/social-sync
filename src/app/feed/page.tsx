import Link from "next/link";
import { auth } from "@/auth";
import { getPosts } from "@/lib/data";
import PostForm from "@/components/PostForm";
import SignOutButton from "@/components/SignOutButton";
import ReactionButtons from "@/components/ReactionButtons";
import CommentSection from "@/components/CommentSection";
import { formatDistanceToNow } from "date-fns";

export default async function FeedPage() {
  const session = await auth();
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 selection:bg-blue-500/30">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header with Glassmorphism */}
        <div className="flex justify-between items-center p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-2xl sticky top-4 z-50 shadow-2xl shadow-black/50">

          {/* 1. Logo linked to Landing Page */}
          <Link href="/">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-tight hover:opacity-80 transition-opacity cursor-pointer">
              SocialSync Feed
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            {/* 2. Current User's Avatar linked to their Profile */}
            <Link href={`/user/${session?.user?.id}`} className="flex items-center gap-3 group">
              <span className="text-sm text-gray-400 hidden sm:inline font-medium group-hover:text-white transition-colors">
                {session?.user?.name}
              </span>

              {/* Check if logged-in user has an uploaded image */}
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border border-white/20 group-hover:border-blue-400 transition-colors shadow-lg"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg border border-white/10 group-hover:border-blue-400 transition-colors">
                  {session?.user?.name?.charAt(0) || "U"}
                </div>
              )}
            </Link>

            <SignOutButton />
          </div>
        </div>

        {/* The Post Input Area */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md shadow-xl">
          <PostForm />
        </div>

        {/* The Actual Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group p-6 bg-white/[0.03] border border-white/5 rounded-3xl hover:border-white/20 transition-all duration-300 hover:bg-white/[0.05] shadow-lg"
            >
              {/* Post Header Info */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  
                  {/* 3. Post Author's Avatar with Image Upload Support */}
                  <Link href={`/user/${post.authorId}`} className="w-10 h-10 rounded-full flex-shrink-0 shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform">
                    {post.author?.image ? (
                      <img 
                        src={post.author.image} 
                        alt={post.author.name || "User"} 
                        className="w-10 h-10 rounded-full object-cover border border-white/10" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-sm font-bold border border-white/10">
                        {post.author?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </Link>
                  
                  <div>
                    <Link href={`/user/${post.authorId}`}>
                      <p className="font-semibold text-sm hover:text-blue-400 transition-colors cursor-pointer">
                        {post.author?.name}
                      </p>
                    </Link>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                      {formatDistanceToNow(new Date(post.createdAt))} ago
                    </p>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-200 leading-relaxed mb-4 whitespace-pre-wrap">
                {post.content}
              </p>

              {/* Interactive Section (Reactions & Comments) */}
              <div className="pt-4 border-t border-white/5">
                <ReactionButtons
                  postId={post.id}
                  reactions={post.reactions || []}
                />
                <CommentSection postId={post.id} comments={post.comments || []} />
              </div>
            </div>
          ))}

          {/* Empty State */}
          {posts.length === 0 && (
            <div className="text-center p-20 bg-white/5 rounded-3xl border border-dashed border-white/10 animate-pulse">
              <p className="text-gray-500 italic">The silence is deafening. Say something!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}