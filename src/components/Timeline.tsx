"use client";

import { useEffect, useRef, useState } from "react";
import { Pattern, Pad } from "../types";

type TimelineProps = {
  pattern: Pattern | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  measures: number;
  bpm: number;
  height: number;
  onHeightChange: (height: number) => void;
  pads: Pad[];
  onHover?: (description: string) => void;
};

export function Timeline({
  pattern,
  isPlaying,
  currentTime,
  duration,
  measures,
  bpm,
  height,
  onHeightChange,
  pads,
  onHover,
}: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [trackHeights, setTrackHeights] = useState<number[]>([]);
  const [isResizing, setIsResizing] = useState(false);

  // Wait for mount before calculating layout
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate track heights on client-side only
  useEffect(() => {
    if (!mounted) return;
    const trackHeight = Math.floor((height - 24) / pads.length);
    setTrackHeights(pads.map((_, i) => Math.floor(trackHeight * i + 20)));
  }, [height, pads.length, mounted]);

  if (!mounted) {
    return <div style={{ height: `${height}px` }} />;
  }

  return (
    <div 
      className="mb-8"
      onMouseEnter={() => onHover?.("timeline")}
    >
      <div ref={timelineRef} className="bg-gray-800 rounded-lg p-4">
        <div
          className="relative bg-gray-700 rounded-t overflow-hidden"
          style={{ height: `${height}px` }}
        >
          {/* Tracks */}
          {pads.map((pad, i) => (
            <div
              key={pad.id}
              className="absolute w-full"
              style={{
                top: `${trackHeights[i] || 0}px`,
                height: `${Math.floor((height - 24) / pads.length - 1)}px`,
                backgroundColor: "rgba(0,0,0,0.2)",
              }}
              onMouseEnter={() => onHover?.(`Track: ${pad.name}`)}
            >
              <div className="absolute left-2 text-xs text-gray-400">
                {pad.name}
              </div>
              {/* Hits for this pad */}
              {pattern?.hits
                .filter((hit) => hit.padId === pad.id)
                .map((hit, index) => {
                  const position = (hit.timestamp / duration) * 100;
                  return (
                    <div
                      key={index}
                      className={`absolute h-full w-2 ${pad.color} opacity-75`}
                      style={{
                        left: `${position}%`,
                        transform: "translateX(-50%)",
                      }}
                    />
                  );
                })}
            </div>
          ))}

          {/* ... rest of timeline content ... */}
        </div>
      </div>
    </div>
  );
}
