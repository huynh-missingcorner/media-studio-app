export interface AudioCardProps {
  url: string;
}

export function AudioCard({ url }: AudioCardProps) {
  return (
    <audio controls src={url} className="w-full">
      <source src={url} type="audio/mpeg" />
    </audio>
  );
}
