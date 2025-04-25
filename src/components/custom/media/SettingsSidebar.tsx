import { ImageSetting } from "./settings/ImageSetting";
import { AudioSetting } from "./settings/AudioSetting";
import { MusicSetting } from "./settings/MusicSetting";
import { VideoSetting } from "./settings/VideoSetting";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useMediaStore } from "@/stores/mediaStore";

interface SettingsSidebarProps {
  onClose: () => void;
}

export function SettingsSidebar({ onClose }: SettingsSidebarProps) {
  const { selectedMediaType } = useMediaStore();

  const renderFields = () => {
    switch (selectedMediaType) {
      case "image":
        return <ImageSetting />;
      case "audio":
        return <AudioSetting />;
      case "music":
        return <MusicSetting />;
      case "video":
        return <VideoSetting />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full p-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-md font-medium">Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="space-y-6 pt-6">{renderFields()}</div>
    </div>
  );
}
