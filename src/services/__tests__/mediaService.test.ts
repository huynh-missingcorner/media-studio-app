import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { mediaService } from "@/services/mediaService";
import {
  ImageGenerationDto,
  VideoGenerationDto,
  MusicGenerationDto,
  AudioGenerationDto,
  MediaHistoryParams,
} from "@/types/media";

// Mock axios
vi.mock("axios");

describe("mediaService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("generateImage", () => {
    it("should generate an image successfully", async () => {
      // Arrange
      const imageData: ImageGenerationDto = {
        projectId: "project1",
        prompt: "A beautiful sunset",
        mediaType: "IMAGE",
        aspectRatio: "1:1",
        sampleCount: 1,
        model: "imagen-3.0-generate-002",
      };

      const mockResponse = {
        data: {
          id: "media1",
          status: "PENDING",
          mediaType: "IMAGE",
          prompt: "A beautiful sunset",
        },
      };

      vi.mocked(axios.post).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await mediaService.generateImage(imageData);

      // Assert
      expect(axios.post).toHaveBeenCalledWith("/api/media/image", imageData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("generateVideo", () => {
    it("should generate a video asynchronously", async () => {
      // Arrange
      const videoData: VideoGenerationDto = {
        projectId: "project1",
        prompt: "A car driving down a road",
        mediaType: "VIDEO",
        durationSeconds: 5,
        aspectRatio: "16:9",
        enhancePrompt: true,
        sampleCount: 1,
        model: "veo-2.0-generate-001",
        seed: 123,
      };

      const mockResponse = {
        data: {
          id: "media2",
          status: "PENDING",
          mediaType: "VIDEO",
          prompt: "A car driving down a road",
        },
      };

      vi.mocked(axios.post).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await mediaService.generateVideo(videoData);

      // Assert
      expect(axios.post).toHaveBeenCalledWith(
        "/api/media/video/async",
        videoData
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("generateMusic", () => {
    it("should generate music successfully", async () => {
      // Arrange
      const musicData: MusicGenerationDto = {
        projectId: "project1",
        prompt: "A relaxing melody",
        mediaType: "MUSIC",
        durationSeconds: 5,
        genre: "POP",
        instrument: "Piano",
        tempo: 0.5,
        seed: 456,
      };

      const mockResponse = {
        data: {
          id: "media3",
          status: "PENDING",
          mediaType: "MUSIC",
          prompt: "A relaxing melody",
        },
      };

      vi.mocked(axios.post).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await mediaService.generateMusic(musicData);

      // Assert
      expect(axios.post).toHaveBeenCalledWith("/api/media/music", musicData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("generateAudio", () => {
    it("should generate audio successfully", async () => {
      // Arrange
      const audioData: AudioGenerationDto = {
        projectId: "project1",
        prompt: "Welcome to our application",
        mediaType: "AUDIO",
        durationSeconds: 5,
        audioStyle: "Formal",
        seed: 789,
      };

      const mockResponse = {
        data: {
          id: "media4",
          status: "PENDING",
          mediaType: "AUDIO",
          prompt: "Welcome to our application",
        },
      };

      vi.mocked(axios.post).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await mediaService.generateAudio(audioData);

      // Assert
      expect(axios.post).toHaveBeenCalledWith("/api/media/audio", audioData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("getMediaHistory", () => {
    it("should fetch media history with default parameters", async () => {
      // Arrange
      const mockResponse = {
        data: {
          items: [
            { id: "media1", mediaType: "IMAGE", status: "SUCCEEDED" },
            { id: "media2", mediaType: "VIDEO", status: "PROCESSING" },
          ],
          total: 2,
          page: 1,
          limit: 10,
        },
      };

      vi.mocked(axios.get).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await mediaService.getMediaHistory();

      // Assert
      expect(axios.get).toHaveBeenCalledWith("/api/media/history", {
        params: { page: 1, limit: 10 },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("should fetch media history with custom parameters", async () => {
      // Arrange
      const params: MediaHistoryParams = {
        page: 2,
        limit: 5,
        mediaType: "IMAGE",
        status: "SUCCEEDED",
        search: "sunset",
        projectId: "project1",
      };

      const mockResponse = {
        data: {
          items: [
            {
              id: "media3",
              mediaType: "IMAGE",
              status: "SUCCEEDED",
              prompt: "sunset beach",
            },
          ],
          total: 1,
          page: 2,
          limit: 5,
        },
      };

      vi.mocked(axios.get).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await mediaService.getMediaHistory(params);

      // Assert
      expect(axios.get).toHaveBeenCalledWith("/api/media/history", {
        params,
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("getMediaById", () => {
    it("should fetch media by ID", async () => {
      // Arrange
      const mediaId = "media1";
      const mockResponse = {
        data: {
          id: mediaId,
          mediaType: "IMAGE",
          status: "SUCCEEDED",
          prompt: "A beautiful sunset",
          url: "https://example.com/media1.jpg",
          createdAt: "2023-01-01T00:00:00.000Z",
          updatedAt: "2023-01-01T00:00:00.000Z",
        },
      };

      vi.mocked(axios.get).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await mediaService.getMediaById(mediaId);

      // Assert
      expect(axios.get).toHaveBeenCalledWith(`/api/media/${mediaId}`);
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error when media is not found", async () => {
      // Arrange
      const mediaId = "nonexistent";
      const mockError = new Error("Media not found");
      // Set properties directly on the Error object to simulate what axios produces
      mockError.name = "AxiosError";
      (mockError as AxiosError).response = {
        status: 404,
        statusText: "Not Found",
        headers: {},
        config: { headers: {} } as InternalAxiosRequestConfig,
        data: {
          message: "Media not found",
        },
      };

      vi.mocked(axios.get).mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(mediaService.getMediaById(mediaId)).rejects.toThrow(
        "Media not found"
      );
    });
  });
});
