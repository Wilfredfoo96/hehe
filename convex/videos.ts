import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new video
export const createVideo = mutation({
  args: {
    videoUrl: v.string(),
    duration: v.number(),
    caption: v.optional(v.string()),
    creatorId: v.id("users"),
    creatorUsername: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("videos", {
      videoUrl: args.videoUrl,
      duration: args.duration,
      caption: args.caption,
      creatorId: args.creatorId,
      creatorUsername: args.creatorUsername,
      likes: 0,
      views: 0,
      shares: 0,
      comments: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get all videos (for feed)
export const getAllVideos = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    return await ctx.db
      .query("videos")
      .withIndex("by_created_at")
      .order("desc")
      .take(limit);
  },
});

// Get videos by creator
export const getVideosByCreator = query({
  args: { creatorId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("videos")
      .withIndex("by_creator", (q) => q.eq("creatorId", args.creatorId))
      .order("desc")
      .collect();
  },
});

// Get trending videos
export const getTrendingVideos = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    return await ctx.db
      .query("videos")
      .withIndex("by_engagement")
      .order("desc")
      .take(limit);
  },
});

// Get single video by ID
export const getVideoById = query({
  args: { videoId: v.id("videos") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.videoId);
  },
});

// Update video engagement metrics
export const updateVideoMetrics = mutation({
  args: {
    videoId: v.id("videos"),
    likes: v.optional(v.number()),
    views: v.optional(v.number()),
    shares: v.optional(v.number()),
    comments: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const video = await ctx.db.get(args.videoId);
    if (!video) throw new Error("Video not found");

    const updates: any = { updatedAt: Date.now() };
    if (args.likes !== undefined) updates.likes = args.likes;
    if (args.views !== undefined) updates.views = args.views;
    if (args.shares !== undefined) updates.shares = args.shares;
    if (args.comments !== undefined) updates.comments = args.comments;

    return await ctx.db.patch(args.videoId, updates);
  },
});

// Increment video view count
export const incrementVideoViews = mutation({
  args: { videoId: v.id("videos") },
  handler: async (ctx, args) => {
    const video = await ctx.db.get(args.videoId);
    if (!video) throw new Error("Video not found");

    return await ctx.db.patch(args.videoId, {
      views: video.views + 1,
      updatedAt: Date.now(),
    });
  },
});

// Delete video
export const deleteVideo = mutation({
  args: { videoId: v.id("videos") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.videoId);
  },
});
