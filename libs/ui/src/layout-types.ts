export type PanelDockPosition = 'LEFT' | 'RIGHT' | 'BOTTOM' | 'FLOATING';

export type ColorSpace = 'CMYK' | 'RGB' | 'DeviceN' | 'Spot';

export interface WorkspacePanel {
  id: string;
  title: string;
  isPinned: boolean;
  isVisible: boolean;
  defaultPosition: PanelDockPosition;
  currentWidth?: number;
  currentHeight?: number;
}

export interface ProductionJobMetadata {
  jobId: string;
  filename: string;
  dimensions: { widthMm: number; heightMm: number };
  colorSpace: ColorSpace;
  inkCoverageEstimate?: number[];
  hexCoverage?: string[];
  status?: 'queued' | 'ripping' | 'printing' | 'complete' | 'error';
  inkMl?: number;
  substrate?: string;
  copies?: number;
  addedAt?: number;
}

export interface DeviceState {
  id: string;
  name: string;
  status: 'printing' | 'idle' | 'offline' | 'error';
  queueDepth: number;
  ip?: string;
}

export interface SubstrateProfile {
  id: string;
  name: string;
  lutActive: boolean;
  mode?: string;
}

export interface TelemetryEntry {
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  source?: string;
}
