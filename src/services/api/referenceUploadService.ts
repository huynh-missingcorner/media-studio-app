import { fileService } from "./fileService";
import { Reference, ReferenceImage } from "@/stores/addReferenceSheetStore";

/**
 * Service for handling reference image uploads
 */
export const referenceUploadService = {
  /**
   * Upload all images from a single reference
   * @param reference The reference object containing images to upload
   * @returns The same reference with gcsUri values populated
   */
  async uploadReferenceImages(reference: Reference): Promise<Reference> {
    // Clone the reference to avoid mutating the original
    const updatedReference = { ...reference };
    const updatedImages: ReferenceImage[] = [];

    console.log(
      `Processing ${reference.images.length} images for reference #${reference.referenceId}`
    );

    // Process each image
    for (const image of reference.images) {
      try {
        // Skip images that already have a gcsUri
        if (image.gcsUri) {
          console.log(`Image ${image.id} already has gcsUri: ${image.gcsUri}`);
          updatedImages.push(image);
          continue;
        }

        // Convert data URL to File object for upload
        if (image.imageUrl && image.imageUrl.startsWith("data:image/")) {
          const file = await dataURLtoFile(
            image.imageUrl,
            `reference-${image.id}.jpg`
          );
          const uploadResult = await fileService.uploadFile(file);

          // Update the image with the GCS URI and remove bytesBase64Encoded
          const updatedImage = {
            ...image,
            gcsUri: uploadResult.gcsUri,
            // Clear bytesBase64Encoded as we now have gcsUri
            bytesBase64Encoded: undefined,
          };

          updatedImages.push(updatedImage);
          console.log(`Uploaded image ${image.id} to ${uploadResult.gcsUri}`);
        } else {
          console.warn(
            `Image ${image.id} doesn't have a valid data URL to upload`
          );
          // Still include the original image in case we want to try again later
          updatedImages.push(image);
        }
      } catch (error) {
        console.error(`Error processing image ${image.id}:`, error);
        // Still include the original image
        updatedImages.push(image);
      }
    }

    updatedReference.images = updatedImages;

    // Log stats of uploaded images
    const imagesWithGcsUri = updatedImages.filter((img) => !!img.gcsUri).length;
    console.log(
      `Reference #${reference.referenceId}: ${imagesWithGcsUri}/${updatedImages.length} images have gcsUri`
    );

    return updatedReference;
  },

  /**
   * Upload images from multiple references
   * @param references Array of references containing images to upload
   * @returns Array of references with gcsUri values populated
   */
  async uploadMultipleReferences(
    references: Reference[]
  ): Promise<Reference[]> {
    const updatedReferences: Reference[] = [];

    for (const reference of references) {
      const updatedReference = await this.uploadReferenceImages(reference);
      updatedReferences.push(updatedReference);
    }

    return updatedReferences;
  },
};

/**
 * Convert a data URL to a File object
 * @param dataUrl The data URL to convert
 * @param filename The filename to use for the file
 * @returns A File object representing the data URL
 */
async function dataURLtoFile(dataUrl: string, filename: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
}
