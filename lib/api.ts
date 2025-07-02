/**
 * API utility functions for making requests to the new lightweight external API for video processing
 */

// API endpoint from environment variables - Updated for new API
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8000';

// Helper function to ensure URLs are properly formatted with the API endpoint
const formatApiUrl = (url: string): string => {
  if (!url) return '';
  
  // If the URL already starts with http:// or https://, return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // For relative paths, append to API_ENDPOINT
  return `${API_ENDPOINT}/${url.startsWith('/') ? url.substring(1) : url}`;
};

/**
 * Create a new video processing job with the new API
 * @param file - The video file to process
 * @param numClips - Number of clips to generate (default: 3)
 * @param aspectRatio - Aspect ratio for clips (9:16, 16:9, 1:1)
 * @returns The API response with processing_id and status
 */
export async function createVideoProcessingJob(
  file: File, 
  numClips: number = 3,
  aspectRatio: string = "9:16"
): Promise<Response> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("num_clips", numClips.toString());
  formData.append("ratio", aspectRatio);
  
  return fetch(`${API_ENDPOINT}/api/upload-video`, {
    method: 'POST',
    body: formData
  });
}

/**
 * Save video info to database after upload with new API response
 * @param file - The uploaded video file
 * @param processingId - Processing ID returned from the new API
 * @param aspectRatio - Selected aspect ratio
 * @param numClips - Number of clips requested
 * @param exactDuration - Exact video duration in seconds (if available)
 * @returns Response with the created video record
 */
export async function saveVideoToDatabase(
  file: File,
  processingId: string,
  aspectRatio: string,
  numClips: number,
  exactDuration?: number
): Promise<Response> {
  // Use exact duration if provided, otherwise estimate based on file size
  const duration = exactDuration !== undefined 
    ? exactDuration 
    : Math.round(file.size / (1024 * 1024) * 10); // ~10 seconds per MB
  
  const videoData = {
    // Don't send userId - API will use authenticated session user ID
    title: file.name,
    description: `Uploaded on ${new Date().toLocaleDateString()} - ${numClips} clips, ${aspectRatio} ratio`,
    originalUrl: `${API_ENDPOINT}/api/download/video/${processingId}/${file.name}`,
    duration: duration,
    fileSize: file.size,
    status: 'processing',
    uploadPath: `/uploads/${processingId}/${file.name}`,
    externalJobId: processingId, // Store processing_id for tracking
    aspectRatio: aspectRatio,
    numClipsRequested: numClips
  };
  
  return fetch('/api/videos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include', // Include authentication cookies
    body: JSON.stringify(videoData)
  });
}

/**
 * Get the status of a processing job using the new API
 * @param processingId - The processing ID to check
 * @returns The API response with job status and progress
 */
export async function getJobStatus(processingId: string): Promise<Response> {
  return fetch(`${API_ENDPOINT}/api/status/${processingId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/**
 * Cancel a processing job (delete job and files)
 * @param processingId - The processing ID to cancel
 * @returns The API response
 */
export async function cancelJob(processingId: string): Promise<Response> {
  return fetch(`${API_ENDPOINT}/api/jobs/${processingId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/**
 * Get a clip download URL from the new API
 * @param processingId - The processing ID
 * @param filename - The clip filename
 * @returns The complete clip download URL
 */
export function getClipUrl(processingId: string, filename: string): string {
  return `${API_ENDPOINT}/api/download/clips/${processingId}/${filename}`;
}

/**
 * Get a captions download URL from the new API
 * @param processingId - The processing ID
 * @param filename - The captions filename (without .json extension)
 * @returns The complete captions download URL
 */
export function getCaptionsUrl(processingId: string, filename: string): string {
  // Ensure filename has .json extension for captions
  const captionsFilename = filename.endsWith('.json') ? filename : `${filename}.json`;
  return `${API_ENDPOINT}/api/download/captions/${processingId}/${captionsFilename}`;
}

/**
 * Save processed clips to database with new API response format
 * @param videoId - The parent video ID in our database
 * @param processingId - The processing ID from external API
 * @param clips - Array of processed clips from new API response
 * @returns Response from the API
 */
export async function saveClipsToDatabase(
  videoId: string,
  processingId: string,
  clips: any[]
): Promise<Response> {
  // Transform clips to match our database structure
  const transformedClips = clips.map(clip => ({
    videoId: videoId,
    title: clip.preview_text || `Clip ${clip.clip_id}`,
    url: clip.download_url,
    startTime: clip.start_time,
    endTime: clip.end_time,
    duration: clip.duration,
    filename: clip.filename,
    fileSize: clip.file_size,
    captionsUrl: clip.captions_url,
    clipId: clip.clip_id,
    previewText: clip.preview_text
  }));

  return fetch('/api/clips', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include', // Include authentication cookies
    body: JSON.stringify({
      videoId,
      processingId,
      clips: transformedClips
    })
  });
}

/**
 * Save edited video to database
 * @param userId - User ID
 * @param videoData - Information about the edited video
 * @returns Response from the API
 */
export async function saveEditedVideoToDatabase(
  userId: string,
  videoData: {
    title: string;
    sourceType: string;
    sourceId: string;
    fileSize: number;
    duration: number;
    filePath: string;
    captionStyle?: any;
  }
): Promise<Response> {
  const editedVideoData = {
    userId,
    ...videoData
  };
  
  return fetch('/api/videos/edited', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(editedVideoData)
  });
}

/**
 * Check health of the new external API
 * @returns The API health response
 */
export async function checkApiHealth(): Promise<Response> {
  return fetch(`${API_ENDPOINT}/api/health`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/**
 * Get all processing jobs from the new API
 * @returns The API response with all jobs
 */
export async function getAllJobs(): Promise<Response> {
  return fetch(`${API_ENDPOINT}/api/jobs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}