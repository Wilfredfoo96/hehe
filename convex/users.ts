import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user by username
export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
  },
});

// Get user by company name
export const getUsersByCompany = query({
  args: { companyName: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_company_name", (q) => q.eq("company_name", args.companyName))
      .collect();
  },
});

// Create or update user
export const upsertUser = mutation({
  args: {
    display_name: v.string(),
    username: v.string(),
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
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (existingUser) {
      // Update existing user
      return await ctx.db.patch(existingUser._id, {
        display_name: args.display_name,
        bio: args.bio,
        profile_img: args.profile_img,
        company_name: args.company_name,
        company_type: args.company_type,
        address: args.address,
        city: args.city,
        state: args.state,
        postal: args.postal,
        country: args.country,
        company_number: args.company_number,
        updatedAt: Date.now(),
      });
    } else {
      // Create new user
      return await ctx.db.insert("users", {
        display_name: args.display_name,
        username: args.username,
        bio: args.bio,
        profile_img: args.profile_img,
        company_name: args.company_name,
        company_type: args.company_type,
        address: args.address,
        city: args.city,
        state: args.state,
        postal: args.postal,
        country: args.country,
        company_number: args.company_number,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

// Get all users
export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Search users by company type
export const getUsersByCompanyType = query({
  args: { companyType: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("company_type"), args.companyType))
      .collect();
  },
});
