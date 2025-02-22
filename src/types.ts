export type Pattern = {
  hits: {
    padId: number;
    timestamp: number;
  }[];
  duration: number;
  loop?: boolean;
};

export type ComponentSection = "header" | "timeline" | "pads" | null; 