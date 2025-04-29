import { useMemo } from "react";
import { MediaItem, AspectRatioType } from "./MediaItem";
import { MediaType } from "@/types/media.types";

export interface MediaItemData {
  id: string;
  url: string;
  type: MediaType;
  aspectRatio: AspectRatioType;
  gcsUri?: string;
  prompt?: string;
  projectId?: string;
}

export interface MediaGalleryProps {
  media: MediaItemData[];
  isLoading: boolean;
  className?: string;
}

export function MediaGallery({
  media,
  isLoading,
  className = "",
}: MediaGalleryProps) {
  const layoutClass = useMemo(() => {
    if (!media.length) return "";

    const count = media.length;
    const aspectRatio = media[0].aspectRatio; // Assuming all items have same aspect ratio

    return getLayoutVariant(count, aspectRatio);
  }, [media]);

  // Handle empty media array gracefully
  if (!media.length) {
    return null;
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <div className={`grid gap-4 ${layoutClass}`}>
        {isLoading
          ? Array.from({ length: media.length }).map((_, index) => (
              <MediaItem
                id={`skeleton-${index}`}
                key={`skeleton-${index}`}
                aspectRatio={media[index]?.aspectRatio || "1:1"}
                isLoading={true}
              />
            ))
          : media.map((item) => (
              <MediaItem
                key={item.id}
                id={item.id}
                url={item.url}
                type={item.type}
                aspectRatio={item.aspectRatio}
                isLoading={false}
                gcsUri={item.gcsUri}
                prompt={item.prompt}
                projectId={item.projectId}
              />
            ))}
      </div>
    </div>
  );
}

function getLayoutVariant(count: number, aspectRatio: AspectRatioType): string {
  // Vertical-oriented aspect ratios that favor side-by-side layout
  const isVerticalOriented = ["1:1", "9:16", "3:4"].includes(aspectRatio);

  switch (count) {
    case 1:
      return "grid-cols-1";

    case 2:
      return isVerticalOriented
        ? "grid-cols-2" // side by side
        : "grid-cols-1"; // stacked

    case 3:
      if (aspectRatio === "9:16") {
        return "grid-cols-3"; // One row with 3 items
      } else {
        return "grid-cols-2 grid-rows-2 [&>*:nth-child(3)]:col-span-2"; // 2 rows: 2 items top, 1 centered bottom
      }

    case 4:
      return "grid-cols-2 grid-rows-2"; // 2x2 grid

    default:
      // For any larger number, default to a responsive grid
      return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  }
}
