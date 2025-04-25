import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { useMediaStore } from "@/stores/mediaStore";
import { getApiPayload } from "@/services/mediaGenerationService";
import { useProjectStore } from "@/stores/projectStore";
import { KeyboardEvent, useState } from "react";
import { mediaService } from "@/services/mediaService";
import { toast } from "@/components/ui/use-toast";
import {
  MediaResponseDto,
  ImageGenerationDto,
  VideoGenerationDto,
  MusicGenerationDto,
  AudioGenerationDto,
  MediaType,
  OperationResponseDto,
} from "@/types/media";

const promptSchema = z.object({
  prompt: z.string().min(3, "Prompt must be at least 3 characters"),
});

type PromptFormValues = z.infer<typeof promptSchema>;

// Define a type for the base payload from getApiPayload
type BasePayload = {
  prompt: string;
  projectId: string;
  model?: string;
  aspectRatio?: string;
  numberOfResults?: number;
  durationSeconds?: string | number;
  enhancePrompt?: boolean;
  seed?: number;
  [key: string]: unknown;
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

  switch (mediaType) {
    case "image":
      return {
        projectId: basePayload.projectId,
        prompt: basePayload.prompt,
        mediaType: mediaTypeEnum,
        aspectRatio: basePayload.aspectRatio || "1:1",
        sampleCount: basePayload.numberOfResults || 1,
        model: basePayload.model || "imagen-3.0-generate-002",
      } as ImageGenerationDto;
    case "video":
      return {
        projectId: basePayload.projectId,
        prompt: basePayload.prompt,
        mediaType: mediaTypeEnum,
        durationSeconds: Number(basePayload.durationSeconds) || 5,
        aspectRatio: basePayload.aspectRatio || "16:9",
        enhancePrompt: basePayload.enhancePrompt ?? true,
        sampleCount: basePayload.numberOfResults || 1,
        model: basePayload.model || "veo-2.0-generate-001",
        seed: basePayload.seed || 42,
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
      } as MusicGenerationDto;
    case "audio":
      return {
        projectId: basePayload.projectId,
        prompt: basePayload.prompt,
        mediaType: mediaTypeEnum,
        durationSeconds: 5, // Default duration
        audioStyle: "natural", // Default style
        seed: basePayload.seed || 42,
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
  } = useMediaStore();

  const { currentProject } = useProjectStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: "",
    },
  });

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
    if (!currentProject?.id) {
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

      const basePayload = getApiPayload(
        selectedMediaType,
        data.prompt,
        currentProject.id,
        getCurrentSettings()
      );

      let response: MediaResponseDto | null = null;
      let operationResponse: OperationResponseDto | null = null;

      switch (selectedMediaType) {
        case "image":
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
          operationResponse = await mediaService.generateVideo(
            transformPayload("video", basePayload) as VideoGenerationDto
          );
          break;
        default:
          throw new Error(`Unsupported media type: ${selectedMediaType}`);
      }

      if (response && selectedMediaType !== "video") {
        setMediaResponse(response);
        toast({
          title: "Success",
          description: `Your ${selectedMediaType} has been generated successfully`,
        });
        setIsGenerating(false);
        setIsSubmitting(false);
      }

      if (operationResponse && selectedMediaType === "video") {
        setOperationResponse(operationResponse);
      }

      form.reset();
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

  return (
    <div className="bg-background p-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <div className="relative">
          <Textarea
            className="min-h-[100px] resize-none pr-12 text-base"
            placeholder={getPlaceholder()}
            {...form.register("prompt")}
            disabled={isGenerating || isSubmitting}
            onKeyDown={handleKeyDown}
          />
          <div className="flex justify-between">
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-2 top-2 w-10 h-10 [&_svg]:size-6"
              disabled={isGenerating || isSubmitting || !form.formState.isValid}
            >
              <SendHorizonal size={30} className="text-blue-500" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
