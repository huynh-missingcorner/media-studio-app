import apiClient from "@/lib/api";

export interface FileInfo {
  gcsUri: string;
  signedUrl: string;
}

export interface UploadFileResponseDto {
  gcsUri: string;
  signedUrl: string;
}

export interface MultipleUploadFileResponseDto {
  files: FileInfo[];
}

export const fileService = {
  /**
   * Upload a single file to the server
   * @param file The file to upload
   * @returns Promise with upload response containing GCS URI and signed URL
   */
  uploadFile: async (file: File): Promise<UploadFileResponseDto> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<UploadFileResponseDto>(
      "/files/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Upload multiple files to the server
   * @param files Array of files to upload (max 10)
   * @returns Promise with upload response containing array of file info
   */
  uploadMultipleFiles: async (
    files: File[]
  ): Promise<MultipleUploadFileResponseDto> => {
    if (files.length > 10) {
      throw new Error("Maximum 10 files can be uploaded at once");
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await apiClient.post<MultipleUploadFileResponseDto>(
      "/files/upload-multiple",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Get a signed URL for a file stored in Google Cloud Storage
   * @param gcsUri The Google Cloud Storage URI of the file
   * @returns Promise with the signed URL
   */
  getSignedUrl: async (gcsUri: string): Promise<{ signedUrl: string }> => {
    const response = await apiClient.get<{ signedUrl: string }>(
      `/files/signed-url?gcsUri=${encodeURIComponent(gcsUri)}`
    );
    return response.data;
  },
};
