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

export interface AudioSettingParams {
  voice: string;
  speed: number;
  volumeGain: number;
  audioEncoding: string;
  audioSampleRate: string;
  model: string;
  language: string;
}

const voiceOptions = [
  { value: "default", label: "Default" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "child", label: "Child" },
];

// AI model options
const modelOptions = [
  { value: "chirp-3-hd-voices", label: "Chirp 3: HD Voices" },
];

const languageOptions = [
  { value: "en-US", label: "English (United States)" },
  { value: "es-ES", label: "Spanish (Spain)" },
  { value: "fr-FR", label: "French (France)" },
];

const audioEncodingOptions = [
  { value: "mp3", label: "MP3" },
  { value: "linear16", label: "LINEAR16" },
  { value: "mulaw", label: "MULAW" },
];

const audioSampleRateOptions = [
  { value: "22050", label: "22050 kHz" },
  { value: "44100", label: "44100 kHz" },
];

export function AudioSetting() {
  const { audioSettings, updateAudioSettings } = useMediaStore();

  const handleModelChange = (value: string) => {
    updateAudioSettings({ model: value });
  };

  const handleLanguageChange = (value: string) => {
    updateAudioSettings({ language: value });
  };

  const handleVoiceChange = (value: string) => {
    updateAudioSettings({ voice: value });
  };

  const handleAudioEncodingChange = (value: string) => {
    updateAudioSettings({ audioEncoding: value });
  };

  const handleAudioSampleRateChange = (value: string) => {
    updateAudioSettings({ audioSampleRate: value });
  };

  const handleSpeedChange = (value: number[]) => {
    updateAudioSettings({ speed: value[0] });
  };

  const handleVolumeGainChange = (value: number[]) => {
    updateAudioSettings({ volumeGain: value[0] });
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
                value={audioSettings.model}
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

            {/* Language Selection */}
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={audioSettings.language}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Voice */}
            <div className="space-y-2">
              <Label htmlFor="voice">Voice</Label>
              <Select
                value={audioSettings.voice}
                onValueChange={handleVoiceChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  {voiceOptions.map((option) => (
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
            {/* Audio Encoding Selection */}
            <div className="space-y-2">
              <Label htmlFor="audioEncoding">Audio Encoding</Label>
              <Select
                value={audioSettings.audioEncoding}
                onValueChange={handleAudioEncodingChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select audio encoding" />
                </SelectTrigger>
                <SelectContent>
                  {audioEncodingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Audio Sample Rate Selection */}
            <div className="space-y-2">
              <Label htmlFor="audioSampleRate">Audio Sample Rate</Label>
              <Select
                value={audioSettings.audioSampleRate}
                onValueChange={handleAudioSampleRateChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select audio sample rate" />
                </SelectTrigger>
                <SelectContent>
                  {audioSampleRateOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Speed */}
            <div className="space-y-2">
              <Label htmlFor="speed">Speed</Label>
              <div className="flex justify-between text-xs text-muted-foreground gap-4">
                <Slider
                  id="speed"
                  min={0.25}
                  max={4}
                  step={0.25}
                  value={[audioSettings.speed]}
                  onValueChange={handleSpeedChange}
                />
                <div className="text-[14px] w-8 font-medium">
                  {audioSettings.speed}
                </div>
              </div>
            </div>

            {/* Volume Gain */}
            <div className="space-y-2">
              <Label htmlFor="volumeGain">Volume Gain (dB)</Label>
              <div className="flex justify-between text-xs text-muted-foreground gap-4">
                <Slider
                  id="volumeGain"
                  min={-96}
                  max={16}
                  step={1}
                  value={[audioSettings.volumeGain]}
                  onValueChange={handleVolumeGainChange}
                />
                <div className="text-[14px] w-8 font-medium">
                  {audioSettings.volumeGain}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
