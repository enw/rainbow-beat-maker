import React from "react";
import { Pattern } from "./types";

type HeaderProps = {
  currentPattern: Pattern | null;
  isPlaying: boolean;
  isRecording: boolean;
  onPlay: () => void;
  onRecord: () => void;
  onStop: () => void;
  onStopRecording: () => void;
  onClear: () => void;
  headerColor: string;
  beatCount: number;
};

export function Header({
  currentPattern,
  isPlaying,
  isRecording,
  onPlay,
  onRecord,
  onStop,
  onStopRecording,
  onClear,
  headerColor,
  beatCount,
}: HeaderProps) {
  return (
    <div
      className="p-4 border-b border-gray-700 flex items-center justify-between"
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
        {beatCount}
      </h1>

      <div className="flex items-center gap-4">
        {!isRecording && !isPlaying && (
          <>
            <button
              onClick={onRecord}
              className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
            >
              <span className="text-xl">⏺</span>
              {currentPattern ? "Overdub" : "Record"}
            </button>
            {currentPattern && (
              <button
                onClick={onPlay}
                className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
              >
                <span className="text-xl">▶</span>
                Play
              </button>
            )}
          </>
        )}
        {isRecording && (
          <button
            onClick={onStopRecording}
            className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2"
          >
            <span className="text-xl">⏹</span>
            Stop Recording
          </button>
        )}
        {isPlaying && !isRecording && (
          <button
            onClick={onStop}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
          >
            <span className="text-xl">⏹</span>
            Stop
          </button>
        )}
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
