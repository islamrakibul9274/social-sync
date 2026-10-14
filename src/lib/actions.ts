"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized: No session found");
  }

  const content = formData.get("content") as string;
  const image = (formData.get("image") as string) || null;
  const tag = (formData.get("tag") as string) || null;

  if (!content || content.trim().length < 1) return;

  try {
    await db.post.create({
      data: {
        content: content.trim(),
        image: image || undefined,
        tag: tag ? tag.trim().toLowerCase() : undefined,
        authorId: session.user.id,
      },
    });

    revalidatePath("/feed");
    revalidatePath("/dashboard");
    revalidatePath(`/user/${session.user.id}`);
  } catch (error) {
    console.error("Post Creation Error:", error);
    throw new Error("Failed to create post");
  }
}

export async function deletePost(postId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const post = await db.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post || post.authorId !== session.user.id) {
      throw new Error("Not allowed to delete this pulse");
    }

    await db.post.delete({
      where: { id: postId },
    });

    revalidatePath("/feed");
    revalidatePath("/dashboard");
    revalidatePath(`/user/${session.user.id}`);
    return { success: true };
  } catch (error) {
    console.error("Delete Post Error:", error);
    throw new Error("Failed to delete post");
  }
}

export async function toggleReaction(
  postId: string,
  type: "HEART" | "ZAP" | "FIRE" | "THUMBS_UP" | "SAD"
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  const existing = await db.reaction.findUnique({
    where: {
      postId_authorId_type: { postId, authorId: userId, type },
    },
  });

  if (existing) {
    await db.reaction.delete({ where: { id: existing.id } });
  } else {
    await db.reaction.create({
      data: { postId, authorId: userId, type },
    });
  }

  revalidatePath("/feed");
  revalidatePath(`/user/${userId}`);
}

export async function createComment(postId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const content = formData.get("content") as string;
  if (!content || content.trim() === "") return;

  try {
    await db.comment.create({
      data: {
        content: content.trim(),
        postId,
        authorId: session.user.id,
      },
    });

    revalidatePath("/feed");
  } catch (error) {
    console.error("Failed to add comment:", error);
    throw new Error("Could not post comment");
  }
}

export async function deleteComment(commentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const comment = await db.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });

    if (!comment || comment.authorId !== session.user.id) {
      throw new Error("Unauthorized to delete comment");
    }

    await db.comment.delete({ where: { id: commentId } });
    revalidatePath("/feed");
  } catch (error) {
    console.error("Failed to delete comment:", error);
    throw new Error("Could not delete comment");
  }
}

export async function toggleBookmark(postId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  const existing = await db.bookmark.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
  });

  if (existing) {
    await db.bookmark.delete({ where: { id: existing.id } });
  } else {
    await db.bookmark.create({
      data: { userId, postId },
    });
  }

  revalidatePath("/feed");
  revalidatePath("/bookmarks");
  revalidatePath("/dashboard");
}

export async function toggleFollow(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  if (session.user.id === targetUserId) throw new Error("Cannot follow yourself");

  const currentUserId = session.user.id;

  const existing = await db.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    },
  });

  if (existing) {
    await db.follow.delete({ where: { id: existing.id } });
  } else {
    await db.follow.create({
      data: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    });
  }

  revalidatePath(`/user/${targetUserId}`);
  revalidatePath("/feed");
  revalidatePath("/dashboard");
}

export async function updateUserProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const headline = formData.get("headline") as string;
  const website = formData.get("website") as string;
  const github = formData.get("github") as string;
  const twitter = formData.get("twitter") as string;
  const image = formData.get("image") as string;
  const coverImage = formData.get("coverImage") as string;

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        bio: bio !== undefined ? bio : undefined,
        headline: headline !== undefined ? headline : undefined,
        website: website !== undefined ? website : undefined,
        github: github !== undefined ? github : undefined,
        twitter: twitter !== undefined ? twitter : undefined,
        ...(image && { image }),
        ...(coverImage && { coverImage }),
      },
    });

    revalidatePath(`/user/${session.user.id}`);
    revalidatePath("/dashboard");
    revalidatePath("/feed");
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw new Error("Update failed");
  }
}

export async function uploadImageToImgBB(formData: FormData) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("IMGBB_API_KEY is not defined");
  }

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.data || !result.data.url) {
      console.error("ImgBB API Error:", result);
      throw new Error(`Failed to upload image: ${result.error?.message || "Unknown error"}`);
    }

    return result.data.url as string;
  } catch (error) {
    console.error("Image Upload Error:", error);
    throw new Error("Failed to upload image");
  }
}

// -----------------------------------------------------------------------------
// Direct Chat Actions
// -----------------------------------------------------------------------------

export async function getOrCreateConversation(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const currentUserId = session.user.id;
  if (currentUserId === targetUserId) {
    throw new Error("Cannot start conversation with yourself");
  }

  // Look for existing conversation with these two participants
  const existingConversations = await db.conversation.findMany({
    where: {
      AND: [
        { participantIds: { has: currentUserId } },
        { participantIds: { has: targetUserId } },
      ],
    },
  });

  if (existingConversations.length > 0) {
    return existingConversations[0].id;
  }

  // Create new conversation
  const newConversation = await db.conversation.create({
    data: {
      participantIds: [currentUserId, targetUserId],
      lastMessageAt: new Date(),
    },
  });

  return newConversation.id;
}

export async function sendMessage(
  conversationId: string,
  content: string,
  image?: string
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if ((!content || content.trim() === "") && !image) {
    return null;
  }

  const currentUserId = session.user.id;

  // Check conversation participant
  const conversation = await db.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation || !conversation.participantIds.includes(currentUserId)) {
    throw new Error("Not a participant in this conversation");
  }

  const message = await db.message.create({
    data: {
      conversationId,
      senderId: currentUserId,
      content: content ? content.trim() : "",
      image: image || null,
      read: false,
    },
    include: {
      sender: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  // Update conversation lastMessageAt
  await db.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date() },
  });

  revalidatePath(`/messages`);
  return message;
}

export async function markMessagesAsRead(conversationId: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  const currentUserId = session.user.id;

  await db.message.updateMany({
    where: {
      conversationId,
      senderId: { not: currentUserId },
      read: false,
    },
    data: { read: true },
  });

  revalidatePath(`/messages`);
}