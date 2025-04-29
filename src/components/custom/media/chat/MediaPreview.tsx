import { useMediaStore } from "@/stores/mediaStore";
import { useMediaHistoryStore } from "@/stores/mediaHistoryStore";
import { useEffect } from "react";
import { MediaType } from "@/pages/app/dashboard-page";
import { MediaResultDto } from "@/types/media.types";
import { MediaGallery, MediaItemData } from "../gallery/MediaGallery";
import { AspectRatioType } from "../gallery/MediaItem";

export function MediaPreview() {
  const { mediaResponse, isGenerating } = useMediaStore();

  const { selectedHistoryItem, clearSelectedHistoryItem } =
    useMediaHistoryStore();

  // Clear the selected history item when unmounting
  useEffect(() => {
    return () => {
      clearSelectedHistoryItem();
    };
  }, [clearSelectedHistoryItem]);

  // Ensure mediaResponse is set from selectedHistoryItem if available
  useEffect(() => {
    if (selectedHistoryItem && !mediaResponse) {
      // Get the mediaStore's setMediaResponse function
      const { setMediaResponse, setSelectedMediaType } =
        useMediaStore.getState();

      // Set the media type first with keepMediaResponse option
      const mediaType =
        selectedHistoryItem.mediaType.toLowerCase() as MediaType;
      setSelectedMediaType(mediaType, { keepMediaResponse: true });

      // Then set the media response
      setMediaResponse(selectedHistoryItem);
      clearSelectedHistoryItem();
    }
  }, [selectedHistoryItem, mediaResponse, clearSelectedHistoryItem]);

  const mapToGalleryItems = (
    results: MediaResultDto[] = []
  ): MediaItemData[] => {
    if (!mediaResponse?.results?.length) return [];

    return results.map((result) => ({
      id: result.id,
      url: result.resultUrl,
      type: mediaResponse.mediaType,
      aspectRatio: mediaResponse.parameters.aspectRatio as AspectRatioType,
      gcsUri: result.metadata?.originalGcsUri as string,
      prompt: mediaResponse.prompt,
      projectId: mediaResponse.projectId,
    }));
  };

  const mediaItems = mapToGalleryItems(mediaResponse?.results);

  return (
    <div className="w-full max-w-5xl mx-auto h-full">
      <MediaGallery media={mediaItems} isLoading={isGenerating} />
    </div>
  );
}
