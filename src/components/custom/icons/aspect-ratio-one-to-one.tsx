interface AspectRatioIconProps {
  strokeColor?: string;
  className?: string;
}

export function AspectRatioOneToOne({
  strokeColor = "currentColor",
  className,
}: AspectRatioIconProps) {
  return (
    <svg
      data-icon-name="aspectRatioOneToOne"
      width="24"
      height="24"
      viewBox="0 -960 960 960"
      aria-hidden="true"
      className={className}
      fill={strokeColor}
    >
      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200zm0-80h560v-560H200v560zm0 0v-560 560z"></path>
    </svg>
  );
}
