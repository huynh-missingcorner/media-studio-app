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
import { Input } from "@/components/ui/input";

export interface MusicSettingParams {
  model: string;
  seed: number;
}

// AI model options
const modelOptions = [{ value: "lyria-base-001", label: "Lyria" }];

export function MusicSetting() {
  const { musicSettings, updateMusicSettings } = useMediaStore();

  const handleModelChange = (value: string) => {
    updateMusicSettings({ model: value });
  };

  const handleSeedChange = (value: number) => {
    updateMusicSettings({ seed: value });
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
                value={musicSettings.model}
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
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="advanced" className="px-2 pb-4">
          <AccordionTrigger className="text-md font-medium">
            Advanced Options
          </AccordionTrigger>
          <AccordionContent className="space-y-6">
            {/* Seed */}
            <div className="space-y-2">
              <Label htmlFor="seed">Seed</Label>
              <Input
                id="seed"
                type="number"
                value={musicSettings.seed}
                onChange={(e) => handleSeedChange(Number(e.target.value))}
              />
              <p className="text-[12px] text-gray-500 px-4 leading-[16px]">
                Randomizes music generation. Same outcome with the same seed and
                inputs.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
