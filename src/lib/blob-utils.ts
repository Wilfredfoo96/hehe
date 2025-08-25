import { list, del, head } from '@vercel/blob';

export interface BlobVideo {
  pathname: string;
  url: string;
  downloadUrl: string;
  size: number;
  uploadedAt: string;
  type?: string;
}

/**
 * List all videos from the blob store with optional filtering
 */
export async function listVideos(options?: {
  prefix?: string;
  limit?: number;
  cursor?: string;
  folder?: string;
}): Promise<{ blobs: BlobVideo[]; cursor?: string }> {
  try {
    const prefix = options?.folder ? `videos/${options.folder}/` : 'videos/';
    
    const response = await list({
      prefix,
      limit: options?.limit || 100,
      cursor: options?.cursor,
    });

    // Filter for video files and map to our interface
    const videoBlobs = response.blobs
      .filter(blob => {
        const extension = blob.pathname.split('.').pop()?.toLowerCase();
        return ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(extension || '');
      })
      .map(blob => ({
        pathname: blob.pathname,
        url: blob.url,
        downloadUrl: blob.downloadUrl,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
        type: blob.pathname.split('.').pop() || 'video',
      }));

    return {
      blobs: videoBlobs,
      cursor: response.cursor,
    };
  } catch (error) {
    console.error('Error listing videos:', error);
    throw new Error('Failed to list videos from blob store');
  }
}

/**
 * Get video metadata by pathname
 */
export async function getVideoMetadata(pathname: string): Promise<BlobVideo | null> {
  try {
    const blob = await head(pathname);
    
    if (!blob) return null;

    return {
      pathname: blob.pathname,
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
      type: blob.pathname.split('.').pop() || 'video',
    };
  } catch (error) {
    console.error('Error getting video metadata:', error);
    return null;
  }
}

/**
 * Delete a video from the blob store
 */
export async function deleteVideo(pathname: string): Promise<boolean> {
  try {
    await del(pathname);
    return true;
  } catch (error) {
    console.error('Error deleting video:', error);
    return false;
  }
}

/**
 * List videos by date folder (YYYY-MM-DD format)
 */
export async function listVideosByDate(date: string): Promise<BlobVideo[]> {
  try {
    const response = await list({
      prefix: `videos/${date}/`,
      limit: 1000,
    });

    return response.blobs
      .filter(blob => {
        const extension = blob.pathname.split('.').pop()?.toLowerCase();
        return ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(extension || '');
      })
      .map(blob => ({
        pathname: blob.pathname,
        url: blob.url,
        downloadUrl: blob.downloadUrl,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
        type: blob.pathname.split('.').pop() || 'video',
      }));
  } catch (error) {
    console.error('Error listing videos by date:', error);
    return [];
  }
}

/**
 * Get storage usage statistics
 */
export async function getStorageStats(): Promise<{
  totalSize: number;
  totalVideos: number;
  averageSize: number;
}> {
  try {
    const response = await list({
      prefix: 'videos/',
      limit: 1000,
    });

    const videos = response.blobs.filter(blob => {
      const extension = blob.pathname.split('.').pop()?.toLowerCase();
      return ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(extension || '');
    });

    const totalSize = videos.reduce((sum, blob) => sum + blob.size, 0);
    const totalVideos = videos.length;
    const averageSize = totalVideos > 0 ? totalSize / totalVideos : 0;

    return {
      totalSize,
      totalVideos,
      averageSize,
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return {
      totalSize: 0,
      totalVideos: 0,
      averageSize: 0,
    };
  }
}
