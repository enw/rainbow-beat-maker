import React from "react";

type ScrubberControlsProps = {
  currentPattern: Pattern | null;
  isPlaying: boolean;
  isRecording: boolean;
  onPlay: () => void;
  onPlayFromStart: () => void;
  onRecord: () => void;
  onRecordOverdub: () => void;
  onStop: () => void;
  currentBar: number;
  currentBeat: number;
  className?: string;
};

export function ScrubberControls({
  currentPattern,
  isPlaying,
  isRecording,
  onPlay,
  onPlayFromStart,
  onRecord,
  onRecordOverdub,
  onStop,
  currentBar,
  currentBeat,
  className = "",
}: ScrubberControlsProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Transport Controls */}
      <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
        {!isRecording && !isPlaying && (
          <>
            <button
              onClick={onRecord}
              className="p-2 rounded hover:bg-gray-600 text-red-500"
              title="Record New Pattern"
            >
              <span className="text-xl">⏺</span>
            </button>
            {currentPattern && (
              <button
                onClick={onRecordOverdub}
                className="p-2 rounded hover:bg-gray-600 text-orange-500"
                title="Record Overdub"
              >
                <span className="text-xl">⏺</span>
              </button>
            )}
          </>
        )}

        <button
          onClick={onStop}
          className={`p-2 rounded hover:bg-gray-600 ${
            isPlaying || isRecording ? "text-yellow-500" : "text-gray-400"
          }`}
          title="Stop"
          disabled={!isPlaying && !isRecording}
        >
          <span className="text-xl">⏹</span>
        </button>

        {currentPattern && !isRecording && (
          <>
            <button
              onClick={onPlay}
              className={`p-2 rounded hover:bg-gray-600 ${
                isPlaying ? "text-gray-400" : "text-green-500"
              }`}
              disabled={isPlaying}
              title="Play/Continue"
            >
              <span className="text-xl">▶</span>
            </button>
            <button
              onClick={onPlayFromStart}
              className={`p-2 rounded hover:bg-gray-600 ${
                isPlaying ? "text-gray-400" : "text-green-500"
              }`}
              disabled={isPlaying}
              title="Play from Start"
            >
              <span className="text-xl">⏮▶</span>
            </button>
          </>
        )}
      </div>

      {/* Bar/Beat Display */}
      <div className="flex items-center gap-4 text-white">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Bar:</span>
          <span className="font-mono bg-gray-700 px-2 py-1 rounded">
            {currentBar.toString().padStart(2, "0")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Beat:</span>
          <span className="font-mono bg-gray-700 px-2 py-1 rounded">
            {currentBeat.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
