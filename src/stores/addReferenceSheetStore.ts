import { create } from "zustand";
import {
  ReferenceDataDto,
  ReferenceImageDto,
  ReferenceType,
  SecondaryReferenceType,
} from "@/types/media.types";
import { referenceUploadService } from "@/services/api/referenceUploadService";

// Interface to represent a reference image in the store
export interface ReferenceImage {
  id: string;
  imageUrl: string; // For UI display
  description?: string;
  secondaryReferenceType?: SecondaryReferenceType;
  gcsUri?: string; // GCS URI for backend storage
  bytesBase64Encoded?: string; // Base64 encoded image data
}

// Interface to represent a complete reference with type and images
export interface Reference {
  id: string;
  referenceId: number; // Numeric reference ID for API consistency
  referenceType: ReferenceType;
  images: ReferenceImage[];
}

// Optional callback function when savedReferences change
export type ReferencesChangeCallback = (references: Reference[]) => void;

interface AddReferenceSheetState {
  open: boolean;
  references: Reference[];
  activeReferenceId: string | null;
  isUploading: boolean;
  uploadError: string | null;
  nextReferenceId: number; // Track the next available reference ID
  savedReferences: Reference[]; // Store saved references
  referencesChangeListeners: ReferencesChangeCallback[]; // Callbacks for reference changes

  // Sheet actions
  openSheet: () => void;
  closeSheet: () => void;
  setOpen: (open: boolean) => void;

  // Reference management
  addReference: (referenceType: ReferenceType) => string; // Returns new reference ID (string)
  updateReferenceType: (
    referenceId: string,
    referenceType: ReferenceType
  ) => void;
  removeReference: (referenceId: string) => void;
  setActiveReference: (referenceId: string | null) => void;

  // Saved reference management
  removeSavedReference: (referenceId: number) => void; // Remove a saved reference by its numeric ID
  clearSavedReferences: () => void; // Clear all saved references

  // Event listeners
  addReferencesChangeListener: (
    callback: ReferencesChangeCallback
  ) => () => void; // Returns unsubscribe function
  removeReferencesChangeListener: (callback: ReferencesChangeCallback) => void;

  // Notify listeners of changes
  notifyReferencesChanged: () => void;

  // Reference image management
  addReferenceImage: (
    referenceId: string,
    image: Omit<ReferenceImage, "secondaryReferenceType">
  ) => void;
  updateReferenceImage: (
    referenceId: string,
    imageId: string,
    updates: Partial<ReferenceImage>
  ) => void;
  removeReferenceImage: (referenceId: string, imageId: string) => void;

  // Other actions
  clearReferences: () => void;
  prepareReferenceDataDtos: () => ReferenceDataDto[];
  saveReferences: () => void; // Save references to the persistent store
  uploadReferenceImages: () => Promise<Reference[]>;
  setIsUploading: (isUploading: boolean) => void;
  setUploadError: (error: string | null) => void;

  // Get the total count of images across all references
  getTotalImageCount: () => number;
}

export const useAddReferenceSheetStore = create<AddReferenceSheetState>(
  (set, get) => ({
    open: false,
    references: [],
    activeReferenceId: null,
    isUploading: false,
    uploadError: null,
    nextReferenceId: 1, // Start with reference ID 1
    savedReferences: [], // Initialize empty saved references
    referencesChangeListeners: [], // Initialize empty array of listeners

    // Sheet actions
    openSheet: () => {
      const { nextReferenceId } = get();
      // Create a fresh reference when opening the sheet
      const newReferenceId = `ref-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`;
      set({
        open: true,
        activeReferenceId: newReferenceId,
        references: [
          {
            id: newReferenceId,
            referenceId: nextReferenceId,
            referenceType: ReferenceType.DEFAULT,
            images: [],
          },
        ],
        nextReferenceId: nextReferenceId + 1,
      });
    },

    closeSheet: () => set({ open: false }),
    setOpen: (open) => set({ open }),

    // Reference management
    addReference: (referenceType) => {
      const { nextReferenceId } = get();
      const newReferenceId = `ref-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`;

      set((state) => {
        const updatedReferences = [
          ...state.references,
          {
            id: newReferenceId,
            referenceId: nextReferenceId,
            referenceType,
            images: [],
          },
        ];

        console.log(
          "Added new reference. Current references:",
          updatedReferences
        );

        return {
          references: updatedReferences,
          activeReferenceId: newReferenceId,
          nextReferenceId: nextReferenceId + 1,
        };
      });

      return newReferenceId;
    },

    // Event listeners
    addReferencesChangeListener: (callback) => {
      set((state) => ({
        referencesChangeListeners: [
          ...state.referencesChangeListeners,
          callback,
        ],
      }));

      // Return unsubscribe function
      return () => get().removeReferencesChangeListener(callback);
    },

    removeReferencesChangeListener: (callback) => {
      set((state) => ({
        referencesChangeListeners: state.referencesChangeListeners.filter(
          (listener) => listener !== callback
        ),
      }));
    },

    notifyReferencesChanged: () => {
      const { savedReferences, referencesChangeListeners } = get();
      referencesChangeListeners.forEach((callback) =>
        callback(savedReferences)
      );
    },

    // Saved reference management
    removeSavedReference: (referenceId) =>
      set((state) => {
        const updatedSavedReferences = state.savedReferences.filter(
          (reference) => reference.referenceId !== referenceId
        );

        console.log(
          "Removed saved reference. Current saved references:",
          updatedSavedReferences
        );

        // Call notify after state update completes
        setTimeout(() => get().notifyReferencesChanged(), 0);

        return { savedReferences: updatedSavedReferences };
      }),

    clearSavedReferences: () => {
      set({ savedReferences: [] });
      setTimeout(() => get().notifyReferencesChanged(), 0);
    },

    updateReferenceType: (referenceId, referenceType) =>
      set((state) => {
        const updatedReferences = state.references.map((reference) =>
          reference.id === referenceId
            ? { ...reference, referenceType }
            : reference
        );

        console.log(
          "Updated reference type. Current references:",
          updatedReferences
        );

        return { references: updatedReferences };
      }),

    removeReference: (referenceId) =>
      set((state) => {
        const updatedReferences = state.references.filter(
          (reference) => reference.id !== referenceId
        );

        console.log(
          "Removed reference. Current references:",
          updatedReferences
        );

        return {
          references: updatedReferences,
          activeReferenceId:
            state.activeReferenceId === referenceId
              ? null
              : state.activeReferenceId,
        };
      }),

    setActiveReference: (referenceId) =>
      set({ activeReferenceId: referenceId }),

    // Reference image management
    addReferenceImage: (referenceId, image) =>
      set((state) => {
        const referenceIndex = state.references.findIndex(
          (ref) => ref.id === referenceId
        );
        if (referenceIndex === -1) return state;

        const updatedReferences = [...state.references];
        const newImage = {
          ...image,
          secondaryReferenceType: SecondaryReferenceType.SUBJECT_TYPE_DEFAULT,
        };

        updatedReferences[referenceIndex] = {
          ...updatedReferences[referenceIndex],
          images: [...updatedReferences[referenceIndex].images, newImage],
        };

        console.log(
          "Added image to reference. Current references:",
          updatedReferences
        );

        return { references: updatedReferences };
      }),

    updateReferenceImage: (referenceId, imageId, updates) =>
      set((state) => {
        const referenceIndex = state.references.findIndex(
          (ref) => ref.id === referenceId
        );
        if (referenceIndex === -1) return state;

        const updatedReferences = [...state.references];
        updatedReferences[referenceIndex] = {
          ...updatedReferences[referenceIndex],
          images: updatedReferences[referenceIndex].images.map((image) =>
            image.id === imageId ? { ...image, ...updates } : image
          ),
        };

        console.log(
          "Updated image in reference. Current references:",
          updatedReferences
        );

        return { references: updatedReferences };
      }),

    removeReferenceImage: (referenceId, imageId) =>
      set((state) => {
        const referenceIndex = state.references.findIndex(
          (ref) => ref.id === referenceId
        );
        if (referenceIndex === -1) return state;

        const updatedReferences = [...state.references];
        updatedReferences[referenceIndex] = {
          ...updatedReferences[referenceIndex],
          images: updatedReferences[referenceIndex].images.filter(
            (image) => image.id !== imageId
          ),
        };

        console.log(
          "Removed image from reference. Current references:",
          updatedReferences
        );

        return { references: updatedReferences };
      }),

    clearReferences: () => {
      console.log("Cleared all references");
      return set({
        references: [],
        activeReferenceId: null,
        nextReferenceId: 1,
      });
    },

    // Save references to the persistent store
    saveReferences: () => {
      const { references } = get();
      // Filter out references with no images
      const validReferences = references.filter((ref) => ref.images.length > 0);

      set((state) => {
        const updatedSavedReferences = [
          ...state.savedReferences,
          ...validReferences,
        ];
        console.log("Saved references:", updatedSavedReferences);

        // Call notify after state update completes
        setTimeout(() => get().notifyReferencesChanged(), 0);

        return { savedReferences: updatedSavedReferences };
      });
    },

    setIsUploading: (isUploading) => set({ isUploading }),
    setUploadError: (error) => set({ uploadError: error }),

    // Get the total count of images across all references
    getTotalImageCount: () => {
      const { references } = get();
      return references.reduce((count, ref) => count + ref.images.length, 0);
    },

    // Prepare DTOs without actually uploading
    prepareReferenceDataDtos: () => {
      const { references } = get();
      let allReferenceDtos: ReferenceDataDto[] = [];

      references.forEach((reference) => {
        // Create a ReferenceDataDto for each image that has a gcsUri
        const referenceDtos = reference.images
          .filter((img) => !!img.gcsUri) // Only include images with gcsUri
          .map((img) => {
            return {
              referenceId: reference.referenceId,
              description: img.description || "",
              referenceType: reference.referenceType,
              secondaryReferenceType: img.secondaryReferenceType,
              referenceImage: {
                gcsUri: img.gcsUri || "",
                bytesBase64Encoded: "", // Empty string as we're only using gcsUri
              } as ReferenceImageDto,
            };
          });

        allReferenceDtos = [...allReferenceDtos, ...referenceDtos];
      });

      console.log(
        `Prepared ${allReferenceDtos.length} reference DTOs with gcsUri`
      );
      return allReferenceDtos;
    },

    // For API compatibility, but not used for now
    getReferenceDataDtos: () => {
      return get().prepareReferenceDataDtos();
    },

    // Upload all reference images to the server
    uploadReferenceImages: async () => {
      try {
        const { savedReferences, setIsUploading, setUploadError } = get();

        if (savedReferences.length === 0) {
          console.log("No saved references to upload");
          return [];
        }

        console.log(
          `Starting upload of reference images for ${savedReferences.length} saved references...`
        );
        setIsUploading(true);
        setUploadError(null);

        // Use the reference upload service to upload saved references
        const uploadedReferences =
          await referenceUploadService.uploadMultipleReferences(
            savedReferences
          );

        // Update the savedReferences in the store with the uploaded ones that have gcsUri
        set({ savedReferences: uploadedReferences });

        // Notify listeners of change after upload
        setTimeout(() => get().notifyReferencesChanged(), 0);

        // Log how many images have gcsUri values
        const imagesWithGcsUri = uploadedReferences.reduce((count, ref) => {
          return count + ref.images.filter((img) => !!img.gcsUri).length;
        }, 0);

        console.log(
          `Reference image uploads completed: ${imagesWithGcsUri} images now have gcsUri values`
        );
        return uploadedReferences;
      } catch (error) {
        const { setUploadError } = get();
        console.error("Error uploading reference images:", error);
        setUploadError(
          error instanceof Error
            ? error.message
            : "Failed to upload reference images"
        );
        return get().savedReferences;
      } finally {
        const { setIsUploading } = get();
        setIsUploading(false);
      }
    },
  })
);
