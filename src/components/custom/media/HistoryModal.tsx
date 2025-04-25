import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaResponseDto, MediaType } from "@/types/media";
import { Image, Music, Play, Video, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMediaHistory } from "@/contexts/MediaHistoryContext";

interface HistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HistoryModal({ open, onOpenChange }: HistoryModalProps) {
  const { historyItems, isLoading, fetchHistory, lastFetched } =
    useMediaHistory();

  // Refresh data when the modal opens if data is stale (older than 1 minute)
  useEffect(() => {
    if (open) {
      const shouldRefresh =
        !lastFetched || new Date().getTime() - lastFetched.getTime() > 60000; // 1 minute

      if (shouldRefresh) {
        fetchHistory();
      }
    }
  }, [open, lastFetched, fetchHistory]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto min-h-[350px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">History</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {historyItems &&
              historyItems.map((item) => (
                <HistoryItem key={item.id} item={item} />
              ))}

            {!historyItems ||
              (historyItems.length === 0 && (
                <div className="col-span-full flex justify-center items-center h-64 text-muted-foreground ">
                  No history items found
                </div>
              ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface HistoryItemProps {
  item: MediaResponseDto;
}

function HistoryItem({ item }: HistoryItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const truncatePrompt = (prompt: string) => {
    return prompt.length > 60 ? prompt.slice(0, 60) + "..." : prompt;
  };

  // Get the first result URL or undefined if no results
  const getMediaUrl = () => {
    if (item.results && item.results.length > 0) {
      return item.results[0].url || item.results[0].resultUrl;
    }
    return undefined;
  };

  const mediaUrl = getMediaUrl();
  const mediaTypeKey = item.mediaType.toLowerCase();

  const togglePlay = () => {
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

  return (
    <div className="relative rounded-lg overflow-hidden border border-border bg-card transition-all hover:shadow-md">
      <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm p-1.5 rounded-md z-10">
        {getMediaTypeIcon(item.mediaType)}
      </div>

      <div className="aspect-video overflow-hidden flex items-center justify-center bg-muted relative">
        {mediaTypeKey === "image" && mediaUrl ? (
          <img
            src={mediaUrl}
            alt={item.prompt}
            className="w-full h-full object-cover"
          />
        ) : mediaTypeKey === "video" && mediaUrl ? (
          <>
            <video
              ref={videoRef}
              src={mediaUrl}
              className="w-full h-full object-cover"
              onEnded={() => setIsPlaying(false)}
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
