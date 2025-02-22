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

// Add new type for quantization options
type Quantization = {
  value: number; // fraction of a beat (1 = whole note, 0.25 = quarter note, etc.)
  label: string;
  triplet: boolean;
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
  quantization: Quantization;
  setQuantization: (q: Quantization) => void;
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
  quantization,
  setQuantization,
}: ConfigPanelProps) {
  return (
    <div
      className={`fixed right-0 top-0 h-full w-64 bg-gray-800 p-6 transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <h2 className="text-white text-xl font-bold mb-6">Configuration</h2>
      <div className="space-y-4 text-white">
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
            onChange={(e) =>
              setMeasures(Math.max(1, Math.min(8, Number(e.target.value))))
            }
            className="w-20 px-2 py-1 rounded bg-gray-700 text-white"
          />
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

function Timeline({
  pattern,
  isPlaying,
  currentTime,
  duration,
  measures,
  bpm,
  height,
  onHeightChange,
}: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const minHeight = 100;
  const maxHeight = 600;

  // Calculate timing markers
  const beatsPerMeasure = 4;
  const totalBeats = measures * beatsPerMeasure;
  const beatDuration = 60000 / bpm; // ms per beat
  const sixteenthDuration = beatDuration / 4; // duration of a 16th note

  // Handle resize drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const containerHeight = window.innerHeight - 200; // Account for header and padding
        const newHeight = Math.max(
          minHeight,
          Math.min(maxHeight, e.clientY - rect.top)
        );
        const remainingHeight = containerHeight - newHeight;

        if (remainingHeight >= minHeight) {
          onHeightChange(newHeight);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ns-resize";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
    };
  }, [isResizing, onHeightChange]);

  return (
    <div className="mb-8">
      <div ref={timelineRef} className="bg-gray-800 rounded-lg p-4">
        <div
          className="relative bg-gray-700 rounded-t overflow-hidden"
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
                <div className="absolute top-0 text-xs text-gray-400">
                  {i + 1}
                </div>
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
                    backgroundColor: "rgba(0,0,0,0.2)",
                  }}
                >
                  <div className="absolute left-2 text-xs text-gray-400">
                    {pad.name}
                  </div>
                  {/* Hits for this pad */}
                  {pattern?.hits
                    .filter((hit) => hit.padId === pad.id)
                    .map((hit, index) => {
                      const position = (hit.timestamp / duration) * 100;
                      return (
                        <div
                          key={index}
                          className={`absolute h-full w-2 ${pad.color} opacity-75`}
                          style={{
                            left: `${position}%`,
                            transform: "translateX(-50%)",
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
                transition: "left 100ms linear",
              }}
            />
          )}
        </div>
      </div>
      {/* Improved resize handle */}
      <div
        ref={resizeRef}
        className="h-2 w-full bg-gray-600 hover:bg-gray-500 cursor-ns-resize flex items-center justify-center"
        onMouseDown={(e) => {
          e.preventDefault();
          setIsResizing(true);
        }}
      >
        <div className="w-20 h-1 bg-gray-400 rounded-full" />
      </div>
    </div>
  );
}

type LayoutState = {
  configWidth: number;
  timelineHeight: number;
  padHeight: number;
};

const DEFAULT_LAYOUT: LayoutState = {
  configWidth: 250,
  timelineHeight: 300,
  padHeight: 300,
};

function loadLayout(): LayoutState {
  if (typeof window === 'undefined') return DEFAULT_LAYOUT;
  const saved = localStorage.getItem('beatmaker-layout');
  return saved ? JSON.parse(saved) : DEFAULT_LAYOUT;
}

function saveLayout(layout: LayoutState) {
  localStorage.setItem('beatmaker-layout', JSON.stringify(layout));
}

export default function MPC() {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(
    null
  );
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const [activePads, setActivePads] = useState<Set<number>>(new Set());
  const [samples, setSamples] = useState<Map<number, AudioBuffer>>(new Map());
  const [showShortcuts, setShowShortcuts] = useState(true);
  const [failedSamples, setFailedSamples] = useState<Set<number>>(new Set());
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [layout, setLayout] = useState<LayoutState>(loadLayout);
  const [isResizingConfig, setIsResizingConfig] = useState(false);
  const [isResizingTimeline, setIsResizingTimeline] = useState(false);

  // Set all boolean config options to true by default
  const [isMetronomeOn, setIsMetronomeOn] = useState(true);
  const [useCountIn, setUseCountIn] = useState(true);
  const [isLooping, setIsLooping] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const metronomeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countInTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [measures, setMeasures] = useState(4);
  const [quantization, setQuantization] = useState<Quantization>(
    quantizationOptions.find((q) => q.value === 0.25 && !q.triplet)! // default to 16th notes
  );

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

  const playMetronomeSound = useCallback((isFirstBeat: boolean = false) => {
    if (audioContextRef.current) {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      // Higher pitch for first beat, lower for others
      oscillator.frequency.setValueAtTime(
        isFirstBeat ? 1000 : 800,
        audioContextRef.current.currentTime
      );

      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContextRef.current.currentTime + 0.1
      );

      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.1);
    }
  }, []);

  const startMetronome = useCallback(() => {
    if (metronomeIntervalRef.current) return;

    let beatCount = 0;
    const beatsPerMeasure = 4;

    const playBeat = () => {
      playMetronomeSound(beatCount % beatsPerMeasure === 0);
      beatCount++;
    };

    playBeat(); // Play first beat immediately
    metronomeIntervalRef.current = setInterval(playBeat, beatDuration);
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

  const handlePadPress = useCallback(
    (padId: number) => {
      playSound(padId);
      setActivePads((prev) => new Set([...prev, padId]));

      // Record the pad hit if recording
      if (isRecording && recordingStartTime) {
        const timestamp = Date.now() - recordingStartTime;
        const beatDuration = 60000 / bpm;

        // Calculate note duration based on quantization
        let noteDuration = beatDuration * quantization.value;
        if (quantization.triplet) {
          noteDuration = (noteDuration * 2) / 3; // Adjust for triplet timing
        }

        // Quantize timestamp
        const quantizedTimestamp = Math.round(timestamp / noteDuration) * noteDuration;

        setCurrentPattern((prev) => ({
          hits: [...(prev?.hits || []), { padId, timestamp: quantizedTimestamp }],
          duration: prev?.duration || 0,
          loop: prev?.loop,
        }));
      }

      setTimeout(() => {
        setActivePads((prev) => {
          const newSet = new Set(prev);
          newSet.delete(padId);
          return newSet;
        });
      }, 100); // Added missing timeout duration
    },
    [playSound, isRecording, recordingStartTime, bpm, quantization]
  );

  const playPattern = useCallback(() => {
    if (!currentPattern || isRecording) return;

    const startPlayback = () => {
      setIsPlaying(true);

      // Start metronome if enabled
      if (isMetronomeOn) {
        startMetronome();
      }

      // Schedule all pad hits
      currentPattern.hits.forEach((hit) => {
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
          stopMetronome();
        }
      }, currentPattern.duration);
    };

    // Handle count-in
    if (useCountIn && !isPlaying) {
      setIsPlaying(true);
      let count = 0;
      const countInBeats = 4; // One measure

      const playCountIn = () => {
        playMetronomeSound(count === 0); // First beat is accented
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
  }, [
    currentPattern,
    isRecording,
    isLooping,
    beatDuration,
    isMetronomeOn,
    useCountIn,
    handlePadPress,
    playMetronomeSound,
    startMetronome,
    stopMetronome,
  ]);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setRecordingStartTime(Date.now());

    // Start metronome if enabled
    if (isMetronomeOn) {
      startMetronome();
    }

    // Start playing existing pattern if it exists
    if (currentPattern) {
      playPattern();
    }
  }, [currentPattern, playPattern, isMetronomeOn, startMetronome]);

  const stopRecording = useCallback(() => {
    if (recordingStartTime === null) return;

    setIsRecording(false);
    const duration = Date.now() - recordingStartTime;
    setCurrentPattern((prev) => ({
      hits: prev?.hits || [],
      duration: prev ? Math.max(prev.duration, duration) : duration,
      loop: prev?.loop,
    }));
    setRecordingStartTime(null);

    // Stop metronome
    stopMetronome();
  }, [recordingStartTime, stopMetronome]);

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
      if (metronomeIntervalRef.current)
        clearInterval(metronomeIntervalRef.current);
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

  // Save layout changes
  useEffect(() => {
    saveLayout(layout);
  }, [layout]);

  const handleConfigResize = useCallback((e: MouseEvent) => {
    if (isResizingConfig) {
      const newWidth = Math.max(200, Math.min(400, e.clientX));
      setLayout(prev => ({ ...prev, configWidth: newWidth }));
    }
  }, [isResizingConfig]);

  const handleTimelineResize = useCallback((e: MouseEvent) => {
    if (isResizingTimeline) {
      const newHeight = Math.max(100, Math.min(600, e.clientY));
      setLayout(prev => ({ ...prev, timelineHeight: newHeight }));
    }
  }, [isResizingTimeline]);

  useEffect(() => {
    if (isResizingConfig || isResizingTimeline) {
      window.addEventListener('mousemove', isResizingConfig ? handleConfigResize : handleTimelineResize);
      window.addEventListener('mouseup', () => {
        setIsResizingConfig(false);
        setIsResizingTimeline(false);
      });
      document.body.style.cursor = isResizingConfig ? 'ew-resize' : 'ns-resize';
    }

    return () => {
      window.removeEventListener('mousemove', handleConfigResize);
      window.removeEventListener('mousemove', handleTimelineResize);
      document.body.style.cursor = '';
    };
  }, [isResizingConfig, isResizingTimeline, handleConfigResize, handleTimelineResize]);

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      {/* Config Panel */}
      <div 
        className="bg-gray-800 h-full flex-shrink-0 flex flex-col"
        style={{ width: `${layout.configWidth}px` }}
      >
        <div className="p-4 flex-grow overflow-y-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Rainbow Beat Maker</h1>
          <div className="space-y-4">
            <div className="text-white">
              <label className="block mb-2">BPM</label>
              <input
                type="number"
                value={bpm}
                onChange={(e) => setBpm(Math.max(40, Math.min(240, Number(e.target.value))))}
                className="w-full px-2 py-1 rounded bg-gray-700"
              />
            </div>
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={isMetronomeOn}
                onChange={(e) => setIsMetronomeOn(e.target.checked)}
                className="mr-2"
              />
              Metronome
            </label>
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={useCountIn}
                onChange={(e) => setUseCountIn(e.target.checked)}
                className="mr-2"
              />
              Count-in
            </label>
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={isLooping}
                onChange={(e) => setIsLooping(e.target.checked)}
                className="mr-2"
              />
              Loop
            </label>
            <div className="text-white">
              <label className="block mb-2">Measures</label>
              <input
                type="number"
                value={measures}
                onChange={(e) => setMeasures(Math.max(1, Math.min(8, Number(e.target.value))))}
                className="w-full px-2 py-1 rounded bg-gray-700"
              />
            </div>
          </div>
        </div>
        {/* Config resize handle */}
        <div
          className="absolute right-0 top-0 w-1 h-full bg-gray-600 hover:bg-gray-500 cursor-ew-resize"
          onMouseDown={() => setIsResizingConfig(true)}
        />
      </div>

      <div className="flex-grow flex flex-col h-full overflow-hidden">
        {/* Header with transport controls */}
        <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Rainbow Beat Maker</h1>
          
          <div className="flex items-center gap-4">
            {!isRecording && !isPlaying && (
              <>
                <button
                  onClick={startRecording}
                  className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                >
                  <span className="text-xl">⏺</span>
                  {currentPattern ? "Overdub" : "Record"}
                </button>
                {currentPattern && (
                  <button
                    onClick={playPattern}
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
                onClick={stopRecording}
                className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2"
              >
                <span className="text-xl">⏹</span>
                Stop Recording
              </button>
            )}
            {isPlaying && !isRecording && (
              <button
                onClick={stopPattern}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
              >
                <span className="text-xl">⏹</span>
                Stop
              </button>
            )}
            {currentPattern && !isPlaying && !isRecording && (
              <button
                onClick={clearPattern}
                className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div 
          className="bg-gray-800 flex-shrink-0"
          style={{ height: `${layout.timelineHeight}px` }}
        >
          <Timeline
            pattern={currentPattern}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={currentPattern?.duration || 0}
            measures={measures}
            bpm={bpm}
            height={layout.timelineHeight - 40}
            onHeightChange={height => setLayout(prev => ({ ...prev, timelineHeight: height }))}
          />
          {/* Timeline resize handle */}
          <div
            className="h-1 w-full bg-gray-600 hover:bg-gray-500 cursor-ns-resize"
            onMouseDown={() => setIsResizingTimeline(true)}
          />
        </div>

        {/* Pads */}
        <div className="flex-grow bg-gray-900 overflow-auto flex items-center justify-center">
          <div className="p-4" style={{ width: 'min(100%, 600px)' }}>
            <div className="grid grid-cols-4 gap-4">
              {initialPads.map((pad) => (
                <div key={pad.id} className="aspect-square">
                  <button
                    onMouseDown={() => handlePadPress(pad.id)}
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
      </div>
    </div>
  );
}
