import { cn } from "@/lib/utils";
import { MediaResultDto } from "@/types/media";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaStore } from "@/stores/mediaStore";
import type {
  ImageSettingParams,
  VideoSettingParams,
} from "@/components/custom/media/settings";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

interface MediaPreviewProps {
  className?: string;
}

export function MediaPreview({ className }: MediaPreviewProps) {
  const { mediaResponse, isGenerating, selectedMediaType, getCurrentSettings } =
    useMediaStore();

  const getAspectRatioClass = (ratio: string) => {
    switch (ratio) {
      case "1:1":
        return "aspect-square";
      case "16:9":
        return "aspect-video";
      case "9:16":
        return "aspect-[9/16]";
      case "4:3":
        return "aspect-[4/3]";
      case "3:4":
        return "aspect-[3/4]";
      default:
        return "aspect-square";
    }
  };

  const renderMedia = (result: MediaResultDto) => {
    if (!mediaResponse?.results) return null;

    switch (mediaResponse.mediaType) {
      case "IMAGE":
        return (
          <div className="relative">
            <img
              src={result.resultUrl}
              alt="Generated image"
              className="w-full h-full object-cover rounded-md"
            />
            <Button
              onClick={async () => {
                try {
                  const response = await fetch(result.resultUrl);
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `image-${result.id}.jpg`;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                } catch (error) {
                  console.error("Error downloading image:", error);
                }
              }}
              className="absolute bottom-2 right-2  text-white p-2 rounded-full bg-blue-400 cursor-pointer w-10 h-10 [&_svg]:size-5 hover:bg-blue-600 transition-all duration-300"
              aria-label="Download image"
            >
              <DownloadIcon className="w-4 h-4 text-white group-hover:text-blue-500 transition-all duration-300" />
            </Button>
          </div>
        );
      case "AUDIO":
        return (
          <audio controls src={result.resultUrl} className="w-full"></audio>
        );
      case "MUSIC":
        return (
          <audio controls src={result.resultUrl} className="w-full"></audio>
        );
      case "VIDEO":
        return (
          <video
            controls
            src={result.resultUrl}
            className="w-full h-full rounded-md"
          ></video>
        );
      default:
        return null;
    }
  };

  const renderSkeletons = () => {
    const settings = getCurrentSettings();
    let count = 1;
    let aspectRatio = "1:1";

    // Variables for type guards
    let imageSettings: ImageSettingParams;
    let videoSettings: VideoSettingParams;

    // Get the correct count and aspect ratio based on media type
    switch (selectedMediaType) {
      case "image":
        // Type guard for image settings
        imageSettings = settings as ImageSettingParams;
        count = imageSettings.numberOfResults || 1;
        aspectRatio = imageSettings.aspectRatio || "1:1";
        break;
      case "video":
        // Type guard for video settings
        videoSettings = settings as VideoSettingParams;
        count = videoSettings.numberOfResults || 1;
        aspectRatio = videoSettings.aspectRatio || "16:9";
        break;
      case "audio":
      case "music":
        count = 1; // Audio and music only have one result
        break;
    }

    const aspectRatioClass = getAspectRatioClass(aspectRatio);
    const skeletons = [];

    for (let i = 0; i < count; i++) {
      if (selectedMediaType === "image" || selectedMediaType === "video") {
        skeletons.push(
          <div
            key={`skeleton-${i}`}
            className={cn(
              "rounded-md overflow-hidden",
              aspectRatioClass,
              getItemWidthClass(count, i)
            )}
          >
            <Skeleton className="w-full h-full" />
          </div>
        );
      } else {
        // Audio or music skeleton
        skeletons.push(
          <div key={`skeleton-${i}`} className="w-full max-w-md">
            <Skeleton className="w-full h-12 rounded-md" />
          </div>
        );
      }
    }

    return skeletons;
  };

  // Get width class based on item count and index
  const getItemWidthClass = (count: number, index: number) => {
    switch (count) {
      case 1:
        return "w-[400px]";
      case 2:
        return "w-[calc(50%-8px)] max-w-md";
      case 3:
        // For 3 items, make first 2 items half width, third item centered
        return index === 2 ? "w-1/2 max-w-md" : "w-[calc(50%-8px)] max-w-md";
      case 4:
        return "w-[calc(50%-8px)] max-w-md";
      default:
        return "w-[calc(50%-8px)] max-w-md";
    }
  };

  // Get flex container classes based on item count
  const getFlexContainerClass = (count: number) => {
    switch (count) {
      case 1:
        return "justify-center items-center";
      case 3:
        return "justify-center flex-wrap";
      default:
        return "justify-center flex-wrap";
    }
  };

  // If generating, show skeletons
  if (isGenerating) {
    const skeletons = renderSkeletons();
    return (
      <div className={cn("p-4 w-full h-[calc(100vh-200px)]", className)}>
        <div
          className={cn(
            "flex w-full h-full gap-4",
            getFlexContainerClass(skeletons.length)
          )}
        >
          {skeletons}
        </div>
      </div>
    );
  }

  // If no media response, show nothing
  if (!mediaResponse?.results || mediaResponse.results.length === 0) {
    return null;
  }

  // Show actual media results
  return (
    <div className={cn("p-4 w-full h-[calc(100vh-200px)]", className)}>
      <div
        className={cn(
          "flex w-full h-full gap-4 mb-10",
          getFlexContainerClass(mediaResponse.results.length)
        )}
      >
        {mediaResponse.results.map((result, index) => {
          // Get the appropriate aspect ratio class if it's an image or video
          let aspectRatioClass = "";
          if (
            mediaResponse.mediaType === "IMAGE" ||
            mediaResponse.mediaType === "VIDEO"
          ) {
            // Type guard for settings
            const settings = getCurrentSettings();
            let ratio = "1:1";

            if (mediaResponse.mediaType === "IMAGE") {
              ratio = (settings as ImageSettingParams).aspectRatio || "1:1";
            } else {
              ratio = (settings as VideoSettingParams).aspectRatio || "16:9";
            }

            aspectRatioClass = getAspectRatioClass(ratio);
          }

          return (
            <div
              key={result.id}
              className={cn(
                "rounded-md overflow-hidden",
                aspectRatioClass,
                getItemWidthClass(mediaResponse.results.length, index),
                // For 3 items, third item should be centered
                mediaResponse.results.length === 3 && index === 2
                  ? "mx-auto"
                  : ""
              )}
            >
              {renderMedia(result)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
