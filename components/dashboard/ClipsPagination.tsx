import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Edit2, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ClipData {
  id?: string;
  clipId: string;
  filename: string;
  previewText?: string;
  processingId: string;
  videoId?: string;
}

interface ClipsPaginationProps {
  processedClips: any[]; // Current session clips
  clipsList: ClipData[]; // Database clips
  getClipUrl: (processingId: string, filename: string) => string;
  getCaptionsUrl: (processingId: string, filename: string) => string;
  clipsPerPage?: number;
}

export default function ClipsPagination({
  processedClips,
  clipsList,
  getClipUrl,
  getCaptionsUrl,
  clipsPerPage = 6
}: ClipsPaginationProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  
  // Combine all clips
  const allClips = [
    ...processedClips.map(clip => ({
      type: 'session',
      data: clip
    })),
    ...clipsList.map(clip => ({
      type: 'database', 
      data: clip
    }))
  ];

  const totalPages = Math.ceil(allClips.length / clipsPerPage);
  const startIndex = currentPage * clipsPerPage;
  const endIndex = startIndex + clipsPerPage;
  const currentClips = allClips.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Reset to first page when clips change
  useEffect(() => {
    setCurrentPage(0);
  }, [allClips.length]);

  if (allClips.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Navigation Arrow - Up */}
      {currentPage > 0 && (
        <div className="flex justify-center mb-4">
          <button
            onClick={goToPrevPage}
            className="group bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400 rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            aria-label="Previous page"
          >
            <ChevronUp 
              size={20} 
              className="text-purple-600 group-hover:text-purple-700 transition-colors" 
            />
          </button>
        </div>
      )}

      {/* Clips Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 transition-all duration-500 ease-in-out">
        {currentClips.map((clipItem, index) => {
          const { type, data } = clipItem;
          
          if (type === 'session') {
            const clipData = data.clipResult;
            const videoUrl = getClipUrl(data.processingId, clipData.filename);
            const captionsUrl = getCaptionsUrl(data.processingId, clipData.filename.replace('.mp4', ''));

            return (
              <div 
                key={`session-${data.processingId}-${clipData.clip_id}-${startIndex + index}`} 
                className="border border-purple-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-[9/16] bg-gray-900">
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs px-2 py-1 rounded shadow-sm">
                    NEW
                  </div>
                  <video
                    className="w-full h-full object-cover"
                    controls
                    src={videoUrl}
                    onError={(e) => {
                      console.error("Video loading error for:", clipData.filename, e);
                    }}
                  />
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-xs text-gray-800 line-clamp-2">
                    {clipData.preview_text?.split(" ").slice(0, 4).join(" ") || `Clip ${clipData.clip_id}`}
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          router.push(`/dashboard/edit?clipUrl=${encodeURIComponent(videoUrl)}&captionsUrl=${encodeURIComponent(captionsUrl)}`);
                        }}
                        className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1 rounded transition-all duration-200 hover:scale-105"
                      >
                        <Edit2 size={12} className="inline mr-1" />
                        Edit
                      </button>
                      <a
                        href={videoUrl}
                        download={clipData.filename}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-all duration-200 hover:scale-105"
                      >
                        <Download size={12} className="inline mr-1" />
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            // Database clip
            const clip = data;
            const encodedFilename = encodeURIComponent(clip.filename);
            const captionsFilename = encodeURIComponent(clip.filename.replace('.mp4', ''));
            const videoUrl = `/api/external/clips/${clip.processingId}/${encodedFilename}`;
            const captionsUrl = `/api/external/captions/${clip.processingId}/${captionsFilename}`;

            return (
              <div 
                key={`db-${clip.id}-${startIndex + index}`} 
                className="border border-gray-200 hover:border-purple-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-[9/16] bg-gray-900">
                  <video
                    className="w-full h-full object-cover"
                    controls
                    src={videoUrl}
                    onError={(e) => {
                      console.error("Video loading error for clip:", clip.filename, e);
                    }}
                  />
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-xs text-gray-800 line-clamp-2">
                    {clip.previewText?.split(" ").slice(0, 4).join(" ") || `Clip ${clip.clipId}`}
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          router.push(`/dashboard/edit?clipUrl=${encodeURIComponent(videoUrl)}&captionsUrl=${encodeURIComponent(captionsUrl)}`);
                        }}
                        className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1 rounded transition-all duration-200 hover:scale-105"
                      >
                        <Edit2 size={12} className="inline mr-1" />
                        Edit
                      </button>
                      <a
                        href={videoUrl}
                        download={clip.filename}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-all duration-200 hover:scale-105"
                      >
                        <Download size={12} className="inline mr-1" />
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>

      {/* Navigation Arrow - Down */}
      {currentPage < totalPages - 1 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={goToNextPage}
            className="group bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400 rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            aria-label="Next page"
          >
            <ChevronDown 
              size={20} 
              className="text-purple-600 group-hover:text-purple-700 transition-colors" 
            />
          </button>
        </div>
      )}

      {/* Pagination Indicators */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentPage
                    ? 'bg-purple-600 scale-125 shadow-md'
                    : 'bg-gray-300 hover:bg-purple-300 hover:scale-110'
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-3 font-medium">
            {currentPage + 1} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}

// CSS animations (add to globals.css)
const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
`; 