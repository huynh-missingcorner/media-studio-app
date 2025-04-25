interface AspectRatioIconProps {
  strokeColor?: string;
  className?: string;
}

export function AspectRatioSixteenToNine({
  strokeColor = "currentColor",
  className,
}: AspectRatioIconProps) {
  return (
    <svg
      data-icon-name="aspectRatio169Icon"
      width="24"
      height="24"
      viewBox="0 -960 960 960"
      aria-hidden="true"
      className={className}
      fill={strokeColor}
    >
      <path d="M200-280q-33 0-56.5-23.5T120-360v-240q0-33 23.5-56.5T200-680h560q33 0 56.5 23.5T840-600v240q0 33-23.5 56.5T760-280H200zm0-80h560v-240H200v240zm0 0v-240 240z"></path>
    </svg>
  );
}

export function AspectRatioNineToSixteen({
  strokeColor = "currentColor",
  className,
}: AspectRatioIconProps) {
  return (
    <div className={`rotate-90 ${className || ""}`}>
      <AspectRatioSixteenToNine strokeColor={strokeColor} />
    </div>
  );
}
