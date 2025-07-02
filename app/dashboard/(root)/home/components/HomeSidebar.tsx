"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  UploadCloud,
  HelpCircle,
  FolderPlus,
  Search,
  Import,
  X,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit2,
  Settings
} from "lucide-react";
import { GrSchedule } from "react-icons/gr";
import HomeHeader from "@/components/HomeHeader";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Role } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { VideoWithExternalFields, ProcessingStatusResponse, UploadResponse, NewApiClip } from "@/types/database";
import {
  getClipUrl,
  getCaptionsUrl,
  createVideoProcessingJob,
  getJobStatus,
  cancelJob,
  saveVideoToDatabase,
  saveClipsToDatabase,
  checkApiHealth
} from "@/lib/api";
import { MdPublish } from "react-icons/md";
import { useSession } from "next-auth/react";
import ClipsPagination from "@/components/dashboard/ClipsPagination";

// API endpoint from environment variable
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

// Extend Window interface to include our custom property
declare global {
  interface Window {
    apiErrorToastShown?: boolean;
  }
}

// Helper function to ensure URLs are properly formatted with the API endpoint
const getFullUrl = (url: string): string => {
  if (!url) return '';
  // If the URL already starts with http:// or https://, return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // For other relative paths, just append to API_ENDPOINT
  return `${API_ENDPOINT}/${url.startsWith('/') ? url.substring(1) : url}`;
};

// Interface for processed clips from new API
interface ProcessedClipNew {
  clipResult: NewApiClip;
  processingId: string;
}

// Interface for imported videos
interface ImportedVideo {
  id: string;
  title: string;
  originalUrl: string;
  fileSize: number;
  status: string;
  error?: string | null;
  externalJobId?: string;
  aspectRatio?: string;
  numClipsRequested?: number;
}

export default function HomeSidebar() {
  const router = useRouter();
  const { data: session } = useSession();
  
  // File upload states
  const [uploadedVideo, setUploadedVideo] = useState<{
    file: File | null;
    url: string | null;
    status: string;
    name: string;
    size: number;
    progress: number;
    error: string | null;
  }>({
    file: null,
    url: null,
    status: "idle",
    name: "",
    size: 0,
    progress: 0,
    error: null
  });

  // New upload settings states
  const [numClips, setNumClips] = useState<number>(3);
  const [aspectRatio, setAspectRatio] = useState<string>("9:16");
  const [showUploadSettings, setShowUploadSettings] = useState<boolean>(false);

  // Processing states
  const [jobId, setJobId] = useState<string>("");
  const [videoId, setVideoId] = useState<string>(""); // Store created video ID
  const [jobProgress, setJobProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [estimatedTime, setEstimatedTime] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<string>("");

  // Clips and videos states
  const [processedClips, setProcessedClips] = useState<ProcessedClipNew[]>([]); // Current session clips
  const [clipsList, setClipsList] = useState<any[]>([]); // Database clips
  const [uploadedVideosList, setUploadedVideosList] = useState<any[]>([]); // Database uploaded videos  
  const [importedVideos, setImportedVideos] = useState<ImportedVideo[]>([]);
  const [editedVideos, setEditedVideos] = useState<any[]>([]);

  // UI states
  const [videosOpen, setVideosOpen] = useState<boolean>(false);
  const [isLoadingClips, setIsLoadingClips] = useState<boolean>(false);
  const [isLoadingUploadedVideos, setIsLoadingUploadedVideos] = useState<boolean>(false);
  const [isLoadingImported, setIsLoadingImported] = useState<boolean>(false);
  const [isLoadingEditedVideos, setIsLoadingEditedVideos] = useState<boolean>(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentImportedPage, setCurrentImportedPage] = useState<number>(1);
  const [currentEditedVideoPage, setCurrentEditedVideoPage] = useState<number>(1);
  const [totalImportedPages, setTotalImportedPages] = useState<number>(1);
  const clipsPerPage = 6;

  // Refs for cleanup and state access
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const videoIdRef = useRef<string>(""); // Store videoId in ref for latest value access

  // Aspect ratio options
  const aspectRatioOptions = [
    { value: "9:16", label: "9:16 (Vertical/Stories)", description: "TikTok, Instagram Stories, YouTube Shorts" },
    { value: "16:9", label: "16:9 (Landscape)", description: "YouTube, Facebook, LinkedIn" },
    { value: "1:1", label: "1:1 (Square)", description: "Instagram Posts, Facebook Posts" }
  ];

  // Number of clips options
  const numClipsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Create buttons configuration
  const createBtns = [
    {
      label: "Long to Short",
      image: (
        <img 
          src="/video_to_short.webp" 
          alt="Video to Short" 
          className="w-32 h-24 object-cover mx-auto mb-2"
        />
      ),
      onClickHandler: () => {
        setShowUploadSettings(true);
      }
    },
    {
      label: "Short to Short",
      image: (
        <img 
          src="/short_to_short.webp" 
          alt="Short to Short" 
          className="w-32 h-24 object-cover mx-auto mb-2"
        />
      ),
      onClickHandler: () => {
        setShowUploadSettings(true);
      }
    },
    {
      label: "Faceless (Beta)",
      image: (
        <img 
          src="/faceless.webp" 
          alt="Faceless" 
          className="w-32 h-24 object-cover mx-auto mb-2"
        />
      ),
      onClickHandler: () => {
        toast({
          title: "Coming Soon",
          description: "Faceless video generation is coming soon!",
          variant: "default",
        });
      }
    }
  ];

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop: (files) => {
      if (files.length > 0) {
        uploadVideo(files[0]);
      }
    },
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv', '.webm']
    },
    multiple: false,
    disabled: uploadedVideo.status === "processing" || uploadedVideo.status === "uploading"
  });

  // Video upload function with new API
  const uploadVideo = async (file: File) => {
    if (!file) return;

    // Check if user is authenticated
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload videos",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadedVideo({
        file,
        url: URL.createObjectURL(file),
        status: "uploading",
        name: file.name,
        size: file.size,
        progress: 0,
        error: null
      });
      setVideosOpen(true);
      
      // Reset video ID for new upload
      setVideoId("");
      videoIdRef.current = ""; // Also reset ref

      // Get exact video duration
      const getExactVideoDuration = (videoFile: File): Promise<number> => {
        return new Promise((resolve) => {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            resolve(video.duration);
          };
          video.src = URL.createObjectURL(videoFile);
        });
      };

      const exactDuration = await getExactVideoDuration(file);
      console.log(`Exact video duration: ${exactDuration} seconds`);

      setJobProgress(10);
      setUploadStatus("Uploading video for processing...");

      // Create processing job with new API
      const jobResponse = await createVideoProcessingJob(file, numClips, aspectRatio);
      
      if (!jobResponse.ok) {
        throw new Error(`Upload failed: ${jobResponse.status}`);
      }

      const uploadResult: UploadResponse = await jobResponse.json();
      console.log("Upload response:", uploadResult);

      setJobId(uploadResult.processing_id);
      setJobProgress(30);
      setUploadStatus("Video uploaded, processing started...");
      setEstimatedTime(uploadResult.estimated_time);

      // Save to database (API will use authenticated user ID from session)
      const dbResponse = await saveVideoToDatabase(
        file,
        uploadResult.processing_id,
        aspectRatio,
        numClips,
        exactDuration
      );

      if (!dbResponse.ok) {
        const errorData = await dbResponse.json();
        console.error("Failed to save to database:", dbResponse.status, errorData);
        throw new Error(`Failed to save video to database: ${errorData.error || 'Unknown error'}`);
      }

      // Get the created video ID from the response
      const dbResult = await dbResponse.json();
      console.log("📊 Full database response:", dbResult);
      
      if (dbResult.success && dbResult.video?.id) {
        const capturedVideoId = dbResult.video.id;
        setVideoId(capturedVideoId);
        videoIdRef.current = capturedVideoId; // Also store in ref for polling function
        console.log("✅ Video saved to database with ID:", capturedVideoId);
        console.log("🔍 VideoId state and ref set to:", capturedVideoId);
      } else {
        console.error("❌ No video ID in database response:", dbResult);
        console.error("❌ Response structure:", {
          success: dbResult.success,
          hasVideo: !!dbResult.video,
          videoId: dbResult.video?.id,
          fullVideo: dbResult.video
        });
        throw new Error("Database response missing video ID");
      }

      setUploadedVideo(prev => ({
        ...prev,
        status: "processing"
      }));

      // Start polling for status
      startStatusPolling(uploadResult.processing_id);

    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadedVideo(prev => ({
        ...prev,
        status: "error",
        error: error.message
      }));
      
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Status polling function for new API
  const startStatusPolling = (processingId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await getJobStatus(processingId);
        
        if (!statusResponse.ok) {
          console.error("Status check failed");
          return;
        }

        const statusData: ProcessingStatusResponse = await statusResponse.json();
        console.log("Status data:", statusData);

        setJobProgress(statusData.progress);
        setCurrentStep(statusData.current_step);
        
        if (statusData.estimated_remaining) {
          setEstimatedTime(statusData.estimated_remaining);
        }

        if (statusData.status === "completed") {
          clearInterval(pollInterval);
          setJobProgress(100);
          setUploadStatus("Processing completed!");
          
          // Save clips to database
          if (statusData.clips && statusData.clips.length > 0) {
            // Transform clips for database
            const transformedClips = statusData.clips.map(clip => ({
              clipResult: clip,
              processingId: processingId
            }));
            
            setProcessedClips(transformedClips);
            
            // Save to database - use the actual video ID from ref (latest value)
            const currentVideoId = videoIdRef.current;
            console.log("🔍 Checking videoId for clips saving:", { 
              videoIdFromState: videoId,
              videoIdFromRef: currentVideoId, 
              hasVideoId: !!currentVideoId,
              videoIdType: typeof currentVideoId
            });
            
            if (currentVideoId) {
              try {
                console.log("📝 Saving clips to database:", {
                  videoId: currentVideoId,
                  processingId,
                  clipsCount: statusData.clips.length,
                  clips: statusData.clips.map(c => ({ 
                    clipId: c.clip_id, 
                    filename: c.filename, 
                    previewText: c.preview_text 
                  }))
                });
                
                const clipsResponse = await saveClipsToDatabase(currentVideoId, processingId, statusData.clips);
                
                if (clipsResponse.ok) {
                  const clipsResult = await clipsResponse.json();
                  console.log("✅ Clips saved to database successfully:", clipsResult);
                  
                  toast({
                    title: "Clips Saved",
                    description: `${statusData.clips.length} clips saved to database!`,
                    variant: "default",
                  });
                } else {
                  const errorData = await clipsResponse.json();
                  console.error("❌ Failed to save clips to database:", errorData);
                  
                  toast({
                    title: "Clips Save Failed",
                    description: "Failed to save clips to database",
                    variant: "destructive",
                  });
                }
              } catch (clipsError) {
                console.error("❌ Error saving clips:", clipsError);
                
                toast({
                  title: "Clips Save Error",
                  description: "Error occurred while saving clips",
                  variant: "destructive",
                });
              }
                          } else {
                console.error("❌ No video ID available to save clips");
                console.error("❌ VideoId values:", { 
                  stateValue: videoId, 
                  refValue: currentVideoId, 
                  stateType: typeof videoId,
                  refType: typeof currentVideoId
                });
                
                toast({
                  title: "Clips Save Failed",
                  description: "No video ID available to save clips",
                  variant: "destructive",
                });
              }
          }

          toast({
            title: "Processing Complete",
            description: `Generated ${statusData.total_clips} clips successfully!`,
            variant: "default",
          });

        } else if (statusData.status === "failed") {
          clearInterval(pollInterval);
          setUploadedVideo(prev => ({
            ...prev,
            status: "error",
            error: statusData.error || "Processing failed"
          }));

          toast({
            title: "Processing Failed",
            description: statusData.error || "An error occurred during processing",
            variant: "destructive",
          });
        }

      } catch (error: any) {
        console.error("Status polling error:", error);
      }
    }, 5000); // Poll every 5 seconds

    // Store interval reference for cleanup
    pollingIntervalRef.current = pollInterval;

    // Cleanup after 30 minutes to prevent infinite polling
    setTimeout(() => {
      clearInterval(pollInterval);
    }, 30 * 60 * 1000);
  };

  // Cancel job function
  const handleCancelJob = async () => {
    if (jobId) {
      try {
        await cancelJob(jobId);
        
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        setUploadedVideo(prev => ({
          ...prev,
          status: "cancelled"
        }));

        toast({
          title: "Job Cancelled",
          description: "Processing has been cancelled",
          variant: "default",
        });

      } catch (error: any) {
        console.error("Cancel error:", error);
        toast({
          title: "Cancel Failed",
          description: "Failed to cancel the job",
          variant: "destructive",
        });
      }
    }
  };

  // Load clips from database
  const loadClipsFromDatabase = async () => {
    try {
      setIsLoadingClips(true);
      console.log("📝 Loading clips from database...");
      
      const response = await fetch('/api/clips', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Clips loaded from database:", data);
        
        // Debug individual clips data
        if (data.clips && data.clips.length > 0) {
          console.log("🔍 First clip details:", {
            id: data.clips[0].id,
            filename: data.clips[0].filename,
            processingId: data.clips[0].processingId,
            videoId: data.clips[0].videoId
          });
        }
        
        setClipsList(data.clips || []);
      } else {
        console.error("❌ Failed to load clips:", response.status);
      }
    } catch (error) {
      console.error("❌ Error loading clips:", error);
    } finally {
      setIsLoadingClips(false);
    }
  };

  // Load uploaded videos from database  
  const loadUploadedVideosFromDatabase = async () => {
    try {
      setIsLoadingUploadedVideos(true);
      console.log("📝 Loading uploaded videos from database...");
      
      const response = await fetch('/api/videos', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Uploaded videos loaded from database:", data);
        setUploadedVideosList(data.videos || []);
      } else {
        console.error("❌ Failed to load uploaded videos:", response.status);
      }
    } catch (error) {
      console.error("❌ Error loading uploaded videos:", error);
    } finally {
      setIsLoadingUploadedVideos(false);
    }
  };

  // Test external API connectivity
  const testExternalApi = async () => {
    try {
      console.log("🧪 Testing external API connectivity...");
      const response = await fetch('/api/external/test', {
        method: 'GET',
        credentials: 'include'
      });
      
      const data = await response.json();
      console.log("🧪 External API test result:", data);
      
      if (data.success) {
        console.log("✅ External API is accessible");
      } else {
        console.error("❌ External API test failed:", data.error);
      }
    } catch (error) {
      console.error("❌ External API test error:", error);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    if (session?.user?.id) {
      console.log("🚀 Loading user data on component mount...");
      loadClipsFromDatabase();
      loadUploadedVideosFromDatabase();
      // Test external API connectivity
      testExternalApi();
    }
  }, [session?.user?.id]);

  // Refresh data when returning from edit page (detect URL change)
  useEffect(() => {
    const handleFocus = () => {
      console.log("🔄 Page focus detected, refreshing data...");
      if (session?.user?.id) {
        loadClipsFromDatabase();
        loadUploadedVideosFromDatabase();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [session?.user?.id]);

  return (
    <div className="">
      <HomeHeader pageName={"Home"} />

      <main className="p-10 w-full bg-bgWhite">
        <div className="">
          <div className="bg-yellow px-14 py-7 text-center rounded-3xl">
            <h6 className="text-4xl font-semibold">What do you want to create today?</h6>
            <p className="text-black font-semibold pt-3 pb-12 mt-2">Import/upload a long-form video and let AI take care of the rest. Or upload an existing Short for AI editing!</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mx-auto gap-1 -mt-10 px-0 sm:px-7">
            {createBtns.map((btn, index) => (
              <div key={index} className="relative text-center overflow-hidden" >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={btn.onClickHandler}
                  className="relative px-10 py-1 bg-bgWhite rounded-lg shadow-lg shadow-gray-700/10 border text-center cursor-pointer overflow-hidden h-36 w-64"
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute top-0 left-0 right-0 bottom-0 bg-yellow bg-opacity-85 flex items-center justify-center text-gray-900 font-semibold text-lg"
                  >
                    Start
                  </motion.p>
                  {btn.image}
                </motion.button>

                <p className="mt-4">{btn.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Settings Modal */}
        {showUploadSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Upload Settings</h3>
                <button
                  onClick={() => setShowUploadSettings(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Number of Clips Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Clips</label>
                  <select
                    value={numClips}
                    onChange={(e) => setNumClips(parseInt(e.target.value))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {numClipsOptions.map(num => (
                      <option key={num} value={num}>{num} clip{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                {/* Aspect Ratio Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
                  <div className="space-y-2">
                    {aspectRatioOptions.map(option => (
                      <label key={option.value} className="flex items-start space-x-3">
                        <input
                          type="radio"
                          name="aspectRatio"
                          value={option.value}
                          checked={aspectRatio === option.value}
                          onChange={(e) => setAspectRatio(e.target.value)}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Upload Button */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowUploadSettings(false);
                      // Trigger file upload
                      document.getElementById('file-upload')?.click();
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Choose Video File
                  </button>
                  
                  {/* Hidden file input */}
                  <input
                    id="file-upload"
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        uploadVideo(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />

                  <div className="text-center">
                    <span className="text-gray-500">or</span>
                  </div>

                  {/* Drag and Drop Area */}
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <UploadCloud className="mx-auto mb-2 text-gray-400" size={32} />
                    <p className="text-sm text-gray-600">
                      {isDragActive ? 'Drop the video here' : 'Drag & drop a video here'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <hr className="my-6 border-gray-300" />

        {/* Processing Status */}
        {uploadedVideo.status === "processing" && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-blue-900">Processing Video</h3>
              <button
                onClick={handleCancelJob}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Cancel
              </button>
            </div>
            <div className="mb-2">
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${jobProgress}%` }}
                ></div>
              </div>
            </div>
            <div className="text-sm text-blue-700">
              <p>{currentStep || uploadStatus}</p>
              {estimatedTime && <p>Estimated time: {estimatedTime}</p>}
              <p>Progress: {jobProgress}%</p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {uploadedVideo.status === "error" && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-medium text-red-900 mb-2">Processing Failed</h3>
            <p className="text-sm text-red-700">{uploadedVideo.error}</p>
            <button
              onClick={() => setUploadedVideo(prev => ({ ...prev, status: "idle" }))}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* My Shorts Section */}
        <div className="" data-section="clips">
          <div className="flex items-center justify-between mt-4">
            <div>
              <h6 className="text-lg font-medium">My Shorts</h6>
              <p className="text-sm mt-1">These are clips generated from your uploaded videos.</p>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Search size={18} className="absolute top-2 text-gray-500 left-2" />
                <input type="text" placeholder="Search" className="w-full p-1 pl-8 border rounded-md" />
              </div>
              <Link href="/dashboard/schedule" className="flex gap-2 items-center border px-3 py-1 rounded-md">
                <GrSchedule /> Schedule
              </Link>
            </div>
          </div>

          {/* Clips Display */}
          {isLoadingClips ? (
            <div className="flex justify-center items-center h-72 mt-6">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="ml-3 text-gray-700">Loading clips...</p>
            </div>
          ) : (processedClips.length > 0 || clipsList.length > 0) ? (
            <div className="mt-6">
              <ClipsPagination
                processedClips={processedClips}
                clipsList={clipsList}
                getClipUrl={getClipUrl}
                getCaptionsUrl={getCaptionsUrl}
                clipsPerPage={6}
              />
            </div>
          ) : (
            <div className="text-center py-12 mt-6">
              <UploadCloud className="mx-auto mb-4 text-gray-300" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clips yet</h3>
              <p className="text-gray-500 mb-4">Upload a video to generate clips automatically</p>
              <button
                onClick={() => setShowUploadSettings(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Upload Video
              </button>
            </div>
          )}
        </div>

        <hr className="my-8 border-gray-300" />

        {/* Uploaded Videos Section */}
        <div className="">
          <div className="flex items-center justify-between">
            <div>
              <h6 className="text-lg font-medium">My Videos</h6>
              <p className="text-sm mt-1">Your uploaded videos that were processed into clips.</p>
            </div>
          </div>

          {/* Uploaded Videos Display */}
          {isLoadingUploadedVideos ? (
            <div className="flex justify-center items-center h-48 mt-6">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="ml-3 text-gray-700">Loading videos...</p>
            </div>
          ) : uploadedVideosList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {uploadedVideosList.map((video) => (
                <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm mb-1">{video.title || video.originalUrl?.split('/').pop() || 'Untitled Video'}</h3>
                        <p className="text-xs text-gray-500">
                          {video.aspectRatio && (
                            <span className="inline-block bg-gray-100 px-2 py-1 rounded mr-2">
                              {video.aspectRatio}
                            </span>
                          )}
                          {video.numClipsRequested && (
                            <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {video.numClipsRequested} clips
                            </span>
                          )}
                        </p>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        video.status === 'completed' ? 'bg-green-100 text-green-700' :
                        video.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                        video.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {video.status}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>
                        {video.fileSize ? `${(video.fileSize / (1024 * 1024)).toFixed(1)} MB` : 'Unknown size'}
                      </span>
                      <span>
                        {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {video.status === 'completed' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            // Filter clips for this video
                            const videoClips = clipsList.filter(clip => clip.videoId === video.id);
                            if (videoClips.length > 0) {
                              // Scroll to clips section
                              document.querySelector('[data-section="clips"]')?.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="flex-1 text-xs bg-purple-100 text-purple-700 px-3 py-2 rounded hover:bg-purple-200 transition-colors"
                        >
                          View Clips ({clipsList.filter(clip => clip.videoId === video.id).length})
                        </button>
                        {video.originalUrl && (
                          <a
                            href={video.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 transition-colors"
                          >
                            Original
                          </a>
                        )}
                      </div>
                    )}

                    {video.status === 'failed' && video.error && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                        {video.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 mt-6">
              <div className="mx-auto mb-4 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <UploadCloud className="text-gray-400" size={24} />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No videos uploaded yet</h3>
              <p className="text-xs text-gray-500">Start by uploading your first video</p>
            </div>
          )}
        </div>

        {/* Upload Progress Indicator */}
        {(uploadedVideo.status === "uploading" || uploadedVideo.status === "processing") && (
          <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{uploadedVideo.name}</p>
                <p className="text-xs text-gray-500">{uploadStatus}</p>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div 
                    className="bg-purple-600 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${jobProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 