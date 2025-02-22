"use client";

import { Pad } from "../types";

type PadsProps = {
  pads: Pad[];
  activePads: Set<number>;
  failedSamples: Set<number>;
  showShortcuts: boolean;
  onPadPress: (padId: number) => void;
  onHover?: (description: string) => void;
};

export function Pads({
  pads,
  activePads,
  failedSamples,
  showShortcuts,
  onPadPress,
  onHover,
}: PadsProps) {
  return (
    <div 
      className="flex-grow bg-gray-900 overflow-auto flex items-center justify-center"
      onMouseEnter={() => onHover?.("pads")}
    >
      <div className="p-4" style={{ width: "min(100%, 600px)" }}>
        <div className="grid grid-cols-4 gap-4">
          {pads.map((pad) => (
            <div 
              key={pad.id} 
              className="aspect-square"
              onMouseEnter={() => onHover?.(`${pad.name} (${pad.key})`)}
            >
              <button
                onMouseDown={() => onPadPress(pad.id)}
                className={`${
                  pad.color
                } rounded-lg w-full h-full flex flex-col items-center justify-center text-white transition-transform ${
                  activePads.has(pad.id) ? "scale-90" : "scale-100"
                }`}
              >
                <span className="text-lg font-bold">
                  {pad.name}
                  {failedSamples.has(pad.id) && " ★"}
                </span>
                {showShortcuts && (
                  <span className="text-sm opacity-80 mt-1">({pad.key})</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 