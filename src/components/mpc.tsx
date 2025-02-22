"use client";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";

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

type PadHit = {
  padId: number;
  timestamp: number;
};

type Pattern = {
  hits: PadHit[];
  duration: number;
  loop?: boolean;
};

type ConfigPanelProps = {
  isOpen: boolean;
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
};

function ConfigPanel({
  isOpen,
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
}: ConfigPanelProps) {
  return (
    <div 
      className={`fixed right-0 top-0 h-full w-64 bg-gray-800 p-6 transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <h2 className="text-white text-xl font-bold mb-6">Configuration</h2>
      <div className="space-y-4 text-white">
        <div className="flex items-center gap-2">
          <label className="mr-2">BPM:</label>
          <input
            type="number"
            value={bpm}
            onChange={(e) => setBpm(Math.max(40, Math.min(240, Number(e.target.value))))}
            className="w-20 px-2 py-1 rounded bg-gray-700 text-white"
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isMetronomeOn}
            onChange={(e) => setIsMetronomeOn(e.target.checked)}
            className="w-4 h-4"
          />
          Metronome
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useCountIn}
            onChange={(e) => setUseCountIn(e.target.checked)}
            className="w-4 h-4"
          />
          Count-in
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isLooping}
            onChange={(e) => setIsLooping(e.target.checked)}
            className="w-4 h-4"
          />
          Loop
        </label>
        <div className="flex items-center gap-2">
          <label className="mr-2">Measures:</label>
          <input
            type="number"
            value={measures}
            onChange={(e) => setMeasures(Math.max(1, Math.min(8, Number(e.target.value))))}
            className="w-20 px-2 py-1 rounded bg-gray-700 text-white"
          />
        </div>
      </div>
    </div>
  );
}

// Add new types for visualization
type TimelineProps = {
  pattern: Pattern | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  measures: number;
  bpm: number;
  height: number;
  onHeightChange: (height: number) => void;
};

function Timeline({ pattern, isPlaying, currentTime, duration, measures, bpm, height, onHeightChange }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const minHeight = 100;
  const maxHeight = 400;

  // Calculate timing markers
  const beatsPerMeasure = 4;
  const totalBeats = measures * beatsPerMeasure;
  const beatDuration = 60000 / bpm; // ms per beat
  const measureDuration = beatDuration * beatsPerMeasure;

  // Handle resize drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const newHeight = Math.max(minHeight, Math.min(maxHeight, e.clientY - rect.top));
        onHeightChange(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, onHeightChange]);

  return (
    <div ref={timelineRef} className="mb-8 bg-gray-800 rounded-lg p-4">
      <div 
        className="relative bg-gray-700 rounded overflow-hidden"
        style={{ height: `${height}px` }}
      >
        {/* Measure markers */}
        <div className="absolute inset-0">
          {Array.from({ length: measures + 1 }).map((_, i) => (
            <div
              key={`measure-${i}`}
              className="absolute top-0 h-full w-px bg-gray-500"
              style={{ left: `${(i / measures) * 100}%` }}
            >
              <div className="absolute top-0 text-xs text-gray-400">{i + 1}</div>
            </div>
          ))}
        </div>

        {/* Beat markers */}
        <div className="absolute inset-0">
          {Array.from({ length: totalBeats + 1 }).map((_, i) => (
            <div
              key={`beat-${i}`}
              className="absolute top-0 h-full w-px bg-gray-600 opacity-50"
              style={{ left: `${(i / totalBeats) * 100}%` }}
            />
          ))}
        </div>

        {/* Tracks for each pad */}
        <div className="absolute inset-0">
          {initialPads.map((pad, trackIndex) => {
            const trackHeight = (height - 24) / initialPads.length;
            const trackTop = trackHeight * trackIndex + 20;

            return (
              <div
                key={pad.id}
                className="absolute w-full"
                style={{
                  top: trackTop,
                  height: trackHeight - 1,
                  backgroundColor: 'rgba(0,0,0,0.2)'
                }}
              >
                <div className="absolute left-2 text-xs text-gray-400">{pad.name}</div>
                {/* Hits for this pad */}
                {pattern?.hits.filter(hit => hit.padId === pad.id).map((hit, index) => {
                  const position = (hit.timestamp / duration) * 100;
                  return (
                    <div
                      key={index}
                      className={`absolute h-full w-2 ${pad.color} opacity-75`}
                      style={{
                        left: `${position}%`,
                        transform: 'translateX(-50%)'
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Playback position indicator */}
        {isPlaying && (
          <div 
            className="absolute top-0 h-full w-px bg-white z-10"
            style={{
              left: `${(currentTime / duration) * 100}%`,
              transition: 'left 100ms linear'
            }}
          />
        )}
      </div>

      {/* Resize handle */}
      <div
        ref={resizeRef}
        className="h-2 w-full bg-gray-600 hover:bg-gray-500 cursor-ns-resize"
        onMouseDown={() => setIsResizing(true)}
      />
    </div>
  );
}

export default function MPC() {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePads, setActivePads] = useState<Set<number>>(new Set());
  const [samples, setSamples] = useState<Map<number, AudioBuffer>>(new Map());
  const [showShortcuts, setShowShortcuts] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [failedSamples, setFailedSamples] = useState<Set<number>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);
  const [useCountIn, setUseCountIn] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const metronomeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countInTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [measures, setMeasures] = useState(4);
  const [timelineHeight, setTimelineHeight] = useState(200);

  // Calculate beat duration in ms from BPM
  const beatDuration = useMemo(() => 60000 / bpm, [bpm]);

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

  const playMetronomeSound = useCallback(() => {
    if (audioContextRef.current) {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(880, audioContextRef.current.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.1);
    }
  }, []);

  const startMetronome = useCallback(() => {
    if (metronomeIntervalRef.current) return;
    
    playMetronomeSound();
    metronomeIntervalRef.current = setInterval(playMetronomeSound, beatDuration);
  }, [beatDuration, playMetronomeSound]);

  const stopMetronome = useCallback(() => {
    if (metronomeIntervalRef.current) {
      clearInterval(metronomeIntervalRef.current);
      metronomeIntervalRef.current = null;
    }
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

  const handlePadPress = useCallback((padId: number) => {
    playSound(padId);
    setActivePads(prev => new Set([...prev, padId]));
    
    // Record the pad hit if recording
    if (isRecording && recordingStartTime) {
      const timestamp = Date.now() - recordingStartTime;
      setCurrentPattern(prev => ({
        hits: [...(prev?.hits || []), { padId, timestamp }],
        duration: prev?.duration || 0,
        loop: prev?.loop
      }));
    }

    setTimeout(() => {
      setActivePads(prev => {
        const newSet = new Set(prev);
        newSet.delete(padId);
        return newSet;
      });
    }, 100);
  }, [playSound, isRecording, recordingStartTime]);

  const playPattern = useCallback(() => {
    if (!currentPattern || isRecording) return;
    
    const startPlayback = () => {
      setIsPlaying(true);

      // Schedule all pad hits
      currentPattern.hits.forEach(hit => {
        playbackTimeoutRef.current = setTimeout(() => {
          handlePadPress(hit.padId);
        }, hit.timestamp);
      });

      // Handle pattern end
      playbackTimeoutRef.current = setTimeout(() => {
        if (isLooping) {
          startPlayback(); // Restart if looping
        } else {
          setIsPlaying(false);
          if (isMetronomeOn) stopMetronome();
        }
      }, currentPattern.duration);
    };

    // Handle count-in
    if (useCountIn && !isPlaying) {
      setIsPlaying(true);
      let count = 0;
      const countInBeats = 4; // One measure

      const playCountIn = () => {
        playMetronomeSound();
        count++;
        if (count < countInBeats) {
          countInTimeoutRef.current = setTimeout(playCountIn, beatDuration);
        } else {
          startPlayback();
        }
      };

      playCountIn();
    } else {
      startPlayback();
    }

    // Start metronome if enabled
    if (isMetronomeOn) startMetronome();
  }, [currentPattern, isRecording, isLooping, beatDuration, isMetronomeOn, useCountIn, handlePadPress, playMetronomeSound, startMetronome, stopMetronome]);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setRecordingStartTime(Date.now());
    // Start playing existing pattern if it exists
    if (currentPattern) {
      playPattern();
    }
  }, [currentPattern, playPattern]);

  const stopRecording = useCallback(() => {
    if (recordingStartTime === null) return;
    
    setIsRecording(false);
    const duration = Date.now() - recordingStartTime;
    setCurrentPattern(prev => ({
      hits: prev?.hits || [],
      duration: prev ? Math.max(prev.duration, duration) : duration,
      loop: prev?.loop
    }));
    setRecordingStartTime(null);
  }, [recordingStartTime]);

  // Update metronome interval when BPM changes
  useEffect(() => {
    if (isMetronomeOn) {
      stopMetronome();
      startMetronome();
    }
  }, [bpm, isMetronomeOn, startMetronome, stopMetronome]);

  const stopPattern = useCallback(() => {
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
    }
    if (countInTimeoutRef.current) {
      clearTimeout(countInTimeoutRef.current);
    }
    stopMetronome();
    setIsPlaying(false);
  }, [stopMetronome]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);
      if (countInTimeoutRef.current) clearTimeout(countInTimeoutRef.current);
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current);
    };
  }, []);

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

  const clearPattern = useCallback(() => {
    setCurrentPattern(null);
  }, []);

  // Update current time during playback
  useEffect(() => {
    if (isPlaying && currentPattern) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setCurrentTime(elapsed);
        
        if (elapsed >= currentPattern.duration) {
          if (!isLooping) {
            setCurrentTime(0);
          }
        }
      }, 16); // ~60fps

      return () => {
        clearInterval(interval);
        setCurrentTime(0);
      };
    }
  }, [isPlaying, currentPattern, isLooping]);

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
            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
            >
              ⚙️ Config
            </button>
            <div className="flex gap-2">
              {!isRecording && !isPlaying && (
                <>
                  <button
                    onClick={startRecording}
                    className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                  >
                    {currentPattern ? "Overdub" : "Record"}
                  </button>
                  {currentPattern && (
                    <>
                      <button
                        onClick={playPattern}
                        className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
                      >
                        Play
                      </button>
                      <button
                        onClick={clearPattern}
                        className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
                      >
                        Clear
                      </button>
                    </>
                  )}
                </>
              )}
              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Stop Recording
                </button>
              )}
              {isPlaying && !isRecording && (
                <button
                  onClick={stopPattern}
                  className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                >
                  Stop
                </button>
              )}
            </div>
          </div>
        </div>

        <ConfigPanel
          isOpen={isConfigOpen}
          bpm={bpm}
          setBpm={setBpm}
          isMetronomeOn={isMetronomeOn}
          setIsMetronomeOn={setIsMetronomeOn}
          useCountIn={useCountIn}
          setUseCountIn={setUseCountIn}
          isLooping={isLooping}
          setIsLooping={setIsLooping}
          measures={measures}
          setMeasures={setMeasures}
        />

        <Timeline
          pattern={currentPattern}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={currentPattern?.duration || 0}
          measures={measures}
          bpm={bpm}
          height={timelineHeight}
          onHeightChange={setTimelineHeight}
        />

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
