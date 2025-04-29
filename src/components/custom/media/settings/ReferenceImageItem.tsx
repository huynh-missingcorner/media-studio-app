import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { Trash2, ChevronDown, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ReferenceImage,
  useAddReferenceSheetStore,
} from "@/stores/addReferenceSheetStore";
import { cn } from "@/lib/utils";

const referenceImageSchema = z.object({
  imageUrl: z.string().min(1, "Please select an image"),
  description: z.string().optional(),
});

type ReferenceImageFormData = z.infer<typeof referenceImageSchema>;

interface ReferenceImageItemProps {
  referenceImage?: ReferenceImage;
  isNew?: boolean;
  referenceId: string;
}

export function ReferenceImageItem({
  referenceImage,
  isNew = false,
  referenceId,
}: ReferenceImageItemProps) {
  const [isOpen, setIsOpen] = useState(isNew);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    referenceImage?.imageUrl || null
  );

  const { addReferenceImage, updateReferenceImage, removeReferenceImage } =
    useAddReferenceSheetStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    reset,
  } = useForm<ReferenceImageFormData>({
    resolver: zodResolver(referenceImageSchema),
    defaultValues: {
      imageUrl: referenceImage?.imageUrl || "",
      description: referenceImage?.description || "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create URL for preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Store the data URL in the form
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue("imageUrl", reader.result as string, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = (data: ReferenceImageFormData) => {
    if (referenceImage) {
      // Update existing reference image
      updateReferenceImage(referenceId, referenceImage.id, {
        ...data,
      });
    } else {
      // Add new reference image
      addReferenceImage(referenceId, {
        id: uuidv4(),
        ...data,
      });
    }

    // Close the accordion if not a new item
    if (!isNew) {
      setIsOpen(false);
    } else {
      // Reset form for new items
      reset({ imageUrl: "", description: "" });
      setPreviewUrl(null);
    }
  };

  const handleDelete = () => {
    if (referenceImage) {
      removeReferenceImage(referenceId, referenceImage.id);
    }
  };

  return (
    <div className="border rounded-md mb-4 overflow-hidden">
      {/* Header/Toggle */}
      <div
        className="flex items-center justify-between p-3 bg-secondary/30 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            className={cn(
              "w-5 h-5 transition-transform",
              isOpen ? "transform rotate-180" : ""
            )}
          />
          <h3 className="font-medium">Edit Image</h3>
        </div>
        {referenceImage && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Collapsible Content */}
      <div className={cn("px-4 py-3 space-y-4", isOpen ? "block" : "hidden")}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          {/* Image Selection */}
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <div
              className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/30 transition-colors"
              onClick={handleImageClick}
            >
              {previewUrl ? (
                <div className="relative w-full">
                  <img
                    src={previewUrl}
                    alt="Selected reference"
                    className="w-full h-48 object-contain rounded-md"
                  />
                </div>
              ) : (
                <>
                  <ImageIcon className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Click to select an image
                  </p>
                </>
              )}
            </div>
            {errors.imageUrl && (
              <p className="text-sm text-destructive">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe this reference..."
              {...register("description")}
              className="min-h-[100px]"
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={!isDirty && !isNew}>
              Done
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
