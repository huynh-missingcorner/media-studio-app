import { useRef, useState } from "react";
import { Mic, Music, Video, Image, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MediaResponseDto, MediaType } from "@/types/media.types";
import { useHistoryNavigation } from "@/hooks";

interface HistoryItemProps {
  item: MediaResponseDto;
  onOpenChange: (open: boolean) => void;
}

export function HistoryItem({ item, onOpenChange }: HistoryItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { navigateToHistoryItem } = useHistoryNavigation();

  const truncatePrompt = (prompt: string) => {
    return prompt.length > 60 ? prompt.slice(0, 60) + "..." : prompt;
  };

  // Get the first result URL or undefined if no results
  const getMediaUrl = () => {
    if (item.results && item.results.length > 0) {
      return item.results[0].resultUrl;
    }
    return undefined;
  };

  const mediaUrl = getMediaUrl();
  const mediaTypeKey = item.mediaType.toLowerCase();

  const togglePlay = (e: React.MouseEvent) => {
    // Stop propagation to prevent parent click handler
    e.stopPropagation();

    if (mediaTypeKey === "video" && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (
      (mediaTypeKey === "audio" || mediaTypeKey === "music") &&
      audioRef.current
    ) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Unknown date";
    }
  };

  const getMediaTypeIcon = (mediaType: MediaType) => {
    const type = mediaType.toLowerCase();
    switch (type) {
      case "image":
        return <Image className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "music":
        return <Music className="h-5 w-5" />;
      case "audio":
        return <Mic className="h-5 w-5" />;
      default:
        return <Image className="h-5 w-5" />;
    }
  };

  const viewMedia = () => {
    // Use our custom hook to navigate to the generation page
    navigateToHistoryItem(item.id, mediaTypeKey, item.prompt, () => {
      // Small delay before closing the modal to ensure state updates properly
      setTimeout(() => {
        onOpenChange(false);
      }, 100);
    });
  };

  return (
    <div
      className="relative rounded-lg overflow-hidden border border-border bg-card transition-all hover:shadow-md cursor-pointer group"
      onClick={viewMedia}
    >
      <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm p-1.5 rounded-md z-10">
        {getMediaTypeIcon(item.mediaType)}
      </div>

      {item.results && item.results.length >= 2 && (
        <div
          title="Number of results"
          className="absolute top-11 right-2 bg-primary text-primary-foreground text-xs font-semibold px-1.5 py-0.5 rounded-md z-10 w-[32px] flex items-center justify-center"
        >
          x{item.results.length}
        </div>
      )}

      <div className="aspect-video overflow-hidden flex items-center justify-center bg-muted relative">
        {mediaTypeKey === "image" && mediaUrl ? (
          <img
            src={mediaUrl}
            alt={item.prompt}
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
          />
        ) : mediaTypeKey === "video" && mediaUrl ? (
          <>
            <video
              ref={videoRef}
              src={mediaUrl}
              className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
              onEnded={() => setIsPlaying(false)}
            />
            {/* For videos, we need a play button that doesn't trigger the parent click */}
            <Button
              size="icon"
              variant="secondary"
              className={cn(
                "absolute inset-0 m-auto rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/75 w-12 h-12",
                isPlaying && "opacity-0"
              )}
              onClick={togglePlay}
            >
              <Play className={cn("h-6 w-6")} />
            </Button>
          </>
        ) : (mediaTypeKey === "music" || mediaTypeKey === "audio") &&
          mediaUrl ? (
          <>
            <div
              className={cn(
                "flex items-center justify-center w-full h-full",
                mediaTypeKey === "music" ? "bg-purple-900/10" : "bg-blue-900/10"
              )}
            >
              {mediaTypeKey === "music" ? (
                <Music className="h-10 w-10 text-primary/70" />
              ) : (
                <Mic className="h-10 w-10 text-primary/70" />
              )}
            </div>
            <audio
              ref={audioRef}
              src={mediaUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute inset-0 m-auto rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/75 w-12 h-12"
              onClick={togglePlay}
            >
              <Play className={cn("h-6 w-6", isPlaying && "opacity-0")} />
            </Button>
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-muted">
            <span className="text-muted-foreground">No preview</span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1">
        <p className="text-xs text-muted-foreground">
          {formatDate(item.createdAt)}
        </p>
        <p className="text-sm text-foreground font-medium">
          {truncatePrompt(item.prompt)}
        </p>
      </div>
    </div>
  );
}
