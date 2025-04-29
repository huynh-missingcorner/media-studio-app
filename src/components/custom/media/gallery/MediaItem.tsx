import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { MediaType } from "@/types/media.types";
import { ImageCard } from "../../ImageCard";
import { VideoCard } from "../../VideoCard";
import { AudioCard } from "../../AudioCard";
export type AspectRatioType = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export interface MediaItemProps {
  id: string;
  url?: string;
  type?: MediaType;
  aspectRatio: AspectRatioType;
  isLoading: boolean;
  className?: string;
  gcsUri?: string;
  prompt?: string;
  projectId?: string;
}

export function MediaItem({
  id,
  url,
  type,
  aspectRatio,
  isLoading,
  className = "",
  gcsUri,
  prompt,
  projectId,
}: MediaItemProps) {
  const aspectRatioValue = getAspectRatioValue(aspectRatio);

  const renderMedia = () => {
    if (!url) {
      return null;
    }

    switch (type) {
      case "IMAGE":
        return (
          <ImageCard
            url={url}
            id={id}
            gcsUri={gcsUri}
            prompt={prompt}
            projectId={projectId}
          />
        );
      case "VIDEO":
        return <VideoCard url={url} />;
      case "AUDIO":
      case "MUSIC":
        return <AudioCard url={url} />;
      default:
        return null;
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <AspectRatio ratio={aspectRatioValue} className="h-full">
        {isLoading ? <Skeleton className="h-full w-full" /> : renderMedia()}
      </AspectRatio>
    </Card>
  );
}

function getAspectRatioValue(aspectRatio: AspectRatioType): number {
  switch (aspectRatio) {
    case "1:1":
      return 1;
    case "16:9":
      return 16 / 9;
    case "9:16":
      return 9 / 16;
    case "4:3":
      return 4 / 3;
    case "3:4":
      return 3 / 4;
    default:
      return 1;
  }
}
