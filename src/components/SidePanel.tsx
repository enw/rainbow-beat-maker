import React, { useState } from "react";
import { ConfigPanel } from "./ConfigPanel";
import { DetailPanel } from "./DetailPanel";

type SidePanelProps = {
  // Config panel props
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
  quantization: { value: number; label: string; triplet: boolean };
  setQuantization: (q: {
    value: number;
    label: string;
    triplet: boolean;
  }) => void;
  showShortcuts: boolean;
  setShowShortcuts: (show: boolean) => void;
  flashHeader: boolean;
  setFlashHeader: (flash: boolean) => void;

  // Detail panel props
  songName: string;
  setSongName: (name: string) => void;
  songwriterName: string;
  setSongwriterName: (name: string) => void;
  songNotes: string;
  setSongNotes: (notes: string) => void;
};

type PanelType = "config" | "details";

export function SidePanel(props: SidePanelProps) {
  const [activePanel, setActivePanel] = useState<PanelType>("config");

  return (
    <div className="flex flex-col h-full">
      {/* Panel Selector */}
      <div className="flex border-b border-gray-700">
        <button
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activePanel === "config"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActivePanel("config")}
        >
          Configuration
        </button>
        <button
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activePanel === "details"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActivePanel("details")}
        >
          Song Details
        </button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto">
        {activePanel === "config" ? (
          <ConfigPanel
            bpm={props.bpm}
            setBpm={props.setBpm}
            isMetronomeOn={props.isMetronomeOn}
            setIsMetronomeOn={props.setIsMetronomeOn}
            useCountIn={props.useCountIn}
            setUseCountIn={props.setUseCountIn}
            isLooping={props.isLooping}
            setIsLooping={props.setIsLooping}
            measures={props.measures}
            setMeasures={props.setMeasures}
            quantization={props.quantization}
            setQuantization={props.setQuantization}
            showShortcuts={props.showShortcuts}
            setShowShortcuts={props.setShowShortcuts}
            flashHeader={props.flashHeader}
            setFlashHeader={props.setFlashHeader}
          />
        ) : (
          <DetailPanel
            songName={props.songName}
            setSongName={props.setSongName}
            songwriterName={props.songwriterName}
            setSongwriterName={props.setSongwriterName}
            songNotes={props.songNotes}
            setSongNotes={props.setSongNotes}
          />
        )}
      </div>
    </div>
  );
}
