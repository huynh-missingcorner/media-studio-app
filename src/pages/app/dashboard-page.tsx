import { DashboardLayout } from "@/components/custom/layout/DashboardLayout";
import { MediaTypeCard } from "@/components/custom/dashboard/MediaTypeCard";
import { useNavigate } from "react-router-dom";
import { useMediaStore } from "@/stores/mediaStore";
import { ImageIcon, VideoIcon, MusicIcon, AudioLines } from "lucide-react";
export type MediaType = "image" | "audio" | "music" | "video";

export function DashboardPage() {
  const { setSelectedMediaType } = useMediaStore();

  const navigate = useNavigate();

  const handleMediaTypeSelection = (mediaType: MediaType) => {
    setSelectedMediaType(mediaType);
    navigate(`/dashboard/generate`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto mt-12">
        <div className="bg-primary/5 rounded-xl p-8 mb-12 mt-[150px]">
          <h2 className="text-2xl font-medium mb-6 text-center">
            Start with a text prompt
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MediaTypeCard
              icon={<ImageIcon className="w-8 h-8" />}
              title="Image"
              description="Generate high-quality images"
              onClick={() => handleMediaTypeSelection("image")}
            />
            <MediaTypeCard
              icon={<AudioLines className="w-8 h-8" />}
              title="Audio"
              description="Create realistic audio clips"
              onClick={() => handleMediaTypeSelection("audio")}
            />
            <MediaTypeCard
              icon={<MusicIcon className="w-8 h-8" />}
              title="Music"
              description="Compose original music tracks"
              onClick={() => handleMediaTypeSelection("music")}
            />
            <MediaTypeCard
              icon={<VideoIcon className="w-8 h-8" />}
              title="Video"
              description="Generate stunning video content"
              onClick={() => handleMediaTypeSelection("video")}
            />
          </div>
        </div>

        {/* Future sections like recent projects, etc. can be added here */}
      </div>
    </DashboardLayout>
  );
}
