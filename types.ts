
export enum Classification {
  AI_GENERATED = 'AI_GENERATED',
  HUMAN = 'HUMAN',
  HYBRID = 'HYBRID',
  UNCERTAIN = 'UNCERTAIN'
}

export interface DetectionResult {
  classification: Classification;
  confidence: number;
  language: string;
  audio_duration_sec: number;
  model_version: string;
  analysis_report?: string;
}

export interface SpectrogramData {
  frequencies: number[];
  times: number[];
  magnitudes: number[][];
}
