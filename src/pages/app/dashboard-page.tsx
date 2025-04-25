import { DashboardLayout } from "@/components/custom/layout/DashboardLayout";
import { MediaTypeCard } from "@/components/custom/dashboard/MediaTypeCard";
import {
  ImageIcon,
  AudioIcon,
  MusicIcon,
  VideoIcon,
} from "@/components/ui/icons";
import { useNavigate } from "react-router-dom";
import { useMediaStore } from "@/stores/mediaStore";
export type MediaType = "image" | "audio" | "music" | "video";

export function DashboardPage() {
  const { selectedMediaType, setSelectedMediaType } = useMediaStore();

  const navigate = useNavigate();

  const handleMediaTypeSelection = (mediaType: MediaType) => {
    setSelectedMediaType(mediaType);
    navigate(`/dashboard/generate`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto mt-12">
        <h1 className="text-4xl font-bold text-center mb-2">Media Studio</h1>
        <p className="text-xl text-center text-muted-foreground mb-12">
          Create stunning media with AI
        </p>

        <div className="bg-blue-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Start with a text prompt
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MediaTypeCard
              icon={<ImageIcon className="w-8 h-8" />}
              title="Image"
              description="Generate high-quality images"
              onClick={() => handleMediaTypeSelection("image")}
              isSelected={selectedMediaType === "image"}
            />
            <MediaTypeCard
              icon={<AudioIcon className="w-8 h-8" />}
              title="Audio"
              description="Create realistic audio clips"
              onClick={() => handleMediaTypeSelection("audio")}
              isSelected={selectedMediaType === "audio"}
            />
            <MediaTypeCard
              icon={<MusicIcon className="w-8 h-8" />}
              title="Music"
              description="Compose original music tracks"
              onClick={() => handleMediaTypeSelection("music")}
              isSelected={selectedMediaType === "music"}
            />
            <MediaTypeCard
              icon={<VideoIcon className="w-8 h-8" />}
              title="Video"
              description="Generate stunning video content"
              onClick={() => handleMediaTypeSelection("video")}
              isSelected={selectedMediaType === "video"}
            />
          </div>
        </div>

        {/* Future sections like recent projects, etc. can be added here */}
      </div>
    </DashboardLayout>
  );
}
