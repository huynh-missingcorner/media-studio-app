import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizonal, ImagePlus, X } from "lucide-react";
import { useMediaStore } from "@/stores/mediaStore";
import { getApiPayload } from "@/services/mediaGenerationService";
import { useProjectStore } from "@/stores/projectStore";
import { KeyboardEvent, useState, useEffect } from "react";
import { mediaService } from "@/services/api/mediaService";
import {
  MediaResponseDto,
  ImageGenerationDto,
  VideoGenerationDto,
  MusicGenerationDto,
  AudioGenerationDto,
  MediaType,
  OperationResponseDto,
  ReferenceDataDto,
  ReferenceImageDto,
} from "@/types/media.types";
import { useMediaHistoryStore } from "@/stores";
import {
  useAddReferenceSheetStore,
  Reference,
} from "@/stores/addReferenceSheetStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const promptSchema = z.object({
  prompt: z.string().min(3, "Prompt must be at least 3 characters"),
});

type PromptFormValues = z.infer<typeof promptSchema>;

// Define a type for the base payload from getApiPayload
type BasePayload = {
  prompt: string;
  projectId: string;
  negativePrompt?: string;
  aspectRatio?: string;
  sampleCount?: number;
  model?: string;
  enhancePrompt?: boolean;
  seed?: number;
  referenceData?: ReferenceDataDto[];
  durationSeconds?: number | string;
};

// Helper function to transform general payload to type-specific DTOs
function transformPayload(
  mediaType: string,
  basePayload: BasePayload
):
  | ImageGenerationDto
  | VideoGenerationDto
  | MusicGenerationDto
  | AudioGenerationDto {
  const mediaTypeEnum = mediaType.toUpperCase() as MediaType;

  // Ensure negativePrompt is a string
  const negativePrompt =
    typeof basePayload.negativePrompt === "string"
      ? basePayload.negativePrompt
      : "";

  switch (mediaType) {
    case "image":
      return {
        projectId: basePayload.projectId,
        prompt: basePayload.prompt,
        mediaType: mediaTypeEnum,
        aspectRatio: basePayload.aspectRatio || "1:1",
        sampleCount: basePayload.sampleCount || 1,
        model: basePayload.model || "imagen-3.0-generate-002",
        negativePrompt,
        referenceData:
          (basePayload.referenceData as ReferenceDataDto[]) || undefined,
      } as ImageGenerationDto;
    case "video":
      return {
        projectId: basePayload.projectId,
        prompt: basePayload.prompt,
        mediaType: mediaTypeEnum,
        durationSeconds: Number(basePayload.durationSeconds) || 5,
        aspectRatio: basePayload.aspectRatio || "16:9",
        enhancePrompt: basePayload.enhancePrompt ?? true,
        sampleCount: basePayload.sampleCount || 1,
        model: basePayload.model || "veo-2.0-generate-001",
        seed: basePayload.seed || 42,
        negativePrompt,
        referenceData:
          (basePayload.referenceData as ReferenceDataDto[]) || undefined,
      } as VideoGenerationDto;
    case "music":
      return {
        projectId: basePayload.projectId,
        prompt: basePayload.prompt,
        mediaType: mediaTypeEnum,
        durationSeconds: 5, // Default duration
        genre: "ambient", // Default genre
        instrument: "piano", // Default instrument
        tempo: 120, // Default tempo
        seed: basePayload.seed || 42,
        negativePrompt,
      } as MusicGenerationDto;
    case "audio":
      return {
        projectId: basePayload.projectId,
        prompt: basePayload.prompt,
        mediaType: mediaTypeEnum,
        durationSeconds: 5, // Default duration
        audioStyle: "natural", // Default style
        seed: basePayload.seed || 42,
        negativePrompt,
      } as AudioGenerationDto;
    default:
      throw new Error(`Unsupported media type: ${mediaType}`);
  }
}

export function PromptInput() {
  const {
    selectedMediaType,
    setPrompt,
    isGenerating,
    setIsGenerating,
    getCurrentSettings,
    setMediaResponse,
    setOperationResponse,
    prompt,
  } = useMediaStore();

  const { currentProject } = useProjectStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingReferences, setIsUploadingReferences] = useState(false);
  const { refreshAfterGeneration } = useMediaHistoryStore();
  const {
    openSheet,
    savedReferences,
    removeSavedReference,
    uploadReferenceImages,
  } = useAddReferenceSheetStore();

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: "",
    },
    mode: "onChange",
  });

  // Update form value when prompt changes from store
  useEffect(() => {
    if (prompt) {
      // Set the value in the form
      form.setValue("prompt", prompt);

      // Trigger validation to update form.formState.isValid
      form.trigger("prompt");
    }
  }, [prompt, form]);

  const getPlaceholder = () => {
    switch (selectedMediaType) {
      case "image":
        return "Describe the image you want to generate...";
      case "audio":
        return "Describe the audio clip you want to generate...";
      case "music":
        return "Describe the music track you want to generate...";
      case "video":
        return "Describe the video you want to generate...";
      default:
        return "Enter your prompt...";
    }
  };

  const onSubmit = async (data: PromptFormValues) => {
    if (!currentProject?.id || !selectedMediaType) {
      toast({
        title: "No project selected",
        description: "Please select a project before generating media",
        variant: "destructive",
      });
      return;
    }

    try {
      // Set the prompt and start generating
      setPrompt(data.prompt);
      setIsGenerating(true);
      setIsSubmitting(true);
      setMediaResponse(null);
      setOperationResponse(null);

      // Upload reference images if we have any and the media type supports references
      let uploadedReferences: Reference[] = [];
      if (
        ["image", "video"].includes(selectedMediaType) &&
        savedReferences.length > 0
      ) {
        try {
          setIsUploadingReferences(true);
          console.log(
            `Uploading ${
              savedReferences.length
            } references with ${savedReferences.reduce(
              (acc, ref) => acc + ref.images.length,
              0
            )} total images...`
          );
          uploadedReferences = await uploadReferenceImages();

          // Count images with gcsUri
          const imagesWithGcsUri = uploadedReferences.reduce((acc, ref) => {
            return acc + ref.images.filter((img) => !!img.gcsUri).length;
          }, 0);

          console.log(
            `References after upload: ${uploadedReferences.length} references with ${imagesWithGcsUri} images containing gcsUri`
          );
        } catch (error) {
          console.error("Error uploading reference images:", error);
          toast({
            title: "Warning",
            description:
              "There was an issue uploading reference images. Generation will continue but some images may not be used.",
            variant: "destructive",
          });
        } finally {
          setIsUploadingReferences(false);
        }
      }

      const basePayload = getApiPayload(
        selectedMediaType,
        data.prompt,
        currentProject.id,
        getCurrentSettings()
      ) as BasePayload;

      // Add reference data to the payload for image and video types
      if (
        ["image", "video"].includes(selectedMediaType) &&
        uploadedReferences.length > 0
      ) {
        console.log(
          `Processing ${uploadedReferences.length} uploaded references for media generation...`
        );

        // Use the uploadedReferences which should have gcsUri values set
        // First create a more detailed mapping for debugging
        const referenceDetails = uploadedReferences.map((ref) => {
          const imagesWithGcsUri = ref.images.filter((img) => !!img.gcsUri);
          return {
            referenceId: ref.referenceId,
            totalImages: ref.images.length,
            imagesWithGcsUri: imagesWithGcsUri.length,
            referenceType: ref.referenceType,
            gcsUris: imagesWithGcsUri.map((img) => img.gcsUri),
          };
        });

        console.log("Reference details:", referenceDetails);

        // Now create the actual referenceData array for the API
        let refDataItems = uploadedReferences.flatMap((ref) => {
          const imagesWithGcsUri = ref.images.filter((img) => !!img.gcsUri);

          return imagesWithGcsUri.map((img) => ({
            referenceId: ref.referenceId,
            description: img.description || "",
            referenceType: ref.referenceType,
            secondaryReferenceType: img.secondaryReferenceType,
            referenceImage: {
              gcsUri: img.gcsUri as string, // Force non-null since we filtered
              bytesBase64Encoded: "", // Leave empty as we're only using gcsUri
            } as ReferenceImageDto,
          }));
        });

        // If we're generating a video, we need to limit to just one reference image
        if (selectedMediaType === "video" && refDataItems.length > 0) {
          console.log(`Video generation - limiting to first reference image`);
          refDataItems = [refDataItems[0]];
        }

        basePayload.referenceData = refDataItems;

        const refCount = basePayload.referenceData?.length || 0;
        console.log(
          `Adding ${refCount} reference data items with gcsUri to ${selectedMediaType} generation payload`
        );

        if (refCount === 0) {
          console.warn(
            "No references with gcsUri found after upload. Will not include reference data in the request."
          );
          // Just to be safe, set to undefined if empty
          basePayload.referenceData = undefined;
        } else {
          // Log the first few items for verification
          console.log(
            "Sample reference data items:",
            basePayload.referenceData.slice(0, Math.min(3, refCount))
          );
        }
      }

      let response: MediaResponseDto | null = null;
      let operationResponse: OperationResponseDto | null = null;

      switch (selectedMediaType) {
        case "image":
          console.log(
            "Image generation payload referenceData:",
            basePayload.referenceData?.length || 0,
            "items"
          );
          response = await mediaService.generateImage(
            transformPayload("image", basePayload) as ImageGenerationDto
          );
          break;
        case "audio":
          response = await mediaService.generateAudio(
            transformPayload("audio", basePayload) as AudioGenerationDto
          );
          break;
        case "music":
          response = await mediaService.generateMusic(
            transformPayload("music", basePayload) as MusicGenerationDto
          );
          break;
        case "video":
          console.log(
            "Video generation payload referenceData:",
            basePayload.referenceData?.length || 0,
            "items"
          );
          operationResponse = await mediaService.generateVideo(
            transformPayload("video", basePayload) as VideoGenerationDto
          );
          break;
        default:
          throw new Error(`Unsupported media type: ${selectedMediaType}`);
      }

      if (response && selectedMediaType !== "video") {
        setMediaResponse(response);
        // Update history with the new media item
        refreshAfterGeneration(response);
        toast({
          title: "Success",
          description: `Your ${selectedMediaType} has been generated successfully`,
        });
        setIsGenerating(false);
        setIsSubmitting(false);
      }

      if (operationResponse && selectedMediaType === "video") {
        setOperationResponse(operationResponse);
        // For video, we'll refresh history when the operation completes
      }

      // Don't reset the form to keep the prompt for editing
      // form.reset();

      // For video mode, enforce one reference with one image
      if (selectedMediaType === "video") {
        const referencesWithImages = uploadedReferences.filter(
          (ref) => ref.images.length > 0
        );
        const totalImagesCount = referencesWithImages.reduce(
          (sum, ref) => sum + ref.images.length,
          0
        );

        if (referencesWithImages.length > 1 || totalImagesCount > 1) {
          toast({
            title: "Video Mode Constraints",
            description:
              "Only the first image from the first reference will be used for video generation. Other references or images will be ignored by the API.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error(`Error generating ${selectedMediaType}:`, error);
      toast({
        title: "Generation failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      setIsGenerating(false);
    } finally {
      setIsSubmitting(false);
      setIsUploadingReferences(false);
    }
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Let Shift+Enter add a new line naturally
        return;
      } else {
        // Prevent default behavior (which would add a new line)
        e.preventDefault();

        // Only submit if form is valid and not currently generating
        if (form.formState.isValid && !isGenerating && !isSubmitting) {
          form.handleSubmit(onSubmit)();
        }
      }
    }
  }

  const allowAddReference = ["image", "video"].includes(selectedMediaType);
  const hasReferences = savedReferences.length > 0;

  // Function to handle removing a reference
  const handleRemoveReference = (referenceId: number) => {
    removeSavedReference(referenceId);
  };

  return (
    <div className="bg-background p-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <div className={cn("relative", hasReferences ? "mb-12" : "")}>
          <Textarea
            className={cn(
              "min-h-[100px] resize-none pr-12 text-base",
              allowAddReference && "pl-12"
            )}
            placeholder={getPlaceholder()}
            {...form.register("prompt")}
            disabled={isGenerating || isSubmitting}
            onKeyDown={handleKeyDown}
          />
          <div className="flex justify-between">
            {allowAddReference && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute left-2 top-2 w-8 h-8 [&_svg]:size-5 text-primary translate-y-[-2px]"
                onClick={openSheet}
                title="Add reference images"
              >
                <ImagePlus size={24} className="text-primary" />
              </Button>
            )}
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-2 top-2 w-10 h-10 [&_svg]:size-6"
              disabled={
                isGenerating ||
                isSubmitting ||
                isUploadingReferences ||
                !form.formState.isValid
              }
            >
              <SendHorizonal size={30} className="text-blue-500" />
            </Button>
          </div>

          {/* Reference Badges */}
          {hasReferences && (
            <div className="absolute -bottom-11 left-0 right-0 flex flex-wrap gap-2 overflow-x-auto py-2 max-w-full">
              {savedReferences.map((reference) => {
                const typeName =
                  reference.referenceType.charAt(0).toUpperCase() +
                  reference.referenceType.slice(1);
                return (
                  <div
                    key={reference.id}
                    className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      "flex items-center gap-1 pl-2 pr-1 py-1 h-6 bg-blue-100 text-blue-800 border-blue-200"
                    )}
                  >
                    <span className="font-medium">
                      [{reference.referenceId}]
                    </span>
                    <span>{typeName}:</span>
                    <span>
                      {reference.images.length} image
                      {reference.images.length !== 1 ? "s" : ""}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1 hover:bg-white/30 rounded-full"
                      onClick={() =>
                        handleRemoveReference(reference.referenceId)
                      }
                      aria-label={`Remove reference ${reference.referenceId}`}
                    >
                      <X size={10} />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
