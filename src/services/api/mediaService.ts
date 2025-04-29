import apiClient from "@/lib/api";
import {
  ImageGenerationDto,
  VideoGenerationDto,
  MusicGenerationDto,
  AudioGenerationDto,
  MediaResponseDto,
  MediaHistoryParams,
  OperationResponseDto,
  ImageUpscaleDto,
} from "@/types/media.types";

/**
 * Service for handling media generation operations
 */
export const mediaService = {
  /**
   * Generate an image using Vertex AI Media Studio
   * @param data - Image generation parameters
   * @returns Media generation response
   */
  async generateImage(data: ImageGenerationDto): Promise<MediaResponseDto> {
    const response = await apiClient.post<MediaResponseDto>(
      "/media/image",
      data
    );
    return response.data;
  },

  /**
   * Upscale an image using Vertex AI Media Studio
   * @param data - Image upscale parameters
   * @returns Media upscale response
   */
  async upscaleImage(data: ImageUpscaleDto): Promise<MediaResponseDto> {
    const response = await apiClient.post<MediaResponseDto>(
      "/media/image/upscale",
      data
    );
    return response.data;
  },

  /**
   * Generate a video asynchronously using Vertex AI Media Studio
   * @param data - Video generation parameters
   * @returns Media generation response
   */
  async generateVideo(data: VideoGenerationDto): Promise<OperationResponseDto> {
    // Create a copy of the data so we don't modify the original
    const videoData = { ...data };

    // Extract reference image from referenceData if it exists
    if (videoData.referenceData && videoData.referenceData.length > 0) {
      // If we have multiple references, log a warning and use only the first one
      if (videoData.referenceData.length > 1) {
        console.log(
          `Video supports only one reference image. Using the first reference.`
        );
      }

      // Set the referenceImage property using the first reference data
      videoData.referenceImage = videoData.referenceData[0].referenceImage;

      // Now remove the referenceData field entirely as it's not needed for video generation
      delete videoData.referenceData;
    }

    const response = await apiClient.post<OperationResponseDto>(
      "/media/video/async",
      videoData
    );
    return response.data;
  },

  async getOperationStatus(operationId: string): Promise<MediaResponseDto> {
    const response = await apiClient.get<MediaResponseDto>(
      `/media/video/status`,
      {
        params: {
          operationId,
        },
      }
    );
    return response.data;
  },

  /**
   * Generate music using Vertex AI Media Studio
   * @param data - Music generation parameters
   * @returns Media generation response
   */
  async generateMusic(data: MusicGenerationDto): Promise<MediaResponseDto> {
    const response = await apiClient.post<MediaResponseDto>(
      "/media/music",
      data
    );
    return response.data;
  },

  /**
   * Generate audio (speech) using Vertex AI Media Studio
   * @param data - Audio generation parameters
   * @returns Media generation response
   */
  async generateAudio(data: AudioGenerationDto): Promise<MediaResponseDto> {
    const response = await apiClient.post<MediaResponseDto>(
      "/media/audio",
      data
    );
    return response.data;
  },

  /**
   * Get media generation history with optional filters
   * @param params - Optional filter parameters
   * @returns Paginated media history
   */
  async getMediaHistory(
    params: MediaHistoryParams = { page: 1, limit: 10 }
  ): Promise<{
    data: MediaResponseDto[];
    meta: {
      currentPage: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      totalItems: number;
    };
  }> {
    const response = await apiClient.get("/media/history", { params });
    return response.data;
  },

  /**
   * Get media details by ID
   * @param id - Media ID
   * @returns Media details
   */
  async getMediaById(id: string): Promise<MediaResponseDto> {
    const response = await apiClient.get<MediaResponseDto>(`/media/${id}`);
    return response.data;
  },
};
