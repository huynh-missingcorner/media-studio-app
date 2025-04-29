import { create } from "zustand";
import { mediaService } from "@/services/api/mediaService";
import {
  MediaResponseDto,
  MediaType as APIMediaType,
  MediaHistoryParams,
} from "@/types/media.types";
import { useMediaStore } from "./mediaStore";
import { MediaType } from "@/pages/app/dashboard-page";
import { toast } from "@/hooks/use-toast";

interface MediaHistoryState {
  // History items and their metadata
  historyItems: MediaResponseDto[];
  isLoading: boolean;
  lastFetched: Date | null;
  selectedHistoryItem: MediaResponseDto | null;

  // Pagination and filters
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  filters: {
    mediaType: APIMediaType | null;
    projectId: string | null;
    search: string | null;
  };

  // Actions
  fetchHistory: (params?: Partial<MediaHistoryParams>) => Promise<void>;
  refreshAfterGeneration: (newItem?: MediaResponseDto) => void;
  viewMediaGeneration: (
    generationIdOrMedia: string | MediaResponseDto
  ) => boolean;
  clearSelectedHistoryItem: () => void;

  // Pagination and filter actions
  setPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
  setMediaTypeFilter: (mediaType: APIMediaType | null) => void;
  setProjectFilter: (projectId: string | null) => void;
  setSearchFilter: (search: string | null) => void;
  clearFilters: () => void;
}

export const useMediaHistoryStore = create<MediaHistoryState>((set, get) => ({
  // State
  historyItems: [],
  isLoading: false,
  lastFetched: null,
  selectedHistoryItem: null,

  // Pagination state
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 12,

  // Filter state
  filters: {
    mediaType: null,
    projectId: null,
    search: null,
  },

  fetchHistory: async (params?: Partial<MediaHistoryParams>) => {
    set({ isLoading: true });
    try {
      // Get current state for pagination and filters
      const { currentPage, itemsPerPage, filters } = get();

      // Prepare request parameters
      const requestParams: MediaHistoryParams = {
        page: params?.page || currentPage,
        limit: params?.limit || itemsPerPage,
        mediaType: params?.mediaType || filters.mediaType || undefined,
        projectId: params?.projectId || filters.projectId || undefined,
        search: params?.search || filters.search || undefined,
      };

      // Remove undefined values
      Object.keys(requestParams).forEach((key) => {
        if (requestParams[key as keyof MediaHistoryParams] === undefined) {
          delete requestParams[key as keyof MediaHistoryParams];
        }
      });

      // Make the API call
      const result = await mediaService.getMediaHistory(requestParams);

      // Update state with the results
      set({
        historyItems: result.data || [],
        lastFetched: new Date(),
        currentPage: result.meta.currentPage,
        totalPages: result.meta.totalPages,
        totalItems: result.meta.totalItems,
        itemsPerPage: result.meta.itemsPerPage,
      });
    } catch (error) {
      console.error("Failed to fetch media history:", error);
      toast({
        title: "Error fetching history",
        description:
          "Could not load your media history. Please try again later.",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  refreshAfterGeneration: (newItem?: MediaResponseDto) => {
    if (newItem) {
      // Update the local state immediately with the new item if we're on the first page
      // and have no filters active
      const { currentPage, filters } = get();
      const noFiltersActive =
        !filters.mediaType && !filters.projectId && !filters.search;

      if (currentPage === 1 && noFiltersActive) {
        set((state) => ({
          historyItems: [newItem, ...state.historyItems].slice(
            0,
            state.itemsPerPage
          ),
          totalItems: state.totalItems + 1,
        }));
      }
    }

    // Fetch the latest data from the server
    get().fetchHistory();
  },

  viewMediaGeneration: (generationIdOrMedia: string | MediaResponseDto) => {
    try {
      // Determine if we have an ID or a media object
      let media: MediaResponseDto | undefined;

      if (typeof generationIdOrMedia === "string") {
        // Find the media item by ID
        media = get().historyItems.find(
          (item) => item.id === generationIdOrMedia
        );

        if (!media) {
          // In the case of an ID with no matching item, we'll return false
          // The hook will handle fetching from API if needed
          return false;
        }
      } else {
        // We already have the media object
        media = generationIdOrMedia;
      }

      // Store the selected item in state for later use
      set({ selectedHistoryItem: media });

      const {
        setMediaResponse,
        setPrompt,
        setSelectedMediaType,
        updateImageSettings,
        updateVideoSettings,
        updateAudioSettings,
        updateMusicSettings,
      } = useMediaStore.getState();

      // Set prompt
      setPrompt(media.prompt);

      // Determine media type and update relevant settings
      const { parameters = {}, mediaType } = media;

      // First set the media type with keepMediaResponse true to prevent clearing
      setSelectedMediaType(mediaType.toLowerCase() as MediaType, {
        keepMediaResponse: true,
      });

      // Then set the media response
      setMediaResponse(media);

      // Finally update the relevant settings based on media type
      switch (mediaType) {
        case "IMAGE":
          updateImageSettings({
            aspectRatio: (parameters.aspectRatio as string) || "1:1",
            sampleCount: (parameters.sampleCount as number) || 1,
            model: (parameters.model as string) || "imagen-3.0-generate-002",
            allowPeopleAndFaces:
              (parameters.allowPeopleAndFaces as boolean) || true,
          });
          break;

        case "VIDEO":
          updateVideoSettings({
            model: (parameters.model as string) || "veo-2.0-generate-001",
            aspectRatio: (parameters.aspectRatio as string) || "16:9",
            sampleCount: (parameters.sampleCount as number) || 1,
            durationSeconds: (parameters.durationSeconds as string) || "5",
            enhancePrompt: (parameters.enhancePrompt as boolean) || true,
            seed: (parameters.seed as number) || 42,
            personGeneration: (parameters.personGeneration as string) || "true",
          });
          break;

        case "AUDIO":
          updateAudioSettings({
            model: (parameters.model as string) || "chirp-3-hd-voices",
            voice: (parameters.voice as string) || "default",
            speed: (parameters.speed as number) || 1,
            volumeGain: (parameters.volumeGain as number) || 0,
            audioEncoding: (parameters.audioEncoding as string) || "mp3",
            audioSampleRate: (parameters.audioSampleRate as string) || "22050",
            language: (parameters.language as string) || "en-US",
          });
          break;

        case "MUSIC":
          updateMusicSettings({
            model: (parameters.model as string) || "lyria-base-001",
            seed: (parameters.seed as number) || 42,
          });
          break;

        default:
          toast({
            title: "Unsupported media type",
            description: `The media type ${mediaType} is not supported.`,
            variant: "destructive",
          });
          return false;
      }

      return true;
    } catch (error) {
      console.error("Error loading media generation:", error);
      toast({
        title: "Error loading media",
        description: "Could not load the selected media. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  },

  clearSelectedHistoryItem: () => {
    set({ selectedHistoryItem: null });
  },

  // Pagination and filter actions
  setPage: (page) => {
    set({ currentPage: page });
    get().fetchHistory({ page });
  },

  setItemsPerPage: (limit) => {
    set({ itemsPerPage: limit, currentPage: 1 }); // Reset to first page when changing items per page
    get().fetchHistory({ limit, page: 1 });
  },

  setMediaTypeFilter: (mediaType) => {
    set((state) => ({
      filters: { ...state.filters, mediaType },
      currentPage: 1, // Reset to first page when changing filters
    }));
    get().fetchHistory({ mediaType: mediaType || undefined, page: 1 });
  },

  setProjectFilter: (projectId) => {
    set((state) => ({
      filters: { ...state.filters, projectId },
      currentPage: 1, // Reset to first page when changing filters
    }));
    get().fetchHistory({ projectId: projectId || undefined, page: 1 });
  },

  setSearchFilter: (search) => {
    set((state) => ({
      filters: { ...state.filters, search },
      currentPage: 1, // Reset to first page when changing filters
    }));
    get().fetchHistory({ search: search || undefined, page: 1 });
  },

  clearFilters: () => {
    set({
      filters: {
        mediaType: null,
        projectId: null,
        search: null,
      },
      currentPage: 1, // Reset to first page when clearing filters
    });
    get().fetchHistory({ page: 1 });
  },
}));
