import { getUserProfile } from "@/lib/data";
import { notFound } from "next/navigation";
import ReactionButtons from "@/components/ReactionButtons";
import CommentSection from "@/components/CommentSection";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import EditProfile from "@/components/EditProfile";
import { auth } from "@/auth";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the params to safely extract the ID
  const resolvedParams = await params;
  const user = await getUserProfile(resolvedParams.id);
  const session = await auth(); // Get the current logged-in user

  if (!user) return notFound();

  // Check if the profile belongs to the logged-in user
  const isOwnProfile = session?.user?.id === user.id;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 selection:bg-blue-500/30">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Navigation & Profile Header */}
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-500/10 blur-[100px] rounded-full"></div>

          <Link href="/feed" className="text-sm text-blue-400 hover:text-blue-300 mb-6 inline-block transition-colors relative z-10">
            &larr; Back to Global Feed
          </Link>

          <div className="flex items-start gap-6 relative z-10">
            {/* Display the Image if they have one, otherwise show initial */}
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Profile"}
                className="w-24 h-24 rounded-full object-cover shadow-xl shadow-blue-500/20 border-4 border-[#050505]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-4xl font-bold shadow-xl shadow-blue-500/20 border-4 border-[#050505]">
                {user.name?.charAt(0) || "U"}
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
              <p className="text-gray-400 mt-1 max-w-md">
                {user.bio || "This user prefers to keep an air of mystery..."}
              </p>
              <div className="mt-3 text-xs text-gray-500 uppercase tracking-widest font-semibold">
                {user.posts.length} Pulses Synced
              </div>

              {/* Only render the edit component if it's their own profile */}
              {isOwnProfile && <EditProfile user={user} />}
            </div>
          </div>
        </div>

        {/* The User's Specific Feed */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-white/80 px-2">Recent Pulses</h2>

          {user.posts.map((post) => (
            <div
              key={post.id}
              className="group p-6 bg-white/[0.03] border border-white/5 rounded-3xl hover:border-white/20 transition-all duration-300 shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                  {formatDistanceToNow(new Date(post.createdAt))} ago
                </p>
              </div>

              <p className="text-gray-200 leading-relaxed mb-4 whitespace-pre-wrap">
                {post.content}
              </p>

              <ReactionButtons postId={post.id} reactions={post.reactions || []} />
              <CommentSection postId={post.id} comments={post.comments || []} />
            </div>
          ))}

          {user.posts.length === 0 && (
            <div className="text-center p-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <p className="text-gray-500 italic">No pulses found. It's quiet here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}