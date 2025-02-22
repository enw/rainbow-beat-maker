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
    soundUrl: "/samples/kick.wav",
  },
  {
    id: 2,
    name: "Snare",
    key: "2",
    color: "bg-orange-500 hover:bg-orange-600",
    soundUrl: "/samples/snare.wav",
  },
  {
    id: 3,
    name: "Clap",
    key: "3",
    color: "bg-amber-500 hover:bg-amber-600",
    soundUrl: "/samples/clap.wav",
  },
  {
    id: 4,
    name: "HiHat",
    key: "4",
    color: "bg-yellow-500 hover:bg-yellow-600",
    soundUrl: "/samples/hihat.wav",
  },
  {
    id: 5,
    name: "Tom 1",
    key: "Q",
    color: "bg-lime-500 hover:bg-lime-600",
    soundUrl: "/samples/tom1.wav",
  },
  {
    id: 6,
    name: "Tom 2",
    key: "W",
    color: "bg-green-500 hover:bg-green-600",
    soundUrl: "/samples/tom2.wav",
  },
  {
    id: 7,
    name: "Cymbal",
    key: "E",
    color: "bg-emerald-500 hover:bg-emerald-600",
    soundUrl: "/samples/cymbal.wav",
  },
  {
    id: 8,
    name: "Perc",
    key: "R",
    color: "bg-teal-500 hover:bg-teal-600",
    soundUrl: "/samples/perc.wav",
  },
  {
    id: 9,
    name: "Kick 2",
    key: "A",
    color: "bg-cyan-500 hover:bg-cyan-600",
    soundUrl: "/samples/kick2.wav",
  },
  {
    id: 10,
    name: "Snare 2",
    key: "S",
    color: "bg-sky-500 hover:bg-sky-600",
    soundUrl: "/samples/snare2.wav",
  },
  {
    id: 11,
    name: "Clap 2",
    key: "D",
    color: "bg-blue-500 hover:bg-blue-600",
    soundUrl: "/samples/clap2.wav",
  },
  {
    id: 12,
    name: "HiHat 2",
    key: "F",
    color: "bg-indigo-500 hover:bg-indigo-600",
    soundUrl: "/samples/hihat2.wav",
  },
  {
    id: 13,
    name: "Tom 3",
    key: "Z",
    color: "bg-violet-500 hover:bg-violet-600",
    soundUrl: "/samples/tom3.wav",
  },
  {
    id: 14,
    name: "Tom 4",
    key: "X",
    color: "bg-purple-500 hover:bg-purple-600",
    soundUrl: "/samples/tom4.wav",
  },
  {
    id: 15,
    name: "Cymbal 2",
    key: "C",
    color: "bg-fuchsia-500 hover:bg-fuchsia-600",
    soundUrl: "/samples/cymbal2.wav",
  },
  {
    id: 16,
    name: "Perc 2",
    key: "V",
    color: "bg-pink-500 hover:bg-pink-600",
    soundUrl: "/samples/perc2.wav",
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
  const [showShortcuts, setShowShortcuts] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [failedSamples, setFailedSamples] = useState<Set<number>>(new Set());

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
          setFailedSamples((prev) => new Set(prev).add(pad.id));
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
      if (event.key.toLowerCase() === "k") {
        setShowShortcuts((prev) => !prev);
        return;
      }

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
          <div>
            <h1 className="text-3xl font-bold text-white">Rainbow Beat Maker</h1>
            <p className="text-gray-400 text-sm mt-1">
              Press &apos;K&apos; to {showShortcuts ? "hide" : "show"} keyboard shortcuts
            </p>
          </div>
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
              } p-6 rounded-lg aspect-square flex flex-col items-center justify-center text-white transition-transform ${
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
          ))}
        </div>
      </div>
    </div>
  );
}
