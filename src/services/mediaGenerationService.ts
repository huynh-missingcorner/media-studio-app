import { MediaType } from "@/pages/app/dashboard-page";
import type {
  ImageSettingParams,
  AudioSettingParams,
  MusicSettingParams,
  VideoSettingParams,
} from "@/components/custom/media/settings";

interface MediaGenerationPayload {
  mediaType: MediaType;
  prompt: string;
  settings:
    | ImageSettingParams
    | AudioSettingParams
    | MusicSettingParams
    | VideoSettingParams;
}

interface MediaGenerationResponse {
  id: string;
  mediaType: MediaType;
  url: string;
  prompt: string;
  createdAt: string;
}

// This is a mock service - in a real application this would call an actual API
export async function generateMedia(
  payload: MediaGenerationPayload
): Promise<MediaGenerationResponse> {
  console.log("Generating media with payload:", payload);

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock response
  return {
    id: `media-${Date.now()}`,
    mediaType: payload.mediaType,
    url: `https://example.com/media/${payload.mediaType}/${Date.now()}.jpg`,
    prompt: payload.prompt,
    createdAt: new Date().toISOString(),
  };
}

// Helper function to generate the right API payload based on media type
export function getApiPayload(
  mediaType: MediaType,
  prompt: string,
  projectId: string,
  settings:
    | ImageSettingParams
    | AudioSettingParams
    | MusicSettingParams
    | VideoSettingParams
) {
  // Common payload structure
  const basePayload = {
    prompt,
    projectId,
  };

  // Add media-specific parameters
  switch (mediaType) {
    case "image":
      return {
        ...basePayload,
        model: (settings as ImageSettingParams).model,
        aspectRatio: (settings as ImageSettingParams).aspectRatio,
        numberOfResults: (settings as ImageSettingParams).numberOfResults,
        allowPeopleAndFaces: (settings as ImageSettingParams)
          .allowPeopleAndFaces,
      };
    case "audio":
      return {
        ...basePayload,
        model: (settings as AudioSettingParams).model,
        voice: (settings as AudioSettingParams).voice,
        speed: (settings as AudioSettingParams).speed,
        volumeGain: (settings as AudioSettingParams).volumeGain,
        audioEncoding: (settings as AudioSettingParams).audioEncoding,
        audioSampleRate: (settings as AudioSettingParams).audioSampleRate,
        language: (settings as AudioSettingParams).language,
      };
    case "music":
      return {
        ...basePayload,
        model: (settings as MusicSettingParams).model,
        seed: (settings as MusicSettingParams).seed,
      };
    case "video":
      return {
        ...basePayload,
        model: (settings as VideoSettingParams).model,
        aspectRatio: (settings as VideoSettingParams).aspectRatio,
        numberOfResults: (settings as VideoSettingParams).numberOfResults,
        durationSeconds: (settings as VideoSettingParams).durationSeconds,
        enhancePrompt: (settings as VideoSettingParams).enhancePrompt,
        seed: (settings as VideoSettingParams).seed,
        personGeneration: (settings as VideoSettingParams).personGeneration,
      };
    default:
      return basePayload;
  }
}
