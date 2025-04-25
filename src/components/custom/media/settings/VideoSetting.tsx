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

export interface VideoSettingParams {
  model: string;
  aspectRatio: string;
  numberOfResults: number;
  durationSeconds: string;
  enhancePrompt: boolean;
  seed: number;
  personGeneration: string;
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

const modelOptions = [{ value: "veo-2.0-generate-001", label: "Veo 2" }];

export function VideoSetting() {
  const { videoSettings, updateVideoSettings } = useMediaStore();

  const handleModelChange = (value: string) => {
    updateVideoSettings({ model: value });
  };

  const handleAspectRatioChange = (value: string) => {
    updateVideoSettings({ aspectRatio: value });
  };

  const handleResultsChange = (value: number[]) => {
    updateVideoSettings({ numberOfResults: value[0] });
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
              <Label htmlFor="model">Model</Label>
              <Select
                value={videoSettings.model}
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
                  value={[videoSettings.numberOfResults]}
                  onValueChange={handleResultsChange}
                />
                <div className="text-[14px] w-6 font-medium">
                  {videoSettings.numberOfResults}
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
