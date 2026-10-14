import { db } from "@/lib/db";

export async function getPosts(filter?: {
  tag?: string;
  feedType?: "all" | "following";
  currentUserId?: string;
  search?: string;
}) {
  try {
    let whereClause: any = {};

    if (filter?.tag) {
      whereClause.tag = { equals: filter.tag, mode: "insensitive" };
    }

    if (filter?.search && filter.search.trim() !== "") {
      whereClause.content = {
        contains: filter.search.trim(),
        mode: "insensitive",
      };
    }

    if (filter?.feedType === "following" && filter.currentUserId) {
      // Find following IDs
      const follows = await db.follow.findMany({
        where: { followerId: filter.currentUserId },
        select: { followingId: true },
      });
      const followingIds = follows.map((f) => f.followingId);
      // Include own posts or followed posts
      whereClause.authorId = { in: [...followingIds, filter.currentUserId] };
    }

    const posts = await db.post.findMany({
      where: whereClause,
      take: 40,
      include: {
        author: {
          select: { id: true, name: true, image: true, headline: true },
        },
        reactions: true,
        bookmarks: true,
        comments: {
          include: {
            author: { select: { id: true, name: true, image: true } },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return posts;
  } catch (error) {
    console.error("Database Error in getPosts:", error);
    return [];
  }
}

export async function getUserProfile(userId: string, currentUserId?: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        posts: {
          include: {
            author: {
              select: { id: true, name: true, image: true, headline: true },
            },
            reactions: true,
            bookmarks: true,
            comments: {
              include: {
                author: { select: { id: true, name: true, image: true } },
              },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        followers: {
          select: { followerId: true },
        },
        following: {
          select: { followingId: true },
        },
      },
    });

    if (!user) return null;

    const isFollowing = currentUserId
      ? user.followers.some((f) => f.followerId === currentUserId)
      : false;

    return {
      ...user,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      isFollowing,
    };
  } catch (error) {
    console.error("Database Error in getUserProfile:", error);
    return null;
  }
}

export async function getDashboardMetrics(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        followers: true,
        following: true,
        posts: {
          include: {
            reactions: true,
            comments: {
              include: {
                author: { select: { id: true, name: true, image: true } },
              },
            },
            bookmarks: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) return null;

    const totalPulses = user.posts.length;

    // Calculate reactions received
    const reactionBreakdown = {
      HEART: 0,
      ZAP: 0,
      FIRE: 0,
      THUMBS_UP: 0,
      SAD: 0,
    };

    let totalReactionsReceived = 0;
    let totalCommentsReceived = 0;

    user.posts.forEach((post) => {
      totalCommentsReceived += post.comments.length;
      post.reactions.forEach((reaction) => {
        totalReactionsReceived++;
        if (reaction.type in reactionBreakdown) {
          reactionBreakdown[reaction.type as keyof typeof reactionBreakdown]++;
        }
      });
    });

    // 7-day activity cadence (pulses in last 7 days)
    const now = new Date();
    const cadence = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const dayStr = d.toLocaleDateString("en-US", { weekday: "short" });
      const datePrefix = d.toISOString().split("T")[0];

      const count = user.posts.filter((p) => {
        const postDate = new Date(p.createdAt).toISOString().split("T")[0];
        return postDate === datePrefix;
      }).length;

      return { day: dayStr, count };
    });

    // Recent activity (reactions and comments on user's posts)
    const recentActivities: any[] = [];
    user.posts.forEach((post) => {
      post.comments.forEach((c) => {
        recentActivities.push({
          id: `comment-${c.id}`,
          type: "COMMENT",
          authorName: c.author?.name || "Someone",
          authorImage: c.author?.image || null,
          content: c.content,
          postContent: post.content.substring(0, 40) + "...",
          postId: post.id,
          createdAt: c.createdAt,
        });
      });
    });

    // Sort recent activities by date
    recentActivities.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Bookmarked posts
    const bookmarks = await db.bookmark.findMany({
      where: { userId },
      include: {
        post: {
          include: {
            author: { select: { id: true, name: true, image: true } },
            reactions: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        coverImage: user.coverImage,
        headline: user.headline,
        bio: user.bio,
        website: user.website,
        github: user.github,
        twitter: user.twitter,
      },
      stats: {
        totalPulses,
        totalReactionsReceived,
        totalCommentsReceived,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        reactionBreakdown,
      },
      cadence,
      recentActivities: recentActivities.slice(0, 10),
      posts: user.posts,
      bookmarks: bookmarks.map((b) => b.post),
    };
  } catch (error) {
    console.error("Database Error in getDashboardMetrics:", error);
    return null;
  }
}

export async function getBookmarkedPosts(userId: string) {
  try {
    const bookmarks = await db.bookmark.findMany({
      where: { userId },
      include: {
        post: {
          include: {
            author: {
              select: { id: true, name: true, image: true, headline: true },
            },
            reactions: true,
            bookmarks: true,
            comments: {
              include: {
                author: { select: { id: true, name: true, image: true } },
              },
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return bookmarks.map((b) => b.post);
  } catch (error) {
    console.error("Database Error in getBookmarkedPosts:", error);
    return [];
  }
}

export async function getExploreUsers(currentUserId?: string) {
  try {
    const users = await db.user.findMany({
      where: currentUserId ? { id: { not: currentUserId } } : undefined,
      take: 6,
      select: {
        id: true,
        name: true,
        image: true,
        headline: true,
        bio: true,
        followers: currentUserId
          ? {
              where: { followerId: currentUserId },
              select: { id: true },
            }
          : false,
        _count: {
          select: { followers: true, posts: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return users.map((u) => ({
      id: u.id,
      name: u.name,
      image: u.image,
      headline: u.headline,
      bio: u.bio,
      followersCount: u._count.followers,
      postsCount: u._count.posts,
      isFollowing: currentUserId ? (u.followers as any[])?.length > 0 : false,
    }));
  } catch (error) {
    console.error("Database Error in getExploreUsers:", error);
    return [];
  }
}

export async function getUserConversations(userId: string) {
  try {
    const conversations = await db.conversation.findMany({
      where: {
        participantIds: {
          has: userId,
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            image: true,
            headline: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: {
        lastMessageAt: "desc",
      },
    });

    // Format conversations with partner info and unread count
    const formatted = await Promise.all(
      conversations.map(async (conv) => {
        const partner =
          conv.participants.find((p) => p.id !== userId) ||
          conv.participants[0];
        const lastMessage = conv.messages[0] || null;

        const unreadCount = await db.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: userId },
            read: false,
          },
        });

        return {
          id: conv.id,
          updatedAt: conv.updatedAt,
          lastMessageAt: conv.lastMessageAt,
          partner,
          lastMessage,
          unreadCount,
        };
      })
    );

    return formatted;
  } catch (error) {
    console.error("Database Error in getUserConversations:", error);
    return [];
  }
}

export async function getConversationMessages(
  conversationId: string,
  userId: string
) {
  try {
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          select: { id: true, name: true, image: true, headline: true },
        },
      },
    });

    if (!conversation || !conversation.participantIds.includes(userId)) {
      return null;
    }

    const messages = await db.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const partner =
      conversation.participants.find((p) => p.id !== userId) ||
      conversation.participants[0];

    return {
      conversationId: conversation.id,
      partner,
      messages,
    };
  } catch (error) {
    console.error("Database Error in getConversationMessages:", error);
    return null;
  }
}

export async function getAllUsersForChat(currentUserId: string) {
  try {
    const users = await db.user.findMany({
      where: { id: { not: currentUserId } },
      select: {
        id: true,
        name: true,
        image: true,
        headline: true,
      },
      take: 20,
    });
    return users;
  } catch (error) {
    console.error("Database Error in getAllUsersForChat:", error);
    return [];
  }
}