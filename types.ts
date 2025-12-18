
export interface Scene {
  id: number;
  timestamp: string;
  title: string;
  duration: number; // in seconds
  pacing: string;
  retentionHook: string;
  cardOpportunity: string;
  seoMoment: string;
  shotStrategy: string;
  description: string;
}

export interface RetentionPoint {
  time: number;
  retention: number;
  label: string;
}

export interface TechnicalSpecs {
  codec: string;
  resolution: string;
  bitrate: string;
  audio: string;
}

export enum WorkflowPhase {
  ASSEMBLY = 'Assembly',
  RETENTION = 'Retention Pass',
  OPTIMIZATION = 'Optimization',
  METADATA = 'Metadata & SEO'
}

export interface AIAnalysisResult {
  pacingInstructions: string;
  hookMoments: string[];
  vibeCheck: string;
}
