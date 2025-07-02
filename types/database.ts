// This is a temporary type definition file to work around Prisma generation issues

// Extend the Clip model with our new fields for TypeScript compatibility
export interface ClipWithExternalFields {
  id: string;
  videoId: string;
  title: string | null;
  url: string;
  startTime: number;
  endTime: number;
  createdAt: Date;
  duration: number;
  externalCreatedAt: Date | null;
  externalId: string | null;
  filename: string;
  fileSize?: string | null; // New field for file size from API
  previewText?: string | null; // New field for preview text from API
  clipId?: string | null; // New field for clip ID from API
  processingId?: string | null; // New field for external API processing ID
  hasSrt: boolean;
  hasWordTimestamps: boolean;
  reason: string | null;
  subtitleFormat: string | null;
  subtitleId: string | null;
  subtitleUrl: string | null;
  withCaptions: boolean;
  wordTimestampFormat: string | null;
  wordTimestampId: string | null;
  wordTimestampUrl: string | null;
  video?: any;
}

// Extend the Video model with our new fields for TypeScript compatibility
export interface VideoWithExternalFields {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  originalUrl: string;
  duration: number;
  fileSize: number;
  uploadedAt: Date;
  status: string;
  processedAt: Date | null;
  uploadPath: string;
  error: string | null;
  externalJobId?: string | null; // Now stores processing_id from new API
  lastStatusCheck?: Date | null;
  aspectRatio?: string | null; // New field for aspect ratio selection
  numClipsRequested?: number | null; // New field for number of clips requested
  clips?: any[];
  user?: any;
}

// New interface for clip data from the new API
export interface NewApiClip {
  clip_id: number;
  filename: string;
  duration: number;
  preview_text: string;
  file_size: string;
  start_time: number;
  end_time: number;
  download_url: string;
  captions_url: string;
}

// New interface for the processing status response
export interface ProcessingStatusResponse {
  processing_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  current_step: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  estimated_remaining?: string;
  total_clips: number;
  input_filename: string;
  num_clips_requested: number;
  aspect_ratio: string;
  processing_time?: number;
  clips?: NewApiClip[];
  error?: string;
}

// New interface for upload response
export interface UploadResponse {
  processing_id: string;
  status: 'queued';
  message: string;
  original_filename: string;
  num_clips_requested: number;
  aspect_ratio: string;
  estimated_time: string;
  task_id?: string;
} 