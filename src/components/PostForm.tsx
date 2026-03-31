'use client';

import { useOptimistic, useRef } from 'react';
import Image from 'next/image';
import { createPost } from '@/lib/actions';
import { Send } from 'lucide-react';

// Defined a proper interface for the user prop
interface PostFormProps {
  user: {
    name?: string | null;
    image?: string | null;
  } | undefined | null;
}

export default function PostForm({ user }: PostFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  
  // Optimistic UI for instant feedback
  const [optimisticPosts, addOptimisticPost] = useOptimistic(
    [],
    (state: any, newPost: any) => [newPost, ...state]
  );

  async function handleSubmit(formData: FormData) {
    const content = formData.get('content') as string;
    if (!content || content.trim() === "") return;

    // Add it to the screen instantly
    addOptimisticPost({
      id: Math.random().toString(),
      content,
      author: { name: user?.name || 'You', image: user?.image },
      createdAt: new Date(),
    });

    formRef.current?.reset();
    await createPost(formData);
  }

  return (
    <form ref={formRef} action={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl mb-8">
      <div className="flex gap-4">
        {/* Avatar in the input area */}
        <div className="w-10 h-10 rounded-full flex-shrink-0 relative overflow-hidden bg-white/10 border border-white/10">
          {user?.image ? (
            <Image src={user.image} alt="User" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
              {user?.name?.charAt(0) || "?"}
            </div>
          )}
        </div>
        
        <textarea
          name="content"
          placeholder="What's happening in the future?"
          className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 resize-none py-2 text-lg outline-none"
          rows={2}
        />
        
        <button type="submit" className="self-end p-3 bg-indigo-500 hover:bg-indigo-600 rounded-2xl text-white transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
          <Send size={20} />
        </button>
      </div>
    </form>
  );
}