import { createComment } from "@/lib/actions";
import { formatDistanceToNow } from "date-fns";

export default function CommentSection({ 
  postId, 
  comments 
}: { 
  postId: string; 
  comments: any[] 
}) {
  // Bind the postId to the action so it knows where to attach the comment
  const addCommentWithId = createComment.bind(null, postId);

  return (
    <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
      
      {/* Existing Comments List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 text-sm">
            <div className="w-6 h-6 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
              {comment.author?.name?.charAt(0) || "U"}
            </div>
            <div className="bg-white/5 rounded-2xl rounded-tl-none px-4 py-2 flex-1">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-semibold text-blue-400">{comment.author?.name}</span>
                <span className="text-[9px] text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt))} ago
                </span>
              </div>
              <p className="text-gray-300">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Comment Form */}
      <form action={addCommentWithId} className="flex gap-2">
        <input
          type="text"
          name="content"
          placeholder="Write a reply..."
          className="flex-1 bg-black/40 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 transition-all"
          required
        />
        <button 
          type="submit"
          className="bg-blue-600/80 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          Reply
        </button>
      </form>
    </div>
  );
}