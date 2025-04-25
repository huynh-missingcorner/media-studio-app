import apiClient from "@/lib/api";
import {
  ImageGenerationDto,
  VideoGenerationDto,
  MusicGenerationDto,
  AudioGenerationDto,
  MediaResponseDto,
  MediaHistoryParams,
  OperationResponseDto,
} from "@/types/media";

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
   * Generate a video asynchronously using Vertex AI Media Studio
   * @param data - Video generation parameters
   * @returns Media generation response
   */
  async generateVideo(data: VideoGenerationDto): Promise<OperationResponseDto> {
    const response = await apiClient.post<OperationResponseDto>(
      "/media/video/async",
      data
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
    metadata: {
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
