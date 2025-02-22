export type Pad = {
  id: number;
  name: string;
  key: string;
  color: string;
  soundUrl: string;
};

export type PadHit = {
  padId: number;
  timestamp: number;
};

export type Pattern = {
  hits: PadHit[];
  duration: number;
  loop?: boolean;
};

export type Quantization = {
  value: number;
  label: string;
  triplet: boolean;
};

export type LayoutState = {
  configWidth: number;
  timelineHeight: number;
  padHeight: number;
};
