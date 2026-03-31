"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const session = await auth();
  
  // Debugging: This will print to your VS Code terminal
  console.log("Session in Action:", session);

  if (!session?.user?.id) {
    throw new Error("Unauthorized: No session found");
  }

  const content = formData.get("content") as string;
  if (!content || content.length < 1) return;

  try {
    await db.post.create({
      data: {
        content,
        authorId: session.user.id,
      },
    });

    revalidatePath("/feed");
  } catch (error) {
    console.error("Post Creation Error:", error);
    throw new Error("Failed to create post");
  }
}

export async function toggleReaction(postId: string, type: "HEART" | "ZAP" | "FIRE" | "THUMBS_UP" | "SAD") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  // Check if this specific reaction already exists
  const existing = await db.reaction.findUnique({
    where: {
      postId_authorId_type: { postId, authorId: userId, type },
    },
  });

  if (existing) {
    // If it exists, user is clicking it again to "un-react"
    await db.reaction.delete({ where: { id: existing.id } });
  } else {
    // Create the new reaction
    await db.reaction.create({
      data: { postId, authorId: userId, type },
    });
  }

  revalidatePath("/feed");
}

export async function createComment(postId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const content = formData.get("content") as string;
  
  if (!content || content.trim() === "") return;

  try {
    await db.comment.create({
      data: {
        content,
        postId,
        authorId: session.user.id,
      },
    });

    // Refresh the feed to show the new comment instantly
    revalidatePath("/feed");
  } catch (error) {
    console.error("Failed to add comment:", error);
    throw new Error("Could not post comment");
  }
}

export async function updateUserProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const image = formData.get("image") as string; // This will be the ImgBB URL

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(bio && { bio }),
        ...(image && { image }), // Only update image if a new one was provided
      },
    });

    // Refresh both the profile page and the feed so the new avatar shows up instantly
    revalidatePath(`/user/${session.user.id}`);
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
      method: 'POST',
      body: formData, // Securely sending the image file
    });

    const result = await response.json();

    if (!response.ok || !result.data || !result.data.url) {
      console.error('ImgBB API Error:', result);
      throw new Error(`Failed to upload image: ${result.error?.message || 'Unknown error'}`);
    }

    return result.data.url as string;
  } catch (error) {
    console.error("Image Upload Error:", error);
    throw new Error("Failed to upload image");
  }
}