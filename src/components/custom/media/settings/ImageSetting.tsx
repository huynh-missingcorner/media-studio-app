import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  AspectRatioOneToOne,
  AspectRatioFourToThree,
  AspectRatioNineToSixteen,
  AspectRatioSixteenToNine,
  AspectRatioThreeToFour,
} from "@/components/custom/icons";
import { useMediaStore } from "@/stores/mediaStore";
import {
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
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

export interface ImageSettingParams {
  model: string;
  aspectRatio: string;
  sampleCount: number;
  negativePrompt?: string;
  allowPeopleAndFaces: boolean;
}

// Aspect ratio options
const aspectRatioOptions = [
  { value: "1:1", icon: AspectRatioOneToOne, label: "Square (1:1)" },
  {
    value: "9:16",
    icon: AspectRatioNineToSixteen,
    label: "Portrait (9:16)",
  },
  { value: "16:9", icon: AspectRatioSixteenToNine, label: "Landscape (16:9)" },
  { value: "3:4", icon: AspectRatioThreeToFour, label: "Portrait (3:4)" },
  { value: "4:3", icon: AspectRatioFourToThree, label: "Landscape (4:3)" },
];

// AI model options by mode
const CREATE_MODE_MODELS = [
  { value: "imagen-3.0-generate-002", label: "Imagen 3" },
  { value: "imagen-3.0-fast-generate-001", label: "Imagen 3 Fast" },
];

const EDIT_MODE_MODELS = [
  { value: "imagen-3.0-capability-001", label: "Imagen 3 Reference Editor" },
];

export function ImageSetting() {
  const { imageSettings, updateImageSettings } = useMediaStore();
  const {
    openSheet,
    savedReferences,
    clearSavedReferences,
    addReferencesChangeListener,
  } = useAddReferenceSheetStore();

  // Determine if we have references and should use edit mode
  const hasReferences = savedReferences.length > 0;

  // Get the appropriate model options based on mode
  const modelOptions = hasReferences ? EDIT_MODE_MODELS : CREATE_MODE_MODELS;

  // Set up a references change listener
  useEffect(() => {
    // Define our callback to handle reference changes
    const handleReferencesChange: ReferencesChangeCallback = (references) => {
      const hasRefs = references.length > 0;

      if (hasRefs) {
        // Edit mode - use reference editor model
        const editModel = EDIT_MODE_MODELS[0].value;
        if (imageSettings.model !== editModel) {
          updateImageSettings({ model: editModel });
        }
      } else {
        // Create mode - if current model is edit model, reset to default create model
        if (imageSettings.model === EDIT_MODE_MODELS[0].value) {
          updateImageSettings({ model: CREATE_MODE_MODELS[0].value });
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
    imageSettings.model,
    savedReferences,
    updateImageSettings,
  ]);

  const handleModelChange = (value: string) => {
    updateImageSettings({ model: value });
  };

  const handleAspectRatioChange = (value: string) => {
    updateImageSettings({ aspectRatio: value });
  };

  const handleResultsChange = (value: number[]) => {
    updateImageSettings({ sampleCount: value[0] });
  };

  const handleAllowPeopleChange = (checked: boolean) => {
    updateImageSettings({ allowPeopleAndFaces: checked });
  };

  const handleNegativePromptChange = (value: string) => {
    updateImageSettings({ negativePrompt: value });
  };

  const handleClearReferences = () => {
    clearSavedReferences();
  };

  return (
    <div className="w-full space-y-4">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["settings", "advanced"]}
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
                value={imageSettings.model}
                onValueChange={handleModelChange}
                disabled={hasReferences} // Disable selection when in edit mode
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((option) => (
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
              {hasReferences && (
                <p className="text-xs text-muted-foreground mt-1">
                  Using Reference Editor model for editing references
                </p>
              )}
            </div>

            {/* Aspect Ratio Selection */}
            <div className="space-y-2">
              <Label>Aspect Ratio</Label>
              <div className="grid grid-cols-3 gap-2">
                {aspectRatioOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = imageSettings.aspectRatio === option.value;
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
                  value={[imageSettings.sampleCount]}
                  onValueChange={handleResultsChange}
                />
                <div className="text-[14px] w-6 font-medium">
                  {imageSettings.sampleCount}
                </div>
              </div>
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
                value={imageSettings.negativePrompt}
                onChange={(e) => handleNegativePromptChange(e.target.value)}
              />
            </div>

            {/* Reference buttons */}
            <div className="flex flex-col gap-2">
              {hasReferences ? (
                <>
                  <Button onClick={openSheet}>
                    Edit references ({savedReferences.length})
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClearReferences}
                    className="flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Clear all references
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

        <AccordionItem value="advanced">
          <AccordionTrigger className="text-md font-medium">
            Advanced Options
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            {/* Allow People and Faces */}
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="allow-people"
                  className="w-5 h-5 translate-y-1"
                  checked={imageSettings.allowPeopleAndFaces}
                  onCheckedChange={handleAllowPeopleChange}
                />
                <div>
                  <Label htmlFor="allow-people" className="text-md font-medium">
                    Allow people and faces (excluding children)
                  </Label>
                  <p className="text-[12px] text-muted-foreground">
                    If off, images with people and faces may be blocked
                  </p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
