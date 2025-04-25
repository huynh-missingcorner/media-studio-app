import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
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

export interface ImageSettingParams {
  model: string;
  aspectRatio: string;
  numberOfResults: number;
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

// AI model options
const modelOptions = [
  { value: "imagen-3.0-generate-002", label: "Imagen 3" },
  { value: "imagen-3.0-fast-generate-001", label: "Imagen 3 Fast" },
];

export function ImageSetting() {
  const { imageSettings, updateImageSettings } = useMediaStore();

  const handleModelChange = (value: string) => {
    updateImageSettings({ model: value });
  };

  const handleAspectRatioChange = (value: string) => {
    updateImageSettings({ aspectRatio: value });
  };

  const handleResultsChange = (value: number[]) => {
    updateImageSettings({ numberOfResults: value[0] });
  };

  const handleAllowPeopleChange = (checked: boolean) => {
    updateImageSettings({ allowPeopleAndFaces: checked });
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
              <Label htmlFor="model">Model</Label>
              <Select
                value={imageSettings.model}
                onValueChange={handleModelChange}
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
            </div>

            {/* Aspect Ratio Selection */}
            <div className="space-y-2">
              <Label>Aspect Ratio</Label>
              <RadioGroup
                value={imageSettings.aspectRatio}
                onValueChange={handleAspectRatioChange}
                className="grid grid-cols-5 gap-2"
              >
                {aspectRatioOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex flex-col items-center space-y-1"
                  >
                    <div className="relative">
                      <option.icon />
                      <RadioGroupItem
                        value={option.value}
                        id={`ratio-${option.value}`}
                        className="sr-only"
                      />
                      <label
                        htmlFor={`ratio-${option.value}`}
                        className={cn(
                          "absolute inset-0 rounded-md cursor-pointer border-2 border-transparent",
                          imageSettings.aspectRatio === option.value &&
                            "border-primary"
                        )}
                      />
                    </div>
                    <span className="text-xs">{option.value}</span>
                  </div>
                ))}
              </RadioGroup>
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
                  value={[imageSettings.numberOfResults]}
                  onValueChange={handleResultsChange}
                />
                <div className="text-[14px] w-6 font-medium">
                  {imageSettings.numberOfResults}
                </div>
              </div>
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
