import React from "react";
import { Pattern } from "./types";
import { ScrubberControls } from "./ScrubberControls";

type HeaderProps = {
  currentPattern: Pattern | null;
  isPlaying: boolean;
  isRecording: boolean;
  onPlay: () => void;
  onPlayFromStart: () => void;
  onRecord: () => void;
  onStop: () => void;
  onStopRecording: () => void;
  onClear: () => void;
  headerColor: string;
  beatCount: number;
  currentBar: number;
  currentBeat: number;
  className?: string;
};

export function Header({
  currentPattern,
  isPlaying,
  isRecording,
  onPlay,
  onPlayFromStart,
  onRecord,
  onStop,
  onStopRecording,
  onClear,
  headerColor,
  beatCount,
  currentBar,
  currentBeat,
  className = "",
}: HeaderProps) {
  return (
    <div
      className={`p-4 border-b border-gray-700 flex items-center justify-between bg-opacity-90 backdrop-blur-sm z-10 ${className}`}
      style={{ backgroundColor: headerColor }}
    >
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        Rainbow Beat Maker
        <span
          className={`w-4 h-4 rounded-full transition-transform duration-200 ${
            beatCount % 4 === 0
              ? "bg-red-500 scale-125"
              : "bg-blue-500 scale-100"
          }`}
        />
      </h1>

      <div className="flex items-center gap-4">
        <ScrubberControls
          currentPattern={currentPattern}
          isPlaying={isPlaying}
          isRecording={isRecording}
          onPlay={onPlay}
          onPlayFromStart={onPlayFromStart}
          onRecord={onRecord}
          onRecordOverdub={onRecord}
          onStop={isRecording ? onStopRecording : onStop}
          currentBar={currentBar}
          currentBeat={currentBeat}
        />

        {currentPattern && !isPlaying && !isRecording && (
          <button
            onClick={onClear}
            className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
