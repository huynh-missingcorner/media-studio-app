import { Button } from "@/components/ui/button";
import {
  ImageIcon,
  AudioIcon,
  MusicIcon,
  VideoIcon,
} from "@/components/ui/icons";
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
          selectedMediaType === "image" && "bg-blue-100 text-blue-700"
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
          selectedMediaType === "audio" && "bg-blue-100 text-blue-700"
        )}
        onClick={() => setSelectedMediaType("audio")}
        title="Audio Generation"
      >
        <AudioIcon className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full w-10 h-10 [&_svg]:size-5",
          selectedMediaType === "music" && "bg-blue-100 text-blue-700"
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
          selectedMediaType === "video" && "bg-blue-100 text-blue-700"
        )}
        onClick={() => setSelectedMediaType("video")}
        title="Video Generation"
      >
        <VideoIcon className="w-5 h-5" />
      </Button>
    </div>
  );
}
