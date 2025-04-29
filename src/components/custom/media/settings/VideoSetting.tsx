import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMediaStore } from "@/stores/mediaStore";
import {
  AspectRatioNineToSixteen,
  AspectRatioSixteenToNine,
} from "../../icons/aspect-ratio-nine-to-sixteen";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Info, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useAddReferenceSheetStore,
  ReferencesChangeCallback,
} from "@/stores/addReferenceSheetStore";
import { useEffect } from "react";

export interface VideoSettingParams {
  model: string;
  aspectRatio: string;
  sampleCount: number;
  durationSeconds: string;
  enhancePrompt: boolean;
  seed: number;
  personGeneration: string;
  negativePrompt?: string;
}

const aspectRatioOptions = [
  {
    value: "9:16",
    icon: AspectRatioNineToSixteen,
    label: "Portrait (9:16)",
  },
  { value: "16:9", icon: AspectRatioSixteenToNine, label: "Landscape (16:9)" },
];

const durationOptions = [
  { value: "5", label: "5 seconds" },
  { value: "6", label: "6 seconds" },
  { value: "7", label: "7 seconds" },
  { value: "8", label: "8 seconds" },
];

const personGenerationOptions = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

// Define models based on mode
const CREATE_MODE_MODELS = [{ value: "veo-2.0-generate-001", label: "Veo 2" }];
const EDIT_MODE_MODELS = [{ value: "veo-2.0-generate-001", label: "Veo 2" }];

export function VideoSetting() {
  const { videoSettings, updateVideoSettings } = useMediaStore();
  const {
    openSheet,
    savedReferences,
    clearSavedReferences,
    addReferencesChangeListener,
  } = useAddReferenceSheetStore();

  // Determine if we have references and should use edit mode
  // For video, we only allow one reference with one image
  const hasReferences = savedReferences.length > 0;
  const hasMultipleReferences = savedReferences.length > 1;
  const hasTooManyImages = savedReferences.some((ref) => ref.images.length > 1);
  const totalImages = savedReferences.reduce(
    (sum, ref) => sum + ref.images.length,
    0
  );
  const totalReferencesWithImages = savedReferences.filter(
    (ref) => ref.images.length > 0
  ).length;

  // Get the appropriate model options based on mode
  const modelOptions = hasReferences ? EDIT_MODE_MODELS : CREATE_MODE_MODELS;

  // Set up a references change listener
  useEffect(() => {
    // Define our callback to handle reference changes
    const handleReferencesChange: ReferencesChangeCallback = (references) => {
      const hasRefs = references.length > 0;
      const totalImgs = references.reduce(
        (sum, ref) => sum + ref.images.length,
        0
      );

      // Show warning if there are too many references or images
      if (references.length > 1 || totalImgs > 1) {
        // We'll handle warnings in the UI, but don't prevent setting the model
        console.warn("Video mode only supports one reference with one image");
      }

      if (hasRefs) {
        // Edit mode - use reference editor model
        const editModel = EDIT_MODE_MODELS[0].value;
        if (videoSettings.model !== editModel) {
          updateVideoSettings({ model: editModel });
        }
      } else {
        // Create mode - if current model is edit model, reset to default create model
        if (videoSettings.model === EDIT_MODE_MODELS[0].value) {
          updateVideoSettings({ model: CREATE_MODE_MODELS[0].value });
        }
      }
    };

    // Add the listener and get the unsubscribe function
    const unsubscribe = addReferencesChangeListener(handleReferencesChange);

    // Call once initially to set the right state
    handleReferencesChange(savedReferences);

    // Clean up when component unmounts
    return unsubscribe;
  }, [
    addReferencesChangeListener,
    videoSettings.model,
    savedReferences,
    updateVideoSettings,
  ]);

  const handleModelChange = (value: string) => {
    updateVideoSettings({ model: value });
  };

  const handleAspectRatioChange = (value: string) => {
    updateVideoSettings({ aspectRatio: value });
  };

  const handleResultsChange = (value: number[]) => {
    updateVideoSettings({ sampleCount: value[0] });
  };

  const handleDurationSecondsChange = (value: string) => {
    updateVideoSettings({ durationSeconds: value });
  };

  const handleEnhancePromptChange = (value: boolean) => {
    updateVideoSettings({ enhancePrompt: value });
  };

  const handleSeedChange = (value: number) => {
    updateVideoSettings({ seed: value });
  };

  const handlePersonGenerationChange = (value: string) => {
    updateVideoSettings({ personGeneration: value });
  };

  const handleNegativePromptChange = (value: string) => {
    updateVideoSettings({ negativePrompt: value });
  };

  const handleClearReferences = () => {
    clearSavedReferences();
  };

  return (
    <div className="w-full space-y-4">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["settings", "advanced", "safety"]}
      >
        <AccordionItem value="settings" className="px-2 pb-4">
          <AccordionContent className="space-y-6">
            {/* Model Selection */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="model">Model</Label>
                {hasReferences && (
                  <div className="text-xs text-blue-500 font-medium">
                    Reference Edit Mode
                  </div>
                )}
              </div>
              <Select
                value={videoSettings.model}
                onValueChange={handleModelChange}
                disabled={hasReferences} // Disable selection when in edit mode
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasReferences && (
                <p className="text-xs text-muted-foreground mt-1">
                  Using Reference Editor model for editing references
                </p>
              )}
              {(hasMultipleReferences || hasTooManyImages) && (
                <p className="text-xs text-yellow-600 mt-1">
                  Warning: Video mode only supports one reference with one
                  image.
                  {totalImages > 1
                    ? ` Currently using ${totalImages} images across ${totalReferencesWithImages} references.`
                    : ""}
                  {hasMultipleReferences
                    ? ` Only the first reference with an image will be used.`
                    : ""}
                </p>
              )}
            </div>

            {/* Aspect Ratio Selection */}
            <div className="space-y-2">
              <Label>Aspect Ratio</Label>
              <div className="grid grid-cols-3 gap-2">
                {aspectRatioOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = videoSettings.aspectRatio === option.value;
                  return (
                    <Button
                      key={option.value}
                      variant={isSelected ? "default" : "outline"}
                      className="h-auto py-2 px-2 flex flex-col items-center gap-1"
                      onClick={() => handleAspectRatioChange(option.value)}
                    >
                      <Icon
                        strokeColor={isSelected ? "white" : "currentColor"}
                      />
                      <span className="text-xs">{option.value}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Number of Results */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label htmlFor="results">Number of results</Label>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground gap-4">
                <Slider
                  id="results"
                  min={1}
                  max={4}
                  step={1}
                  value={[videoSettings.sampleCount]}
                  onValueChange={handleResultsChange}
                />
                <div className="text-[14px] w-6 font-medium">
                  {videoSettings.sampleCount}
                </div>
              </div>
            </div>

            {/* Video Length Selection */}
            <div className="space-y-2">
              <Label htmlFor="videoLength">Video Length</Label>
              <Select
                value={videoSettings.durationSeconds}
                onValueChange={handleDurationSecondsChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select video length" />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Allow People and Faces */}
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Switch
                  id="allow-people"
                  checked={videoSettings.enhancePrompt}
                  onCheckedChange={handleEnhancePromptChange}
                />
                <Label
                  htmlFor="allow-people"
                  className="text-[14px] font-medium translate-y-0.5"
                >
                  Enable prompt enhancement
                </Label>
              </div>
              <p className="text-[12px] text-muted-foreground">
                Use an LLM-based prompt rewriting feature to deliver higher
                quality videos that better reflect the original prompt's intent.
                Disabling this feature may impact video quality and prompt
                adherence.
              </p>
            </div>

            {/* Negative Prompt */}
            <div className="space-y-2">
              <Label
                htmlFor="negative-prompt"
                className="flex items-center gap-1"
              >
                Negative Prompt
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0} className="ml-1 cursor-pointer">
                        <Info size={16} className="text-muted-foreground" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      A negative prompt tells the AI what to avoid in the
                      generated media.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Textarea
                id="negative-prompt"
                value={videoSettings.negativePrompt}
                onChange={(e) => handleNegativePromptChange(e.target.value)}
              />
            </div>

            {/* Reference buttons */}
            <div className="flex flex-col gap-2">
              {hasReferences ? (
                <>
                  <Button onClick={openSheet}>
                    + Add reference{" "}
                    {hasMultipleReferences || hasTooManyImages
                      ? "(limit exceeded)"
                      : ""}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClearReferences}
                    className="flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Clear reference
                  </Button>
                </>
              ) : (
                <Button className="w-full" onClick={openSheet}>
                  + Add reference
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="safety">
          <AccordionTrigger className="text-md font-medium">
            Safety
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            {/* Person Generation */}
            <div className="space-y-2">
              <Label htmlFor="seed">Person Generation</Label>
              <Select
                value={videoSettings.personGeneration}
                onValueChange={handlePersonGenerationChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select person generation" />
                </SelectTrigger>
                <SelectContent>
                  {personGenerationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="advanced">
          <AccordionTrigger className="text-md font-medium">
            Advanced Options
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            {/* Seed */}
            <div className="space-y-2">
              <Label htmlFor="seed">Seed</Label>
              <Input
                id="seed"
                type="number"
                value={videoSettings.seed}
                onChange={(e) => handleSeedChange(Number(e.target.value))}
              />
              <p className="text-[12px] text-gray-500 px-4 leading-[16px]">
                Randomizes video generation. Same outcome with the same seed and
                inputs.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
