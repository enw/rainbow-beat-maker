"use client";
import { useState, useCallback, useEffect, useRef } from "react";

type Pad = {
  id: number;
  name: string;
  key: string;
  color: string;
  soundUrl: string;
};

const initialPads: Pad[] = [
  {
    id: 1,
    name: "Kick",
    key: "1",
    color: "bg-red-500 hover:bg-red-600",
    soundUrl: "/drums/kick.mp3",
  },
  {
    id: 2,
    name: "Snare",
    key: "2",
    color: "bg-blue-500 hover:bg-blue-600",
    soundUrl: "/drums/snare.mp3",
  },
  {
    id: 3,
    name: "Clap",
    key: "3",
    color: "bg-green-500 hover:bg-green-600",
    soundUrl: "/drums/clap.mp3",
  },
  {
    id: 4,
    name: "HiHat",
    key: "4",
    color: "bg-yellow-500 hover:bg-yellow-600",
    soundUrl: "/drums/hihat.mp3",
  },
  {
    id: 5,
    name: "Tom 1",
    key: "Q",
    color: "bg-purple-500 hover:bg-purple-600",
    soundUrl: "/drums/tom1.mp3",
  },
  {
    id: 6,
    name: "Tom 2",
    key: "W",
    color: "bg-pink-500 hover:bg-pink-600",
    soundUrl: "/drums/tom2.mp3",
  },
  {
    id: 7,
    name: "Cymbal",
    key: "E",
    color: "bg-indigo-500 hover:bg-indigo-600",
    soundUrl: "/drums/cymbal.mp3",
  },
  {
    id: 8,
    name: "Perc",
    key: "R",
    color: "bg-orange-500 hover:bg-orange-600",
    soundUrl: "/drums/perc.mp3",
  },
  {
    id: 9,
    name: "Kick 2",
    key: "A",
    color: "bg-red-700 hover:bg-red-800",
    soundUrl: "/drums/kick2.mp3",
  },
  {
    id: 10,
    name: "Snare 2",
    key: "S",
    color: "bg-blue-700 hover:bg-blue-800",
    soundUrl: "/drums/snare2.mp3",
  },
  {
    id: 11,
    name: "Clap 2",
    key: "D",
    color: "bg-green-700 hover:bg-green-800",
    soundUrl: "/drums/clap2.mp3",
  },
  {
    id: 12,
    name: "HiHat 2",
    key: "F",
    color: "bg-yellow-700 hover:bg-yellow-800",
    soundUrl: "/drums/hihat2.mp3",
  },
  {
    id: 13,
    name: "Tom 3",
    key: "Z",
    color: "bg-purple-700 hover:bg-purple-800",
    soundUrl: "/drums/tom3.mp3",
  },
  {
    id: 14,
    name: "Tom 4",
    key: "X",
    color: "bg-pink-700 hover:bg-pink-800",
    soundUrl: "/drums/tom4.mp3",
  },
  {
    id: 15,
    name: "Cymbal 2",
    key: "C",
    color: "bg-indigo-700 hover:bg-indigo-800",
    soundUrl: "/drums/cymbal2.mp3",
  },
  {
    id: 16,
    name: "Perc 2",
    key: "V",
    color: "bg-orange-700 hover:bg-orange-800",
    soundUrl: "/drums/perc2.mp3",
  },
];

const keyToPadMap = new Map(
  initialPads.map((pad) => [pad.key.toLowerCase(), pad.id])
);

export default function MPC() {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePads, setActivePads] = useState<Set<number>>(new Set());
  const [samples, setSamples] = useState<Map<number, AudioBuffer>>(new Map());
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context and load samples
  useEffect(() => {
    const initAudio = async () => {
      // Create audio context on first user interaction
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const loadSample = async (pad: Pad) => {
        try {
          const response = await fetch(pad.soundUrl);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioContextRef.current!.decodeAudioData(
            arrayBuffer
          );
          setSamples((prev) => new Map(prev).set(pad.id, audioBuffer));
        } catch (error) {
          console.error(`Error loading sample for pad ${pad.id}:`, error);
        }
      };

      // Load all samples
      await Promise.all(initialPads.map(loadSample));
    };

    initAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playSound = useCallback(
    (padId: number) => {
      if (audioContextRef.current && samples.has(padId)) {
        const source = audioContextRef.current.createBufferSource();
        source.buffer = samples.get(padId)!;
        source.connect(audioContextRef.current.destination);
        source.start();
      }
    },
    [samples]
  );

  const handlePadPress = useCallback(
    (padId: number) => {
      playSound(padId);
      setActivePads((prev) => new Set([...prev, padId]));
      setTimeout(() => {
        setActivePads((prev) => {
          const newSet = new Set(prev);
          newSet.delete(padId);
          return newSet;
        });
      }, 100);
    },
    [playSound]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const padId = keyToPadMap.get(event.key.toLowerCase());
      if (padId) {
        setActivePads((prev) => new Set([...prev, padId]));
        handlePadPress(padId);
      }
    },
    [handlePadPress]
  );

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const padId = keyToPadMap.get(event.key.toLowerCase());
    if (padId) {
      setActivePads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(padId);
        return newSet;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

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
                onChange={(e) =>
                  setBpm(Math.max(40, Math.min(240, Number(e.target.value))))
                }
                className="w-20 px-2 py-1 rounded bg-gray-800 text-white"
              />
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded ${
                isPlaying
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              {isPlaying ? "Stop" : "Play"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {initialPads.map((pad) => (
            <button
              key={pad.id}
              onMouseDown={() => handlePadPress(pad.id)}
              className={`${
                pad.color
              } p-6 rounded-lg aspect-square flex items-center justify-center text-xl font-bold text-white transition-transform ${
                activePads.has(pad.id) ? "scale-90" : "scale-100"
              }`}
            >
              {pad.key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
