import { useMediaStore } from "@/stores";

export function InfoSection() {
  const { selectedMediaType } = useMediaStore();

  // Determine the page title based on context
  const getPageTitle = () => {
    return `Generate ${selectedMediaType} with AI`;
  };

  // Determine the page description based on context
  const getPageDescription = () => {
    return `Enter a prompt below to generate ${selectedMediaType} using AI. You can customize settings using the gear icon.`;
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="max-w-md text-center">
        <h3 className="text-xl font-medium mb-2">{getPageTitle()}</h3>
        <p className="text-muted-foreground">{getPageDescription()}</p>
      </div>
    </div>
  );
}
