import { Button } from "@/components/ui/button";
import { ImageIcon, AudioLines, MusicIcon, VideoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaStore } from "@/stores/mediaStore";

export function MediaTypeNavbar() {
  const { selectedMediaType, setSelectedMediaType } = useMediaStore();

  return (
    <div className="fixed bottom-1/2 left-4 transform translate-y-1/2 z-10 bg-background rounded-full shadow-lg border border-border p-1 flex gap-1 flex-col">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full w-10 h-10 [&_svg]:size-5",
          selectedMediaType === "image" && "bg-primary/20 text-primary"
        )}
        onClick={() => setSelectedMediaType("image")}
        title="Image Generation"
      >
        <ImageIcon className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full w-10 h-10 [&_svg]:size-5",
          selectedMediaType === "audio" && "bg-primary/20 text-primary"
        )}
        onClick={() => setSelectedMediaType("audio")}
        title="Audio Generation"
      >
        <AudioLines className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full w-10 h-10 [&_svg]:size-5",
          selectedMediaType === "music" && "bg-primary/20 text-primary"
        )}
        onClick={() => setSelectedMediaType("music")}
        title="Music Generation"
      >
        <MusicIcon className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full w-10 h-10 [&_svg]:size-5",
          selectedMediaType === "video" && "bg-primary/20 text-primary"
        )}
        onClick={() => setSelectedMediaType("video")}
        title="Video Generation"
      >
        <VideoIcon className="w-5 h-5" />
      </Button>
    </div>
  );
}
