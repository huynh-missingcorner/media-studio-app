export function AspectRatioFourToThree() {
  return (
    <svg
      data-icon-name="aspectRatio43Icon"
      width="24"
      height="24"
      viewBox="0 -960 960 960"
      aria-hidden="true"
    >
      <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160zm0-80h640v-480H160v480zm0 0v-480 480z"></path>
    </svg>
  );
}

export function AspectRatioThreeToFour() {
  return (
    <div className="rotate-90">
      <AspectRatioFourToThree />
    </div>
  );
}
