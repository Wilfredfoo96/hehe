# Association App

A modern reels application built with Next.js, Convex, and Vercel Blob.

## Features

- 🎬 **Video Reels System** - Upload and share short-form videos
- 👤 **User Management** - Email-based user profiles and authentication
- 🗄️ **Convex Backend** - Real-time database with automatic sync
- ☁️ **Vercel Blob Storage** - Scalable video storage and delivery
- 📱 **Responsive Design** - Mobile-first interface

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Convex (Database + Real-time functions)
- **Storage**: Vercel Blob for video files
- **Auth**: Clerk for user authentication
- **Styling**: Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`

## Environment Variables

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_url
CONVEX_DEPLOYMENT=your_deployment

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_blob_token

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

## Deployment

This app is optimized for Vercel deployment with integrated Blob storage.

---

*Last updated: August 26, 2025*
