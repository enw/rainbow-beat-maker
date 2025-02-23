"use client";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Footer } from "./Footer";
import { Pads } from "./Pads";
import { Header } from "./Header";
import { ConfigPanel } from "./ConfigPanel";
import {
  ComponentSection,
  Pattern,
  Pad,
  PadHit,
  Quantization,
  LayoutState,
} from "./types";

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

type TimelineProps = {
  pattern: Pattern | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  measures: number;
  bpm: number;
  height: number;
  onHeightChange: (height: number) => void;
  pads: Pad[];
  onHover: (description: string) => void;
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
  pads,
  onHover,
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
            {pads.map((pad, trackIndex) => {
              const trackHeight = (height - 24) / pads.length;
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

const DEFAULT_LAYOUT: LayoutState = {
  configWidth: 250,
  timelineHeight: 300,
  padHeight: 300,
};

function loadLayout(): LayoutState {
  if (typeof window === "undefined") return DEFAULT_LAYOUT;
  try {
    const saved = localStorage.getItem("beatmaker-layout");
    return saved ? JSON.parse(saved) : DEFAULT_LAYOUT;
  } catch {
    return DEFAULT_LAYOUT;
  }
}

function saveLayout(layout: LayoutState) {
  localStorage.setItem("beatmaker-layout", JSON.stringify(layout));
}

// Update the colorMap type definition
const colorMap: { [key: string]: string } = {
  "bg-red-500": "#f56565",
  "bg-orange-500": "#ed8936",
  "bg-amber-500": "#f6ad55",
  "bg-yellow-500": "#ecc94b",
  "bg-lime-500": "#d69e2e",
  "bg-green-500": "#48bb78",
  "bg-emerald-500": "#38a169",
  "bg-teal-500": "#319795",
  "bg-cyan-500": "#00b5d8",
  "bg-sky-500": "#4299e1",
  "bg-blue-500": "#3182ce",
  "bg-indigo-500": "#5a67d8",
  "bg-violet-500": "#805ad5",
  "bg-purple-500": "#9f7aea",
  "bg-fuchsia-500": "#d53f8c",
  "bg-pink-500": "#ed64a6",
};

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
  const [currentTime, setCurrentTime] = useState(0);
  const [layout, setLayout] = useState<LayoutState>(loadLayout);
  const [isResizingConfig, setIsResizingConfig] = useState(false);
  const [isResizingTimeline, setIsResizingTimeline] = useState(false);
  const [hoveredElement, setHoveredElement] = useState("");
  const [hoveredSection, setHoveredSection] = useState<ComponentSection>(null);
  const [headerColor, setHeaderColor] = useState("#1f2937"); // Default header color (gray-800)
  const [flashHeader, setFlashHeader] = useState(true); // New state for flashing header
  const [beatCount, setBeatCount] = useState(0); // New state for beat count

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
          console.error(`Failed to load sample for pad ${pad.name}:`, error);
          setFailedSamples((prev) => new Set(prev).add(pad.id));
        }
      };

      await Promise.all(initialPads.map(loadSample));
    };

    initAudio();
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

        // Change header color based on the pad played
        if (flashHeader) {
          const pad = initialPads.find((pad) => pad.id === padId);
          const padColor = pad ? colorMap[pad.color.split(" ")[0]] : "#1f2937";
          setHeaderColor(padColor); // Set the header color to the pad's color
          setTimeout(() => {
            setHeaderColor("#1f2937"); // Reset after 300ms
          }, 300);
        }
      }
    },
    [samples, flashHeader]
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
        const quantizedTimestamp =
          Math.round(timestamp / noteDuration) * noteDuration;

        setCurrentPattern((prev) => ({
          hits: [
            ...(prev?.hits || []),
            { padId, timestamp: quantizedTimestamp },
          ],
          duration: prev?.duration || 0,
          loop: prev?.loop,
        }));

        // Immediately update the timeline with the new hit
        setCurrentTime(quantizedTimestamp);
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
    if (!currentPattern) return;

    setIsPlaying(true);
    const startTime = Date.now();

    const playHits = () => {
      if (!currentPattern) return;

      const elapsed = (Date.now() - startTime) % currentPattern.duration; // Use modulo for proper looping
      const currentHits = currentPattern.hits.filter((hit) => {
        // Check if the hit should play in this frame
        const hitTime = hit.timestamp % currentPattern.duration;
        return hitTime <= elapsed && hitTime > elapsed - 16; // 16ms frame window
      });

      currentHits.forEach((hit) => {
        playSound(hit.padId);
      });

      if (isLooping || elapsed < currentPattern.duration) {
        playbackTimeoutRef.current = setTimeout(playHits, 16); // Continue playing
      } else {
        setIsPlaying(false); // Only stop if we're not looping and pattern is done
      }

      // Update timeline position
      setCurrentTime(elapsed);
    };

    playHits();
  }, [currentPattern, isLooping, playSound]);

  const startRecording = useCallback(() => {
    // Handle count-in before recording
    if (useCountIn) {
      let count = 0;
      const countInBeats = 4; // One measure

      const playCountIn = () => {
        playMetronomeSound(count === 0); // First beat is accented
        count++;
        if (count < countInBeats) {
          countInTimeoutRef.current = setTimeout(playCountIn, beatDuration);
        } else {
          // Start recording after count-in
          setIsRecording(true);
          setRecordingStartTime(Date.now());
          if (isMetronomeOn) {
            startMetronome();
          }
        }
      };

      playCountIn();
    } else {
      setIsRecording(true);
      setRecordingStartTime(Date.now());
      if (isMetronomeOn) {
        startMetronome();
      }
    }
  }, [
    useCountIn,
    beatDuration,
    isMetronomeOn,
    startMetronome,
    playMetronomeSound,
  ]);

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
      // Handle keyboard shortcuts
      if (event.ctrlKey && event.shiftKey) {
        switch (event.key.toLowerCase()) {
          case "b":
            setBpm((prev) => (prev >= 240 ? 40 : prev + 10));
            break;
          case "m":
            setIsMetronomeOn((prev) => !prev);
            break;
          case "c":
            setUseCountIn((prev) => !prev);
            break;
          case "l":
            setIsLooping((prev) => !prev);
            break;
          case "q":
            setQuantization((prev) => {
              const currentIndex = quantizationOptions.findIndex(
                (q) => q.value === prev.value && q.triplet === prev.triplet
              );
              const nextIndex = (currentIndex + 1) % quantizationOptions.length;
              return quantizationOptions[nextIndex];
            });
            break;
          case "h":
            setFlashHeader((prev) => !prev);
            break;
          case "k":
            setShowShortcuts((prev) => !prev);
            break;
        }
        return; // Exit early for shortcuts
      }

      // Handle pad triggers
      const padId = keyToPadMap.get(event.key.toLowerCase());
      if (padId) {
        setActivePads((prev) => new Set([...prev, padId]));
        handlePadPress(padId);
      }
    },
    [
      setBpm,
      setIsMetronomeOn,
      setUseCountIn,
      setIsLooping,
      setQuantization,
      setFlashHeader,
      setShowShortcuts,
      handlePadPress,
    ]
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

  const handleConfigResize = useCallback(
    (e: MouseEvent) => {
      if (isResizingConfig) {
        const newWidth = Math.max(200, Math.min(400, e.clientX));
        setLayout((prev) => ({ ...prev, configWidth: newWidth }));
      }
    },
    [isResizingConfig]
  );

  const handleTimelineResize = useCallback(
    (e: MouseEvent) => {
      if (isResizingTimeline) {
        const newHeight = Math.max(100, Math.min(600, e.clientY));
        setLayout((prev) => ({ ...prev, timelineHeight: newHeight }));
      }
    },
    [isResizingTimeline]
  );

  useEffect(() => {
    if (isResizingConfig || isResizingTimeline) {
      window.addEventListener(
        "mousemove",
        isResizingConfig ? handleConfigResize : handleTimelineResize
      );
      window.addEventListener("mouseup", () => {
        setIsResizingConfig(false);
        setIsResizingTimeline(false);
      });
      document.body.style.cursor = isResizingConfig ? "ew-resize" : "ns-resize";
    }

    return () => {
      window.removeEventListener("mousemove", handleConfigResize);
      window.removeEventListener("mousemove", handleTimelineResize);
      document.body.style.cursor = "";
    };
  }, [
    isResizingConfig,
    isResizingTimeline,
    handleConfigResize,
    handleTimelineResize,
  ]);

  const handleHover = useCallback(
    (section: ComponentSection, element: string = "") => {
      setHoveredSection(section);
      setHoveredElement(element);
    },
    []
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Header fixed at top */}
      <Header
        className="flex-shrink-0"
        currentPattern={currentPattern}
        isPlaying={isPlaying}
        isRecording={isRecording}
        onPlay={playPattern}
        onRecord={startRecording}
        onStop={stopPattern}
        onStopRecording={stopRecording}
        onClear={clearPattern}
        headerColor={headerColor}
        beatCount={beatCount}
      />

      {/* Main content area */}
      <div className="flex-grow flex">
        {/* Config Panel */}
        <div className="flex flex-row h-full">
          <div
            className="bg-gray-800 flex-shrink-0 border-r border-gray-700"
            style={{ width: `${layout.configWidth}px` }}
          >
            <ConfigPanel
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
              quantization={quantization}
              setQuantization={setQuantization}
              showShortcuts={showShortcuts}
              setShowShortcuts={setShowShortcuts}
              flashHeader={flashHeader}
              setFlashHeader={setFlashHeader}
            />
          </div>

          {/* Resizer */}
          <div
            className="w-1 bg-gray-600 hover:bg-gray-500 cursor-ew-resize"
            onMouseDown={() => setIsResizingConfig(true)}
          />
        </div>

        {/* Timeline and Pads */}
        <div className="flex-grow bg-gray-800 overflow-hidden flex flex-col">
          <div
            className="flex-shrink-0"
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
              onHeightChange={(height) =>
                setLayout((prev) => ({ ...prev, timelineHeight: height }))
              }
              pads={initialPads}
              onHover={(element) => handleHover("timeline", element)}
            />
            <div
              className="h-1 w-full bg-gray-600 hover:bg-gray-500 cursor-ns-resize"
              onMouseDown={() => setIsResizingTimeline(true)}
            />
          </div>

          <div className="flex-grow">
            <Pads
              pads={initialPads}
              activePads={activePads}
              failedSamples={failedSamples}
              showShortcuts={showShortcuts}
              onPadPress={handlePadPress}
              onHover={(element) => handleHover("pads", element)}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer
        className="flex-shrink-0"
        hoveredElement={hoveredElement}
        hoveredSection={hoveredSection}
      />
    </div>
  );
}
