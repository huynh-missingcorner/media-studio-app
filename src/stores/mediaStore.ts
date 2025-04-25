import { create } from "zustand";
import { MediaType } from "@/pages/app/dashboard-page";
import type {
  ImageSettingParams,
  AudioSettingParams,
  MusicSettingParams,
  VideoSettingParams,
} from "@/components/custom/media/settings";
import { MediaResponseDto, OperationResponseDto } from "@/types/media";
import { mediaService } from "@/services/mediaService";

const CHECK_OPERATION_STATUS_INTERVAL = 5000;
const MAX_CHECK_OPERATION_STATUS_ATTEMPTS = 10;

interface MediaState {
  // Current media type
  selectedMediaType: MediaType;

  // User prompt
  prompt: string;

  // Generation status
  isGenerating: boolean;

  // Settings for each media type
  imageSettings: ImageSettingParams;
  audioSettings: AudioSettingParams;
  musicSettings: MusicSettingParams;
  videoSettings: VideoSettingParams;

  // Media Results
  mediaResponse: MediaResponseDto | null;

  // Operation Results
  operationResponse: OperationResponseDto | null;

  // Actions
  setSelectedMediaType: (type: MediaType) => void;
  setPrompt: (prompt: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setMediaResponse: (response: MediaResponseDto | null) => void;
  setOperationResponse: (response: OperationResponseDto | null) => void;
  updateImageSettings: (settings: Partial<ImageSettingParams>) => void;
  updateAudioSettings: (settings: Partial<AudioSettingParams>) => void;
  updateMusicSettings: (settings: Partial<MusicSettingParams>) => void;
  updateVideoSettings: (settings: Partial<VideoSettingParams>) => void;

  // Helper to get current settings based on media type
  getCurrentSettings: () =>
    | ImageSettingParams
    | AudioSettingParams
    | MusicSettingParams
    | VideoSettingParams;

  // Method to get all data for API call
  getGenerationPayload: () => {
    mediaType: MediaType;
    prompt: string;
    settings:
      | ImageSettingParams
      | AudioSettingParams
      | MusicSettingParams
      | VideoSettingParams;
  };
}

export const useMediaStore = create<MediaState>((set, get) => ({
  selectedMediaType: "image",
  prompt: "",
  isGenerating: false,

  // Default settings for each media type
  imageSettings: {
    model: "imagen-3.0-generate-002",
    aspectRatio: "1:1",
    numberOfResults: 1,
    allowPeopleAndFaces: true,
  },

  audioSettings: {
    voice: "default",
    speed: 1,
    volumeGain: 0,
    audioEncoding: "mp3",
    audioSampleRate: "22050",
    model: "chirp-3-hd-voices",
    language: "en-US",
  },

  musicSettings: {
    model: "lyria-base-001",
    seed: 42,
  },

  videoSettings: {
    model: "veo-2.0-generate-001",
    aspectRatio: "16:9",
    numberOfResults: 1,
    durationSeconds: "5",
    enhancePrompt: true,
    seed: 42,
    personGeneration: "true",
  },

  mediaResponse: null,

  operationResponse: null,

  // Actions
  setSelectedMediaType: (type) => {
    set({ selectedMediaType: type });
    set({ mediaResponse: null });
    set({ operationResponse: null });
  },
  setPrompt: (prompt) => set({ prompt }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setMediaResponse: (response) => set({ mediaResponse: response }),
  setOperationResponse: async (operationResponse) => {
    set({ operationResponse });

    if (!operationResponse) {
      return;
    }

    // Loop request to check operation status
    for (let i = 0; i < MAX_CHECK_OPERATION_STATUS_ATTEMPTS; i++) {
      const response = await mediaService.getOperationStatus(
        operationResponse.operationId
      );
      if (response.status === "SUCCEEDED") {
        set({ mediaResponse: response });
        set({ isGenerating: false });
        break;
      } else {
        await new Promise((resolve) =>
          setTimeout(resolve, CHECK_OPERATION_STATUS_INTERVAL)
        );
      }
    }
  },
  updateImageSettings: (settings) =>
    set((state) => ({
      imageSettings: { ...state.imageSettings, ...settings },
    })),

  updateAudioSettings: (settings) =>
    set((state) => ({
      audioSettings: { ...state.audioSettings, ...settings },
    })),

  updateMusicSettings: (settings) =>
    set((state) => ({
      musicSettings: { ...state.musicSettings, ...settings },
    })),

  updateVideoSettings: (settings) =>
    set((state) => ({
      videoSettings: { ...state.videoSettings, ...settings },
    })),

  // Helper to get current settings based on selected media type
  getCurrentSettings: () => {
    const state = get();
    switch (state.selectedMediaType) {
      case "image":
        return state.imageSettings;
      case "audio":
        return state.audioSettings;
      case "music":
        return state.musicSettings;
      case "video":
        return state.videoSettings;
      default:
        return state.imageSettings;
    }
  },

  // Generate payload for API
  getGenerationPayload: () => {
    const state = get();
    return {
      mediaType: state.selectedMediaType,
      prompt: state.prompt,
      settings: state.getCurrentSettings(),
    };
  },
}));
