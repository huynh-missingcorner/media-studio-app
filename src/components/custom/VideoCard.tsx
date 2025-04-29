export interface VideoCardProps {
  url: string;
}

export function VideoCard({ url }: VideoCardProps) {
  return (
    <video controls src={url} className="w-full">
      <source src={url} type="video/mp4" />
    </video>
  );
}
