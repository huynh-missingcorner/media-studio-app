import { useNavigate } from "react-router-dom";
import { useMediaHistoryStore } from "@/stores";
import { toast } from "@/hooks/use-toast";
import { useCallback } from "react";
import { mediaService } from "@/services/api/mediaService";

/**
 * A custom hook that encapsulates the logic for navigating to a history item
 * @returns An object with functions to handle history item navigation
 */
export function useHistoryNavigation() {
  const navigate = useNavigate();
  const { viewMediaGeneration } = useMediaHistoryStore();

  /**
   * Navigate to the generation page with the selected history item loaded
   * @param id The ID of the history item to load
   * @param mediaType The media type (for toast message)
   * @param prompt The prompt (for toast message truncation)
   * @param onSuccess Optional callback to run after successful navigation
   * @returns A boolean indicating whether navigation was successful
   */
  const navigateToHistoryItem = useCallback(
    async (
      id: string,
      mediaType: string,
      prompt: string,
      onSuccess?: () => void
    ) => {
      try {
        // First check if the item is in our local store
        let success = viewMediaGeneration(id);

        // If not found in local store, try to fetch it from the API
        if (!success) {
          toast({
            title: "Fetching media",
            description: "Loading media details...",
          });

          // Fetch the media item directly from the API
          try {
            const media = await mediaService.getMediaById(id);

            // Try again with the fetched media object directly
            success = viewMediaGeneration(media);

            if (!success) {
              throw new Error("Failed to load media after fetching");
            }
          } catch (error) {
            console.error("Error fetching media by ID:", error);
            toast({
              title: "Error",
              description: "Could not load the selected media item.",
              variant: "destructive",
            });
            return false;
          }
        }

        // Run success callback if provided
        if (onSuccess) onSuccess();

        // Navigate to the generation page
        navigate("/dashboard/generate");

        // Show success toast
        const truncatedPrompt =
          prompt.length > 30 ? prompt.slice(0, 30) + "..." : prompt;

        toast({
          title: "Media loaded",
          description: `Loaded ${mediaType} generation: ${truncatedPrompt}`,
        });

        return true;
      } catch (error) {
        console.error("Error in navigateToHistoryItem:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading the media.",
          variant: "destructive",
        });
        return false;
      }
    },
    [navigate, viewMediaGeneration]
  );

  return { navigateToHistoryItem };
}
