import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { mediaService } from "@/services/api/mediaService";
import { ImageUpscaleDto } from "@/types/media.types";

interface UpscaleImageModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  gcsUri: string;
  prompt: string;
  projectId: string;
}

export function UpscaleImageModal({
  open,
  onClose,
  imageUrl,
  gcsUri,
  prompt,
  projectId,
}: UpscaleImageModalProps) {
  const [upscaleFactor, setUpscaleFactor] = useState<"x2" | "x4">("x2");
  const [isUpscaling, setIsUpscaling] = useState(false);

  const handleUpscale = async () => {
    try {
      setIsUpscaling(true);
      toast.info("Upscaling image...", {
        description: "This may take a moment",
      });

      const upscaleData: ImageUpscaleDto = {
        gcsUri,
        projectId,
        prompt,
        mediaType: "IMAGE",
        negativePrompt: "",
        upscaleFactor,
      };

      const response = await mediaService.upscaleImage(upscaleData);

      if (response.results && response.results.length > 0) {
        const resultUrl = response.results[0].resultUrl;

        // Properly download the image instead of opening it
        try {
          // Fetch the image to get a blob
          const imageResponse = await fetch(resultUrl);
          const blob = await imageResponse.blob();

          // Create a blob URL and trigger download
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = `upscaled-${upscaleFactor}-image.jpg`;
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();

          // Clean up
          window.URL.revokeObjectURL(blobUrl);
          document.body.removeChild(a);

          toast.success("Image upscaled successfully", {
            description: "Your upscaled image has been downloaded",
          });
        } catch (error) {
          console.error("Error downloading upscaled image:", error);
          toast.error("Failed to download upscaled image", {
            description:
              "The image was upscaled successfully but couldn't be downloaded automatically. Try opening the URL directly.",
          });
        }
      } else {
        toast.error("Upscale failed", {
          description: "No results returned from the API",
        });
      }

      onClose();
    } catch (error) {
      console.error("Error upscaling image:", error);
      toast.error("Failed to upscale image", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsUpscaling(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upscale Image</DialogTitle>
          <DialogDescription>
            Choose a scale factor to enhance the image resolution
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4">
              <img
                src={imageUrl}
                alt="Image to upscale"
                className="w-full h-32 object-cover rounded-md"
              />
            </div>
            <div className="col-span-4">
              <label htmlFor="upscale-factor" className="text-sm font-medium">
                Scale Factor
              </label>
              <Select
                value={upscaleFactor}
                onValueChange={(value) =>
                  setUpscaleFactor(value as "x2" | "x4")
                }
              >
                <SelectTrigger id="upscale-factor">
                  <SelectValue placeholder="Select scale factor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="x2">2x Upscale</SelectItem>
                  <SelectItem value="x4">4x Upscale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUpscaling}>
            Cancel
          </Button>
          <Button onClick={handleUpscale} disabled={isUpscaling}>
            {isUpscaling ? "Upscaling..." : "Upscale"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
