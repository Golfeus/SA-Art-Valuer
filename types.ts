
export interface ArtworkData {
  artist: string;
  title: string;
  medium: string;
  year: string;
  dimensions: string;
  condition: string;
  description: string;
}

export interface ValuationResult {
  estimateLow: number;
  estimateHigh: number;
  currency: string;
  analysis: string;
  sources: Source[];
}

export interface Source {
  title: string;
  uri: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}
