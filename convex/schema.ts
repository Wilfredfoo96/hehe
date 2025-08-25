import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_username", ["username"])
    .index("by_company_name", ["company_name"]),
});
