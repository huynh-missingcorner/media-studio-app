import { DashboardLayout } from "@/components/custom/layout/DashboardLayout";
import { MediaTypeNavbar } from "@/components/custom/media/MediaTypeNavbar";
import { PromptInput } from "@/components/custom/media/PromptInput";
import { MediaPreview } from "@/components/custom/media/MediaPreview";
import { useMediaStore } from "@/stores/mediaStore";

export function MediaGenerationPage() {
  const { mediaResponse, selectedMediaType, isGenerating } = useMediaStore();

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-65px)]">
        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto p-4">
          {mediaResponse === null && !isGenerating ? (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-md text-center">
                <h3 className="text-xl font-medium mb-2">
                  Generate {selectedMediaType} with AI
                </h3>
                <p className="text-muted-foreground">
                  Enter a prompt below to generate {selectedMediaType} using AI.
                  You can customize settings using the gear icon.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <MediaPreview />
            </div>
          )}
        </div>

        {/* Prompt input area */}
        <PromptInput />

        {/* Floating media type navbar */}
        <MediaTypeNavbar />
      </div>
    </DashboardLayout>
  );
}
