'use client';

import { useOptimistic, useRef } from 'react';
import { createPost } from '@/lib/actions';
import { Send } from 'lucide-react';

export default function PostForm({ user }: { user: any }) {
  const formRef = useRef<HTMLFormElement>(null);
  
  // This is the "Magic" that makes it feel fast
  const [optimisticPosts, addOptimisticPost] = useOptimistic(
    [],
    (state: any, newPost: any) => [newPost, ...state]
  );

  async function action(formData: FormData) {
    const content = formData.get('content') as string;
    if (!content) return;

    // 1. Add it to the screen instantly
    addOptimisticPost({
      id: Math.random().toString(),
      content,
      author: { name: user?.name || 'You' },
      createdAt: new Date(),
    });

    // 2. Clear the input
    formRef.current?.reset();

    // 3. Actually save to MongoDB
    await createPost(formData);
  }

  return (
    <form ref={formRef} action={action} className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl mb-8">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-500 flex-shrink-0" />
        <textarea
          name="content"
          placeholder="What's happening in the future?"
          className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 resize-none py-2"
          rows={2}
        />
        <button type="submit" className="self-end p-3 bg-indigo-500 hover:bg-indigo-600 rounded-2xl text-white transition-all">
          <Send size={20} />
        </button>
      </div>
    </form>
  );
}