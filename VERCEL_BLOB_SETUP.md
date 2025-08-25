# Vercel Blob Setup Guide

## 🚀 **Setup Steps:**

### 1. **Get Your Blob Token:**
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Navigate to Storage → Blob
- Create a new Blob store
- Copy your `BLOB_READ_WRITE_TOKEN`

### 2. **Update Environment Variables:**
Replace `your_blob_token_here` in `.env.local` with your actual token:
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. **Deploy to Vercel:**
```bash
npm run build
vercel --prod
```

## 🔧 **How It Works:**

1. **Upload Flow:**
   - User selects video file
   - File is sent to `/api/upload-video`
   - API uploads to Vercel Blob
   - Returns public URL
   - URL is stored in database

2. **Storage Benefits:**
   - Global CDN for fast video delivery
   - Automatic optimization
   - Scalable storage
   - Integrated with Vercel deployments

## 📱 **Features:**

- ✅ Video file validation (type & size)
- ✅ Unique filename generation
- ✅ Public access for video playback
- ✅ Error handling and user feedback
- ✅ Progress tracking during upload

## 🎬 **Video Support:**

- **Formats:** MP4, MOV, AVI, WebM
- **Max Size:** 200MB
- **Quality:** Original quality preserved
- **Access:** Public URLs for embedding

## 🚨 **Important Notes:**

- Keep your `BLOB_READ_WRITE_TOKEN` secret
- Videos are stored permanently (no auto-deletion)
- Consider implementing cleanup for unused videos
- Monitor storage usage in Vercel dashboard
