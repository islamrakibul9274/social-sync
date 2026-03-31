import { db } from "@/lib/db";

export async function getPosts() {
  try {
    const posts = await db.post.findMany({
      take: 20, // Limits the feed to the 20 newest posts to prevent database crashes
      include: {
        author: { select: { name: true, image: true } },
        reactions: true,
        comments: {
          include: {
            author: { select: { name: true } },
          },
          orderBy: {
            createdAt: "asc", // Oldest comments at the top, newest at the bottom
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Newest posts at the top
      },
    });
    return posts;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export async function getUserProfile(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        posts: {
          include: {
            author: { select: { name: true, image: true } },
            reactions: true,
            comments: {
              include: {
                author: { select: { name: true } },
              },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { createdAt: "desc" }, // Newest posts first
        },
      },
    });
    return user;
  } catch (error) {
    console.error("Database Error:", error);
    return null;
  }
}