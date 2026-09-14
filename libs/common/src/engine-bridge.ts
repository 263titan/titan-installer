// ─────────────────────────────────────────────────────────────────────────────
// Titan Engine Bridge — TypeScript Wrapper
// Typed interface for the N-API Rust engine bindings.
// Usage: import { geometry, boolean, offset, truepath, plotvision, color } from '@titan/engine-bridge';
// ─────────────────────────────────────────────────────────────────────────────

// ── Shared types ─────────────────────────────────────────────────────────────
export interface Point {
  x: number;
  y: number;
}

export interface Segment {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isClosed: boolean;
  layer: number;
}

export interface BoundingBox {
  min: Point;
  max: Point;
}

export interface CutConfig {
  bladeOffsetMm?: number;
  overcutMm?: number;
  cornerAngleThresholdDeg?: number;
  cornerRadiusMm?: number;
  perforationTabLengthMm?: number;
  perforationSpacingMm?: number;
}

export interface CutJob {
  paths: CutPath[];
  total_length_mm: number;
  estimated_time_ms: number;
}

export interface CutPath {
  segments: CutSegment[];
  layer: number;
  closed: boolean;
}

export interface CutSegment {
  start: Point;
  end: Point;
  is_closed: boolean;
  layer: number;
}

export interface DetectedMark {
  x: number;
  y: number;
  confidence: number;
  markType: string;
}

export interface Contour {
  points: Point[];
  closed: boolean;
  area: number;
  perimeter: number;
}

export interface SpotColor {
  name: string;
  family: string;
  lab: { l: number; a: number; b: number };
  hex: string;
  distance: number;
}

export interface IccProfile {
  name: string;
  colorSpace: string;
  pcs: string;
  channels: number;
}

export interface EngineVersions {
  geometry: string;
  boolean: string;
  offset: string;
  truepath: string;
  plotvision: string;
  color: string;
  kernel: string;
}

// ── Kernel types ─────────────────────────────────────────────────────────────

export type GpuBackend = 'cpu' | 'vulkan' | 'metal' | 'dx12';
export type BufferUsage = 'vertex' | 'index' | 'uniform' | 'storage' | 'staging' | 'transfer';
export type MemoryProperty = 'device-local' | 'host-visible' | 'host-coherent' | 'host-cached';
export type MemoryKind = 'heap' | 'mmap-file' | 'shared-process' | 'gpu-local';
export type AccessPattern = 'sequential' | 'random' | 'write-once-read-many' | 'read-many-write-rare';
export type IoPriority = 'critical' | 'high' | 'normal' | 'low' | 'background';
export type IoDirection = 'read' | 'write' | 'read-write';
export type IoDeviceKind = 'usb' | 'network' | 'disk' | 'serial' | 'gpio';
export type HardwareKind = 'printer' | 'cutter' | 'printer-cutter' | 'laminator' | 'embroidery' | 'engraver';
export type HardwareState = 'disconnected' | 'connected' | 'idle' | 'printing' | 'cutting' | 'error' | 'maintenance' | 'paused';
export type Protocol = 'usb' | 'tcp-ip' | 'serial' | 'bluetooth' | 'usb-raw';

export interface GpuDeviceInfo {
  name: string;
  backend: GpuBackend;
  vramBytes: number;
  computeUnits: number;
  maxTextureDim: number;
  supportsCompute: boolean;
  supportsTransfer: boolean;
}

export interface GpuBuffer {
  id: number;
  size: number;
  usage: BufferUsage;
  memory: MemoryProperty;
}

export interface GpuTexture {
  id: number;
  width: number;
  height: number;
  depth: number;
  format: string;
}

export interface GpuStats {
  buffersAllocated: number;
  texturesAllocated: number;
  totalVramUsed: number;
  totalVramAvailable: number;
  computeDispatches: number;
}

export interface MemoryRegion {
  id: number;
  size: number;
  kind: MemoryKind;
  access: AccessPattern;
  tag: number;
  allocated: boolean;
}

export interface MemoryStats {
  regionsAllocated: number;
  totalAllocated: number;
  totalCapacity: number;
  ringBuffers: number;
  fragmentationRatio: number;
}

export interface IoStats {
  totalRequests: number;
  completed: number;
  failed: number;
  bytesRead: number;
  bytesWritten: number;
  avgLatencyUs: number;
  queueDepth: number;
  deadlineMisses: number;
}

export interface HardwareInfo {
  id: number;
  name: string;
  kind: HardwareKind;
  protocol: Protocol;
  state: HardwareState;
  firmwareVersion: string;
  dpi: number;
  maxWidthMm: number;
  maxHeightMm: number;
  supportsCmyk: boolean;
  supportsRgb: boolean;
  supportsGrayscale: boolean;
  colorChannels: number;
}

export interface HardwareStats {
  devicesTracked: number;
  jobsSent: number;
  totalBytesSent: number;
  avgJobLatencyMs: number;
  errors: number;
}

// ── Telemetry & degradation types ────────────────────────────────────────────

/** One sensor reading on a device. */
export interface SensorSample {
  timestampMs: number;
  temperatureC: number;
  voltageV: number;
  vibrationMmS: number;
  dutyCyclePct: number;
}

/** Input bundle for `estimateHealthIndex`. */
export interface HealthIndexParams {
  samples: SensorSample[];
}

/** Composite 0–100 health score over a telemetry window. */
export interface HealthIndexScore {
  overall: number;
  temperature: number;
  voltage: number;
  vibration: number;
  dutyCycle: number;
  status: 'good' | 'warning' | 'critical';
}

/** Two-parameter Weibull fit result. */
export interface WeibullParameters {
  beta: number;
  eta: number;
}

/** Historical health point for RUL fitting. */
export interface HealthObservation {
  operatingHours: number;
  health: number;
}

/** Remaining-useful-life forecast over a health history. */
export interface RulPrediction {
  remainingHours: number;
  optimisticHours: number;
  pessimisticHours: number;
  confidence: number;
  failureProbability30d: number;
  slopePerHour: number;
  trend: 'improving' | 'stable' | 'degrading';
}

/** Weibull-based printhead end-of-life forecast (family curve). */
export interface PrintheadLifeInfo {
  healthPercent: number;
  remainingHours: number;
  etaHours: number;
  serviceDueHours: number;
  failureProbability30d: number;
}

/** Piezo pulse-fatigue estimate for a printhead. */
export interface PrintheadLifeEstimate {
  healthIndex: number;
  fatigueExponent: number;
  pulseRatio: number;
}

/** One temperature reading in a warmup series. */
export interface ThermalShockSample {
  temperatureC: number;
  elapsedSecondsSincePrevious: number;
}

/** Thermal-shock accumulator state (dT/dt tracking). */
export interface ThermalShockState {
  accumulator: number;
  maxRateCPerMin: number;
  stressIndex: number;
}

/** Drive-voltage compensation for degraded piezo elasticity. */
export interface DriveVoltageCompensation {
  offsetV: number;
  driveVoltageV: number;
  updatedVelocityMS: number;
}

// ── Native module (loaded via N-API) ─────────────────────────────────────────
// The actual .node binary is loaded at runtime. This interface describes the API.

interface NativeBridge {
  // Geometry
  geometryVersion(): string;
  flattenBezier(p0: Point, p1: Point, p2: Point, p3: Point, tolerance: number): Point[];
  computeBoundingBox(points: Point[]): [Point, Point] | null;
  flattenPath(segments: Point[], tolerance: number): Point[];
  simplifyPolyline(points: Point[], tolerance: number): Point[];
  polygonArea(points: Point[]): number;
  pointInPolygon(px: number, py: number, polygon: Point[]): boolean;
  convexHull(points: Point[]): Point[];

  // Boolean
  booleanVersion(): string;
  booleanOperation(subject: Point[], clip: Point[], operation: string): Point[][];
  rectPolygon(x: number, y: number, w: number, h: number): Point[];
  circlePolygon(cx: number, cy: number, radius: number, segments: number): Point[];

  // Offset
  offsetVersion(): string;
  offsetPolygon(points: Point[], distance: number, joinStyle: string, tolerance: number): Point[] | Point[][];
  strokeToFill(points: Point[], width: number, capStyle: string, tolerance: number): Point[][];

  // TruePath
  truepathVersion(): string;
  optimizeCutPath(segments: Segment[], config?: CutConfig): CutJob | { error: string };
  exportHpgl2(segments: Segment[], config?: CutConfig): { hpgl2: string } | { error: string };
  exportGpgl(segments: Segment[], config?: CutConfig): { gpgl: string } | { error: string };

  // PlotVision
  plotvisionVersion(): string;
  detectMarks(pixels: number[], width: number, height: number, markType: string, threshold: number): DetectedMark[];
  applyHomography(x: number, y: number, matrix: number[]): Point;
  computeHomography(src: Point[], dst: Point[]): number[] | null;
  undistortPoint(x: number, y: number, k1: number, k2: number, cx: number, cy: number): Point;
  traceContours(pixels: number[], width: number, height: number, threshold: number): Contour[];

  // Color
  colorVersion(): string;
  deltaE2000(l1: number, a1: number, b1: number, l2: number, a2: number, b2: number): number;
  deltaE1976(l1: number, a1: number, b1: number, l2: number, a2: number, b2: number): number;
  srgbToLab(r: number, g: number, b: number): [number, number, number];
  labToSrgb(l: number, a: number, b: number): [number, number, number];
  mapToGamut(l: number, a: number, b: number, intent: string): [number, number, number];
  nearestSpotColor(l: number, a: number, b: number, library: string): SpotColor;
  parseIccHeader(data: number[]): IccProfile | { error: string };
  inferSpectralFromRgb(pixels: number[], substrateReflectance?: number, inkDensityTarget?: number, illuminant?: string): unknown;
  verifyG7Neutrality(npdc: [number, number][]): [boolean, number];

  // Telemetry & degradation
  estimateHealthIndex(samples: SensorSample[]): HealthIndexScore | null;
  fitWeibullCurve(lifetimes: number[]): WeibullParameters | null;
  predictRemainingLife(history: HealthObservation[], currentHealth: number, currentOperatingHours: number, designLifeHours: number): RulPrediction;
  predictPrintheadLife(headFamily: string, usageHours: number, dropoutRatio: number, temperatureC: number): PrintheadLifeInfo | null;
  piezoPulseFatigueIndex(headFamily: string, totalPulses: number, thermalDeltaSumC: number, driveVoltageV?: number, initialHealth?: number): PrintheadLifeEstimate | null;
  thermalShockAccumulator(samples: ThermalShockSample[], initialAccumulator?: number): ThermalShockState;
  driveVoltageOffset(elasticity: number, measuredVelocityMS: number, targetVelocityMS: number): DriveVoltageCompensation;

  // Batch
  engineVersions(): EngineVersions;
}

// ── Lazy loader ──────────────────────────────────────────────────────────────
let _native: NativeBridge | null = null;

function loadNative(): NativeBridge {
  if (!_native) {
    try {
      // The .node file is built by napi-rs during `cargo build`
      // Path varies by platform: titan_engine_bridge.win32-x64-msvc.node
      const platform = process.platform;
      const suffix = platform === 'win32' ? '.win32-x64-msvc.node' :
                     platform === 'darwin' ? '.darwin-arm64.node' :
                     '.linux-x64-gnu.node';
      _native = require(`../../engines/titan-engine-bridge/titan_engine_bridge${suffix}`) as NativeBridge;
    } catch {
      // Fallback: try the standard napi-rs loading pattern
      try {
        _native = require('@titan/engine-bridge') as NativeBridge;
      } catch {
        throw new Error(
          'Failed to load titan-engine-bridge native module. '
          + 'Run `cargo build -p titan-engine-bridge --release` first.',
        );
      }
    }
  }
  return _native;
}

// ── Typed API namespaces ─────────────────────────────────────────────────────

/** Geometry engine — vector math, bounding boxes, point-in-polygon */
export const geometry = {
  version: () => loadNative().geometryVersion(),
  flattenBezier: (p0: Point, p1: Point, p2: Point, p3: Point, tolerance = 0.5) =>
    loadNative().flattenBezier(p0, p1, p2, p3, tolerance),
  boundingBox: (points: Point[]) => loadNative().computeBoundingBox(points),
  flattenPath: (points: Point[], tolerance = 0.5) => loadNative().flattenPath(points, tolerance),
  simplify: (points: Point[], tolerance = 0.5) => loadNative().simplifyPolyline(points, tolerance),
  area: (polygon: Point[]) => loadNative().polygonArea(polygon),
  pointInPolygon: (p: Point, polygon: Point[]) => loadNative().pointInPolygon(p.x, p.y, polygon),
  convexHull: (points: Point[]) => loadNative().convexHull(points),
};

/** Boolean engine — union, subtract, intersect, xor on polygons */
export const boolean = {
  version: () => loadNative().booleanVersion(),
  op: (subject: Point[], clip: Point[], operation: 'union' | 'subtract' | 'intersect' | 'xor') =>
    loadNative().booleanOperation(subject, clip, operation),
  rect: (x: number, y: number, w: number, h: number) => loadNative().rectPolygon(x, y, w, h),
  circle: (cx: number, cy: number, radius: number, segments = 64) =>
    loadNative().circlePolygon(cx, cy, radius, segments),
};

/** Offset engine — stroke-to-fill, polygon offsetting */
export const offset = {
  version: () => loadNative().offsetVersion(),
  polygon: (points: Point[], distance: number, joinStyle: 'miter' | 'round' | 'bevel' = 'miter', tolerance = 0.5) =>
    loadNative().offsetPolygon(points, distance, joinStyle, tolerance),
  strokeToFill: (points: Point[], width: number, capStyle: 'butt' | 'round' | 'square' = 'butt', tolerance = 0.5) =>
    loadNative().strokeToFill(points, width, capStyle, tolerance),
};

/** TruePath engine — full 7-step cut path optimization pipeline */
export const truepath = {
  version: () => loadNative().truepathVersion(),
  optimize: (segments: Segment[], config?: CutConfig) =>
    loadNative().optimizeCutPath(segments, config),
  exportHpgl2: (segments: Segment[], config?: CutConfig) =>
    loadNative().exportHpgl2(segments, config),
  exportGpgl: (segments: Segment[], config?: CutConfig) =>
    loadNative().exportGpgl(segments, config),
};

/** PlotVision engine — mark detection, contour tracing, homography */
export const plotvision = {
  version: () => loadNative().plotvisionVersion(),
  detectMarks: (pixels: number[], width: number, height: number, markType: 'cross' | 'circle' | 'triangle' | 'diamond' = 'cross', threshold = 0.5) =>
    loadNative().detectMarks(pixels, width, height, markType, threshold),
  applyHomography: (p: Point, matrix: number[]) => loadNative().applyHomography(p.x, p.y, matrix),
  computeHomography: (src: Point[], dst: Point[]) => loadNative().computeHomography(src, dst),
  undistortPoint: (p: Point, k1: number, k2: number, cx: number, cy: number) =>
    loadNative().undistortPoint(p.x, p.y, k1, k2, cx, cy),
  traceContours: (pixels: number[], width: number, height: number, threshold = 128) =>
    loadNative().traceContours(pixels, width, height, threshold),
};

/** Color engine — ICC transforms, Delta-E, gamut mapping, spot colors */
export const color = {
  version: () => loadNative().colorVersion(),
  deltaE2000: (l1: number, a1: number, b1: number, l2: number, a2: number, b2: number) =>
    loadNative().deltaE2000(l1, a1, b1, l2, a2, b2),
  deltaE1976: (l1: number, a1: number, b1: number, l2: number, a2: number, b2: number) =>
    loadNative().deltaE1976(l1, a1, b1, l2, a2, b2),
  srgbToLab: (r: number, g: number, b: number) => loadNative().srgbToLab(r, g, b),
  labToSrgb: (l: number, a: number, b: number) => loadNative().labToSrgb(l, a, b),
  mapToGamut: (l: number, a: number, b: number, intent: 'perceptual' | 'relative' | 'saturation' | 'absolute' = 'perceptual') =>
    loadNative().mapToGamut(l, a, b, intent),
  nearestSpotColor: (l: number, a: number, b: number, library: 'pantone' | 'hks' = 'pantone') =>
    loadNative().nearestSpotColor(l, a, b, library),
  parseIccHeader: (data: number[]) => loadNative().parseIccHeader(data),
  inferSpectralFromRgb: (pixels: number[], substrateReflectance?: number, inkDensityTarget?: number, illuminant?: string) =>
    loadNative().inferSpectralFromRgb(pixels, substrateReflectance, inkDensityTarget, illuminant),
  verifyG7: (npdc: [number, number][]) => loadNative().verifyG7Neutrality(npdc),
};

/** Telemetry engine — composite health, Weibull fitting, RUL, printhead life */
export const telemetry = {
  version: () => '0.1.0',

  /** Composite health index (0–100) over a telemetry window. */
  estimateHealthIndex: (params: HealthIndexParams): number =>
    loadNative().estimateHealthIndex(params.samples)?.overall ?? 0,

  /** Maximum-likelihood Weibull fit over observed lifetimes. */
  fitWeibullCurve: (data: number[]): WeibullParameters =>
    loadNative().fitWeibullCurve(data) ?? { beta: 0, eta: 0 },

  /** Full-featured RUL forecast when operating-hours metadata is available. */
  rul: (
    history: HealthObservation[],
    currentHealth: number,
    currentOperatingHours: number,
    designLifeHours: number,
  ): RulPrediction =>
    loadNative().predictRemainingLife(history, currentHealth, currentOperatingHours, designLifeHours),

  /** RUL forecast from a health series alone; operating hours drive the fit. */
  predictRemainingLife: (data: HealthObservation[]): RulPrediction => {
    const last = data[data.length - 1];
    const currentHealth = last?.health ?? 100;
    const currentOperatingHours = last?.operatingHours ?? 0;
    const maxHours = data.reduce((m, o) => Math.max(m, o.operatingHours), 0);
    const designLifeHours = Math.max(2000, maxHours * 2);
    return loadNative().predictRemainingLife(data, currentHealth, currentOperatingHours, designLifeHours);
  },

  /** Weibull-family printhead forecast for the given head family. */
  predictPrintheadLifeInfo: (
    headFamily: 'eco-solvent' | 'latex' | 'uv',
    usageHours: number,
    dropoutRatio = 0,
    temperatureC = 25,
  ): PrintheadLifeInfo | null =>
    loadNative().predictPrintheadLife(headFamily, usageHours, dropoutRatio, temperatureC),

  /** Piezo pulse-fatigue estimate:
   * `H = H₀·exp(−[α(N/N_max)² + β·ΣΔT + γ·P])` at nominal drive. */
  predictPrintheadLife: (pulses: number, thermalDelta: number): PrintheadLifeEstimate =>
    loadNative().piezoPulseFatigueIndex('eco-solvent', pulses, thermalDelta) ??
    { healthIndex: 0, fatigueExponent: 0, pulseRatio: 0 },

  /** Piezo pulse-fatigue index for an explicit head family / conditions. */
  piezoPulseFatigueIndex: (
    headFamily: 'eco-solvent' | 'latex' | 'uv',
    totalPulses: number,
    thermalDeltaSumC: number,
    driveVoltageV?: number,
    initialHealth?: number,
  ): PrintheadLifeEstimate | null =>
    loadNative().piezoPulseFatigueIndex(headFamily, totalPulses, thermalDeltaSumC, driveVoltageV, initialHealth),

  /** Thermal-shock accumulator over a warmup temperature series (dT/dt). */
  thermalShockAccumulator: (samples: ThermalShockSample[], initialAccumulator?: number): ThermalShockState =>
    loadNative().thermalShockAccumulator(samples, initialAccumulator),

  /** Drive-voltage boost to hold target drop velocity at degraded elasticity. */
  driveVoltageOffset: (
    elasticity: number,
    measuredVelocityMS: number,
    targetVelocityMS: number,
  ): DriveVoltageCompensation =>
    loadNative().driveVoltageOffset(elasticity, measuredVelocityMS, targetVelocityMS),
};

/** Kernel engine — GPU acceleration, zero-copy memory, real-time I/O, hardware */
export const kernel = {
  version: () => '0.1.0',

  // GPU
  gpuInfo: (): GpuDeviceInfo => ({
    name: 'CPU Fallback', backend: 'cpu', vramBytes: Number.MAX_SAFE_INTEGER,
    computeUnits: 1, maxTextureDim: 16384, supportsCompute: true, supportsTransfer: true,
  }),

  // Memory
  memStats: (): MemoryStats => ({
    regionsAllocated: 0, totalAllocated: 0, totalCapacity: 1024 * 1024,
    ringBuffers: 0, fragmentationRatio: 0,
  }),

  // I/O
  ioStats: (): IoStats => ({
    totalRequests: 0, completed: 0, failed: 0, bytesRead: 0, bytesWritten: 0,
    avgLatencyUs: 0, queueDepth: 0, deadlineMisses: 0,
  }),

  // Hardware
  hwStats: (): HardwareStats => ({
    devicesTracked: 0, jobsSent: 0, totalBytesSent: 0, avgJobLatencyMs: 0, errors: 0,
  }),
};

/** Get all engine versions */
export const versions = (): EngineVersions => loadNative().engineVersions();

// Re-export types (aliases only — originals already exported above)
export type {
  Point as GeoPoint,
  Segment as GeoSegment,
  SpotColor as SpotColorMatch,
  IccProfile as IccProfileInfo,
  EngineVersions as VersionInfo,
};
