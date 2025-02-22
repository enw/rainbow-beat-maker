import { Pattern } from "../types";

type HeaderProps = {
  currentPattern: Pattern | null;
  isPlaying: boolean;
  isRecording: boolean;
  onPlay: () => void;
  onRecord: () => void;
  onStop: () => void;
  onStopRecording: () => void;
  onClear: () => void;
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
}: HeaderProps) {
  return (
    <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-white">Rainbow Beat Maker</h1>

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
