"use client"
import { useState, useCallback } from 'react';

type Pad = {
  id: number;
  name: string;
  key: string;
  color: string;
};

const initialPads: Pad[] = [
  { id: 1, name: 'Kick', key: 'Q', color: 'bg-red-500 hover:bg-red-600' },
  { id: 2, name: 'Snare', key: 'W', color: 'bg-blue-500 hover:bg-blue-600' },
  { id: 3, name: 'Clap', key: 'E', color: 'bg-green-500 hover:bg-green-600' },
  { id: 4, name: 'HiHat', key: 'R', color: 'bg-yellow-500 hover:bg-yellow-600' },
  { id: 5, name: 'Tom 1', key: 'A', color: 'bg-purple-500 hover:bg-purple-600' },
  { id: 6, name: 'Tom 2', key: 'S', color: 'bg-pink-500 hover:bg-pink-600' },
  { id: 7, name: 'Cymbal', key: 'D', color: 'bg-indigo-500 hover:bg-indigo-600' },
  { id: 8, name: 'Perc', key: 'F', color: 'bg-orange-500 hover:bg-orange-600' },
  { id: 9, name: 'Kick 2', key: 'Z', color: 'bg-red-700 hover:bg-red-800' },
  { id: 10, name: 'Snare 2', key: 'X', color: 'bg-blue-700 hover:bg-blue-800' },
  { id: 11, name: 'Clap 2', key: 'C', color: 'bg-green-700 hover:bg-green-800' },
  { id: 12, name: 'HiHat 2', key: 'V', color: 'bg-yellow-700 hover:bg-yellow-800' },
  { id: 13, name: 'Tom 3', key: 'B', color: 'bg-purple-700 hover:bg-purple-800' },
  { id: 14, name: 'Tom 4', key: 'N', color: 'bg-pink-700 hover:bg-pink-800' },
  { id: 15, name: 'Cymbal 2', key: 'M', color: 'bg-indigo-700 hover:bg-indigo-800' },
  { id: 16, name: 'Perc 2', key: ',', color: 'bg-orange-700 hover:bg-orange-800' },
];

export default function MPC() {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePad, setActivePad] = useState<number | null>(null);

  const handlePadPress = useCallback((padId: number) => {
    setActivePad(padId);
    // Audio playback logic would go here
    setTimeout(() => setActivePad(null), 100);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">MPC Beats</h1>
          <div className="flex items-center gap-4">
            <div className="text-white">
              <label className="mr-2">BPM:</label>
              <input
                type="number"
                value={bpm}
                onChange={(e) => setBpm(Math.max(40, Math.min(240, Number(e.target.value))))}
                className="w-20 px-2 py-1 rounded bg-gray-800 text-white"
              />
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
            >
              {isPlaying ? 'Stop' : 'Play'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {initialPads.map((pad) => (
            <button
              key={pad.id}
              onMouseDown={() => handlePadPress(pad.id)}
              className={`${pad.color} p-6 rounded-lg aspect-square flex items-center justify-center text-xl font-bold text-white transition-transform ${activePad === pad.id ? 'scale-90' : 'scale-100'}`}
            >
              {pad.key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}