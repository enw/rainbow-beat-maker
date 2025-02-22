import React from "react";

type Quantization = {
  value: number;
  label: string;
  triplet: boolean;
};

type ConfigPanelProps = {
  bpm: number;
  setBpm: (bpm: number) => void;
  isMetronomeOn: boolean;
  setIsMetronomeOn: (on: boolean) => void;
  useCountIn: boolean;
  setUseCountIn: (on: boolean) => void;
  isLooping: boolean;
  setIsLooping: (on: boolean) => void;
  measures: number;
  setMeasures: (measures: number) => void;
  quantization: Quantization;
  setQuantization: (q: Quantization) => void;
  showShortcuts: boolean;
  setShowShortcuts: (show: boolean) => void;
  flashHeader: boolean;
  setFlashHeader: (flash: boolean) => void;
};

const quantizationOptions: Quantization[] = [
  { value: 4, label: "Whole Note", triplet: false },
  { value: 4, label: "Whole Note Triplet", triplet: true },
  { value: 2, label: "Half Note", triplet: false },
  { value: 2, label: "Half Note Triplet", triplet: true },
  { value: 1, label: "Quarter Note", triplet: false },
  { value: 1, label: "Quarter Note Triplet", triplet: true },
  { value: 0.5, label: "8th Note", triplet: false },
  { value: 0.5, label: "8th Note Triplet", triplet: true },
  { value: 0.25, label: "16th Note", triplet: false },
  { value: 0.25, label: "16th Note Triplet", triplet: true },
];

export function ConfigPanel({
  bpm,
  setBpm,
  isMetronomeOn,
  setIsMetronomeOn,
  useCountIn,
  setUseCountIn,
  isLooping,
  setIsLooping,
  measures,
  setMeasures,
  quantization,
  setQuantization,
  showShortcuts,
  setShowShortcuts,
  flashHeader,
  setFlashHeader,
}: ConfigPanelProps) {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 p-6 z-50">
      <h2 className="text-white text-xl font-bold mb-6">Configuration</h2>
      <div className="space-y-4 text-white">
        {/* UI Settings */}
        <div>
          <h3 className="text-lg font-semibold mb-2">UI Settings</h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showShortcuts}
              onChange={() => setShowShortcuts(!showShortcuts)}
              className="w-4 h-4"
            />
            Show Shortcuts
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={flashHeader}
              onChange={() => setFlashHeader(!flashHeader)}
              className="w-4 h-4"
            />
            Header Flashing
          </label>
        </div>

        {/* Music Settings */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Music Settings</h3>
          <div className="flex items-center gap-2">
            <label className="mr-2">BPM:</label>
            <input
              type="number"
              value={bpm}
              onChange={(e) =>
                setBpm(Math.max(40, Math.min(240, Number(e.target.value))))
              }
              className="w-20 px-2 py-1 rounded bg-gray-700 text-white"
            />
            {showShortcuts && (
              <span className="text-sm text-gray-400">(Ctrl+Shift+B)</span>
            )}
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isMetronomeOn}
              onChange={(e) => setIsMetronomeOn(e.target.checked)}
              className="w-4 h-4"
            />
            Metronome{" "}
            {showShortcuts && (
              <span className="text-sm text-gray-400">(Ctrl+Shift+M)</span>
            )}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useCountIn}
              onChange={(e) => setUseCountIn(e.target.checked)}
              className="w-4 h-4"
            />
            Count-in{" "}
            {showShortcuts && (
              <span className="text-sm text-gray-400">(Ctrl+Shift+C)</span>
            )}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isLooping}
              onChange={(e) => setIsLooping(e.target.checked)}
              className="w-4 h-4"
            />
            Loop{" "}
            {showShortcuts && (
              <span className="text-sm text-gray-400">(Ctrl+Shift+L)</span>
            )}
          </label>
          <div className="flex items-center gap-2">
            <label className="mr-2">Measures:</label>
            <input
              type="number"
              value={measures}
              onChange={(e) =>
                setMeasures(Math.max(1, Math.min(8, Number(e.target.value))))
              }
              className="w-20 px-2 py-1 rounded bg-gray-700 text-white"
            />
            {showShortcuts && (
              <span className="text-sm text-gray-400">(Ctrl+Shift+M)</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label>Quantization:</label>
            <select
              value={`${quantization.value}-${quantization.triplet}`}
              onChange={(e) => {
                const [value, triplet] = e.target.value.split("-");
                const newQuantization = quantizationOptions.find(
                  (q) =>
                    q.value === Number(value) &&
                    q.triplet === (triplet === "true")
                )!;
                setQuantization(newQuantization);
              }}
              className="w-full px-2 py-1 rounded bg-gray-700 text-white"
            >
              {quantizationOptions.map((q) => (
                <option
                  key={`${q.value}-${q.triplet}`}
                  value={`${q.value}-${q.triplet}`}
                >
                  {q.label}
                </option>
              ))}
            </select>
            {showShortcuts && (
              <span className="text-sm text-gray-400">(Ctrl+Shift+Q)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
