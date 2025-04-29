import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useAddReferenceSheetStore } from "@/stores/addReferenceSheetStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, AlertCircle } from "lucide-react";
import { ReferenceImageItem } from "./ReferenceImageItem";
import { toast } from "sonner";
import { ReferenceType } from "@/types/media.types";
import { useMediaStore } from "@/stores/mediaStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const referenceTypeOptions = Object.values(ReferenceType).map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

export function AddReferenceSheet() {
  const {
    open,
    setOpen,
    references,
    activeReferenceId,
    isUploading,
    clearReferences,
    prepareReferenceDataDtos,
    updateReferenceType,
    getTotalImageCount,
    saveReferences,
  } = useAddReferenceSheetStore();
  const { selectedMediaType } = useMediaStore();
  const [showNewItem, setShowNewItem] = useState(false);

  // Determine if we're in video mode (with stricter constraints)
  const isVideoMode = selectedMediaType === "video";

  // Get the current active reference
  const activeReference = references.find(
    (ref) => ref.id === activeReferenceId
  );
  const referenceType = activeReference?.referenceType || ReferenceType.DEFAULT;

  // Calculate constraints for video mode
  const activeReferenceImageCount = activeReference?.images.length || 0;
  const canAddMoreImages = isVideoMode ? activeReferenceImageCount === 0 : true; // No limit for image mode

  // Reset showNewItem when a new reference image is added
  useEffect(() => {
    if (activeReference && activeReference.images.length > 0) {
      setShowNewItem(false);
    }
  }, [activeReference]);

  const handleReferenceTypeChange = (value: string) => {
    if (activeReferenceId) {
      updateReferenceType(activeReferenceId, value as ReferenceType);
    }
  };

  const handleAddImage = () => {
    if (isVideoMode && activeReferenceImageCount >= 1) {
      toast.error("Video mode only supports one reference image", {
        description: "Please remove existing image before adding a new one",
      });
      return;
    }
    setShowNewItem(true);
  };

  const handleCancel = () => {
    clearReferences();
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      // Count total images
      const totalImages = getTotalImageCount();

      if (totalImages === 0) {
        toast.error("No reference images added", {
          description: "Please add at least one image to continue",
        });
        return;
      }

      // For video mode, enforce one reference with one image
      if (isVideoMode) {
        const referencesWithImages = references.filter(
          (ref) => ref.images.length > 0
        );
        const totalImagesCount = referencesWithImages.reduce(
          (sum, ref) => sum + ref.images.length,
          0
        );

        if (referencesWithImages.length > 1 || totalImagesCount > 1) {
          toast.warning("Video mode constraints", {
            description:
              "Only the first image from the first reference will be used. Others will be ignored by the API.",
          });

          // Here you could potentially trim the references to just keep one reference with one image
          // But we'll show the warning and continue for now
        }
      }

      // Skip upload for now, just create the DTOs
      const referenceDataDtos = prepareReferenceDataDtos();

      // Save references to the persistent store
      saveReferences();

      // Log the reference data DTOs for now - in a real app you'd probably call an API with this data
      console.log("Reference data DTOs for API:", referenceDataDtos);

      // Format reference types for display
      const referenceTypes = references
        .filter((ref) => ref.images.length > 0)
        .map((ref) => {
          const typeName =
            ref.referenceType.charAt(0).toUpperCase() +
            ref.referenceType.slice(1);
          return `Reference #${ref.referenceId} (${typeName} - ${
            ref.images.length
          } image${ref.images.length !== 1 ? "s" : ""})`;
        })
        .join(", ");

      toast.success("References added successfully", {
        description: `Added: ${referenceTypes}`,
      });

      // Just close the sheet after saving
      setOpen(false);
    } catch (error) {
      toast.error("Error saving references", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="overflow-y-auto flex flex-col sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle>
            Add Reference {isVideoMode ? "(Video Mode)" : ""}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-4 flex-1 overflow-auto">
          <p className="text-sm text-muted-foreground leading-4">
            Create references with your own images of a product, person, animal,
            or style. {selectedMediaType === "video" ? "Veo" : "Imagen"} will
            preserve their appearance. You can also use references to make
            mask-free edits or influence your generated
            {isVideoMode ? " video" : " images"} through controlled editing.
          </p>

          {/* Video mode constraints alert */}
          {isVideoMode && (
            <Alert variant="default" className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">
                Video Mode Limitations
              </AlertTitle>
              <AlertDescription className="text-yellow-700">
                Video mode only supports one reference with one image. If you
                add multiple references or images, only the first reference with
                an image will be used for video generation. Other references or
                images will be ignored by the API.
              </AlertDescription>
            </Alert>
          )}

          {/* Reference Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="reference-type">Reference type</Label>
            <Select
              value={referenceType}
              onValueChange={handleReferenceTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reference type" />
              </SelectTrigger>
              <SelectContent>
                {referenceTypeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer hover:bg-muted focus:bg-muted"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reference Images Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Reference images</h3>

            {/* Reference Number Indicator */}
            {activeReference && (
              <div className="text-sm text-muted-foreground">
                Reference #{activeReference.referenceId}
                {isVideoMode &&
                  activeReferenceImageCount > 0 &&
                  " (Limit: 1 image)"}
              </div>
            )}

            {/* Reference Images List */}
            <div className="space-y-2">
              {activeReference?.images.map((image) => (
                <ReferenceImageItem
                  key={image.id}
                  referenceId={activeReference.id}
                  referenceImage={image}
                />
              ))}

              {/* Show new item form when Add button is clicked */}
              {showNewItem && activeReferenceId && (
                <ReferenceImageItem
                  isNew
                  key="new-item"
                  referenceId={activeReferenceId}
                />
              )}

              {/* Add New Reference Image Button */}
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 mt-4"
                onClick={handleAddImage}
                disabled={!activeReferenceId || !canAddMoreImages}
                title={
                  !canAddMoreImages
                    ? "Video mode only supports one image"
                    : "Add an image"
                }
              >
                <PlusCircle className="w-4 h-4" />
                Add an image
                {!canAddMoreImages && isVideoMode && " (Limit reached)"}
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <SheetFooter className="flex flex-row gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1"
            disabled={
              !references.some((ref) => ref.images.length > 0) || isUploading
            }
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Add reference"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
