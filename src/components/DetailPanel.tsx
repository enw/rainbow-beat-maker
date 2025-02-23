import React from "react";

type DetailPanelProps = {
  songName: string;
  setSongName: (name: string) => void;
  songwriterName: string;
  setSongwriterName: (name: string) => void;
  songNotes: string;
  setSongNotes: (notes: string) => void;
};

export function DetailPanel({
  songName,
  setSongName,
  songwriterName,
  setSongwriterName,
  songNotes,
  setSongNotes,
}: DetailPanelProps) {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-white mb-6">Song Details</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-400 text-sm mb-1">Song Name</label>
          <input
            type="text"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Enter song name..."
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Songwriter</label>
          <input
            type="text"
            value={songwriterName}
            onChange={(e) => setSongwriterName(e.target.value)}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Enter songwriter name..."
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Notes</label>
          <textarea
            value={songNotes}
            onChange={(e) => setSongNotes(e.target.value)}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none h-48 resize-none"
            placeholder="Add notes about your song..."
          />
        </div>
      </div>
    </div>
  );
}
