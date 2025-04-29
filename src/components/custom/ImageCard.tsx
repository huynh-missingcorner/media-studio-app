import { DownloadIcon, Video, MoreVertical, ArrowUpCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useAddReferenceSheetStore } from "@/stores/addReferenceSheetStore";
import { useMediaStore } from "@/stores/mediaStore";
import { ReferenceType } from "@/types/media.types";
import { toast } from "sonner";
import { useState } from "react";
import { UpscaleImageModal } from "./UpscaleImageModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ImageCardProps {
  url: string;
  id: string;
  gcsUri?: string;
  prompt?: string;
  projectId?: string;
}

export function ImageCard({
  url,
  id,
  gcsUri,
  prompt,
  projectId,
}: ImageCardProps) {
  const { addReference, addReferenceImage, saveReferences } =
    useAddReferenceSheetStore();
  const { setSelectedMediaType } = useMediaStore();
  const [isUpscaleModalOpen, setIsUpscaleModalOpen] = useState(false);

  // Convert blob to data URL
  const blobToDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleUseForVideo = async () => {
    try {
      // Create a new reference with type DEFAULT which is appropriate for video
      const referenceId = addReference(ReferenceType.DEFAULT);

      // Add the current image to the reference
      const imageId = `img-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`;

      // Fetch the image and convert to data URL for reference store
      const response = await fetch(url);
      const blob = await response.blob();
      const dataUrl = await blobToDataURL(blob);

      // Add image to reference with proper formats for upload
      // The dataUrl format is critical for the referenceUploadService
      addReferenceImage(referenceId, {
        id: imageId,
        imageUrl: dataUrl, // Data URL format for proper upload
        description: "Generated image for video reference",
        // We don't set bytesBase64Encoded or gcsUri here
        // referenceUploadService will handle converting this to a File and uploading it
      });

      // Save references to make them persistent
      saveReferences();

      // Switch to video media type
      setSelectedMediaType("video");

      toast.success("Image added as reference for video generation", {
        description:
          "Now you can enter a prompt to generate a video based on this image",
      });
    } catch (error) {
      console.error("Error using image for video:", error);
      toast.error("Failed to use image for video", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  const handleUpscale = () => {
    // Check if we have the required properties for upscaling
    if (!gcsUri) {
      toast.error("Cannot upscale this image", {
        description: "Missing GCS URI for this image",
      });
      return;
    }

    if (!projectId) {
      toast.error("Cannot upscale this image", {
        description: "Missing project ID for this image",
      });
      return;
    }

    setIsUpscaleModalOpen(true);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const newUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = newUrl;
      a.download = `image-${id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(newUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="relative h-full w-full">
      <img
        src={url}
        alt="Generated image"
        className="w-full h-full object-cover"
      />
      <div className="absolute top-3 right-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
              aria-label="Image options"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleUseForVideo}
              className="flex gap-2 cursor-pointer"
            >
              <Video className="h-4 w-4 text-primary" />
              <span>Use for video</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleUpscale}
              className="flex gap-2 cursor-pointer"
            >
              <ArrowUpCircle className="h-4 w-4 text-green-500" />
              <span>Upscale image</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDownload}
              className="flex gap-2 cursor-pointer"
            >
              <DownloadIcon className="h-4 w-4 text-blue-500" />
              <span>Download</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isUpscaleModalOpen && (
        <UpscaleImageModal
          open={isUpscaleModalOpen}
          onClose={() => setIsUpscaleModalOpen(false)}
          imageUrl={url}
          gcsUri={gcsUri || ""}
          prompt={prompt || ""}
          projectId={projectId || ""}
        />
      )}
    </div>
  );
}
