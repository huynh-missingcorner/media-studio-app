export type MediaType = "IMAGE" | "VIDEO" | "AUDIO" | "MUSIC";

export type MediaStatus = "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED";

export interface MediaBase {
  projectId: string;
  prompt: string;
  mediaType: MediaType;
}

export interface ImageGenerationDto extends MediaBase {
  aspectRatio: string;
  sampleCount: number;
  model: string;
}

export interface VideoGenerationDto extends MediaBase {
  durationSeconds: number;
  aspectRatio: string;
  enhancePrompt: boolean;
  sampleCount: number;
  model: string;
  seed: number;
}

export interface MusicGenerationDto extends MediaBase {
  durationSeconds: number;
  genre: string;
  instrument: string;
  tempo: number;
  seed: number;
}

export interface AudioGenerationDto extends MediaBase {
  durationSeconds: number;
  audioStyle: string;
  seed: number;
}

export interface OperationResponseDto {
  operationId: string;
}

export interface MediaResponseDto {
  id: string;
  prompt: string;
  mediaType: MediaType;
  status: MediaStatus;
  parameters: Record<string, unknown>;
  projectId: string;
  results: MediaResultDto[];
  createdAt: string;
  updatedAt: string;
}

export interface MediaResultDto {
  id: string;
  mediaType: MediaType;
  url: string;
  metadata?: Record<string, unknown>;
  resultUrl: string;
  createdAt: Date;
}

export interface MediaHistoryParams {
  page?: number;
  limit?: number;
  mediaType?: MediaType;
  status?: MediaStatus;
  search?: string;
  projectId?: string;
}
