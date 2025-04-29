import { DashboardLayout } from "@/components/custom/layout/DashboardLayout";
import { MediaTypeNavbar } from "@/components/custom/media/chat/MediaTypeNavbar";
import { PromptInput } from "@/components/custom/media/chat/PromptInput";
import { MediaPreview } from "@/components/custom/media/chat/MediaPreview";
import { InfoSection } from "@/components/custom/media/chat/InfoSection";
import { useMediaStore } from "@/stores/mediaStore";
import { AddReferenceSheet } from "@/components/custom/media/settings/AddReferenceSheet";

export function MediaGenerationPage() {
  const { mediaResponse, isGenerating } = useMediaStore();

  const isNotGenerating = mediaResponse === null && !isGenerating;

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-65px)] relative">
        {/* Media preview area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex h-full items-center justify-center">
            {isNotGenerating ? <InfoSection /> : <MediaPreview />}
          </div>
        </div>

        {isGenerating && <GeneratingOverlay />}

        {/* Prompt input area */}
        <PromptInput />

        {/* Floating media type navbar */}
        <MediaTypeNavbar />

        <AddReferenceSheet />
      </div>
    </DashboardLayout>
  );
}

function GeneratingOverlay() {
  const { selectedMediaType } = useMediaStore();

  const generatingText = () => {
    switch (selectedMediaType) {
      case "image":
        return "Generating images. This may take several minutes.";
      case "audio":
        return "Generating audios. This may take several minutes.";
      case "music":
        return "Generating musics. This may take several minutes.";
      case "video":
        return "Generating videos. This may take several minutes.";
      default:
        return "Generating media. This may take several minutes.";
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center h-[calc(100vh-65px-132px)] w-full">
      <div className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg">
        {generatingText()}
      </div>
    </div>
  );
}
