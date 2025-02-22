"use client";

type ComponentSection = "pads" | "timeline" | "config" | "header" | null;

type FooterProps = {
  hoveredElement: string;
  hoveredSection: ComponentSection;
};

const sectionDescriptions: Record<NonNullable<ComponentSection>, string> = {
  pads: "16 velocity-sensitive drum pads with keyboard shortcuts. Click or use keyboard to play sounds.",
  timeline: "Visual pattern editor showing recorded hits. Drag divider to resize.",
  config: "Configuration panel for BPM, quantization, and playback settings.",
  header: "Transport controls for recording, playback and pattern management.",
};

export function Footer({ hoveredElement, hoveredSection }: FooterProps) {
  return (
    <div className="bg-gray-800 border-t border-gray-700 p-2 flex items-center justify-between w-full">
      <div className="text-gray-400 text-sm">
        {hoveredSection ? (
          <>
            <span className="font-bold">{hoveredSection.toUpperCase()}</span>
            <span className="mx-2">•</span>
            <span>{sectionDescriptions[hoveredSection]}</span>
          </>
        ) : (
          "Hover over elements to see more information"
        )}
      </div>
      <div className="text-gray-500 text-sm">{hoveredElement}</div>
    </div>
  );
}
