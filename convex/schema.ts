import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    display_name: v.string(),
    username: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    profile_img: v.optional(v.string()),
    company_name: v.optional(v.string()),
    company_type: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    postal: v.optional(v.string()),
    country: v.optional(v.string()),
    company_number: v.optional(v.string()),
    // New fields for reels
    followerCount: v.number(),
    followingCount: v.number(),
    videoCount: v.number(),
    totalLikes: v.number(),
    isVerified: v.boolean(),
    instagram: v.optional(v.string()),
    tiktok: v.optional(v.string()),
    youtube: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_username", ["username"])
    .index("by_email", ["email"])
    .index("by_company_name", ["company_name"])
    .index("by_followers", ["followerCount"]),

  videos: defineTable({
    videoUrl: v.string(),
    duration: v.number(),
    caption: v.optional(v.string()),
    creatorId: v.id("users"),
    creatorUsername: v.string(),
    likes: v.number(),
    views: v.number(),
    shares: v.number(),
    comments: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_creator", ["creatorId"])
    .index("by_created_at", ["createdAt"])
    .index("by_engagement", ["likes", "views"]),

  likes: defineTable({
    userId: v.id("users"),
    videoId: v.id("videos"),
    createdAt: v.number(),
  })
    .index("by_video", ["videoId"])
    .index("by_user", ["userId"])
    .index("by_video_user", ["videoId", "userId"]),

  comments: defineTable({
    userId: v.id("users"),
    videoId: v.id("videos"),
    parentCommentId: v.optional(v.id("comments")),
    text: v.string(),
    likes: v.number(),
    isEdited: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_video", ["videoId"])
    .index("by_user", ["userId"])
    .index("by_parent", ["parentCommentId"]),

  shares: defineTable({
    userId: v.id("users"),
    videoId: v.id("videos"),
    shareType: v.string(),
    shareText: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_video", ["videoId"])
    .index("by_user", ["userId"]),

  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_follower_following", ["followerId", "followingId"]),

  videoViews: defineTable({
    userId: v.optional(v.id("users")),
    videoId: v.id("videos"),
    watchTime: v.number(),
    completed: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_video", ["videoId"])
    .index("by_user", ["userId"]),
});
