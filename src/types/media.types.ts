export type MediaType = "IMAGE" | "VIDEO" | "AUDIO" | "MUSIC";

export type MediaStatus = "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED";

export enum ReferenceType {
  DEFAULT = "default",
  PERSON = "person",
  PRODUCT = "product",
  ANIMAL = "animal",
  STYLE = "style",
  RAW = "raw",
  CONTROL = "control",
  MASK = "mask",
}

export enum SecondaryReferenceType {
  SUBJECT_TYPE_DEFAULT = "SUBJECT_TYPE_DEFAULT",
  SUBJECT_TYPE_PERSON = "SUBJECT_TYPE_PERSON",
  SUBJECT_TYPE_PRODUCT = "SUBJECT_TYPE_PRODUCT",
  SUBJECT_TYPE_ANIMAL = "SUBJECT_TYPE_ANIMAL",
  REFERENCE_TYPE_STYLE = "REFERENCE_TYPE_STYLE",
  REFERENCE_TYPE_RAW = "REFERENCE_TYPE_RAW",
  REFERENCE_TYPE_CONTROL = "REFERENCE_TYPE_CONTROL",
}

export interface MediaBase {
  projectId: string;
  prompt: string;
  mediaType: MediaType;
  negativePrompt?: string;
}

export interface ReferenceImageDto {
  gcsUri: string;
  bytesBase64Encoded: string;
}

export interface ReferenceDataDto {
  referenceId: number;
  description?: string;
  referenceType?: ReferenceType;
  secondaryReferenceType?: SecondaryReferenceType;
  referenceImage: ReferenceImageDto;
}

export interface ImageGenerationDto extends MediaBase {
  aspectRatio: string;
  sampleCount: number;
  model: string;
  referenceData?: ReferenceDataDto[];
}

export interface VideoGenerationDto extends MediaBase {
  durationSeconds: number;
  aspectRatio: string;
  enhancePrompt: boolean;
  sampleCount: number;
  model: string;
  seed: number;
  referenceData?: ReferenceDataDto[];
  referenceImage?: ReferenceImageDto;
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

export interface ImageUpscaleDto extends MediaBase {
  gcsUri: string;
  upscaleFactor: "x2" | "x4";
  model?: string;
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
