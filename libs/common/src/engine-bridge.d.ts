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
    lab: {
        l: number;
        a: number;
        b: number;
    };
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
/** Geometry engine — vector math, bounding boxes, point-in-polygon */
export declare const geometry: {
    version: () => string;
    flattenBezier: (p0: Point, p1: Point, p2: Point, p3: Point, tolerance?: number) => Point[];
    boundingBox: (points: Point[]) => [Point, Point] | null;
    flattenPath: (points: Point[], tolerance?: number) => Point[];
    simplify: (points: Point[], tolerance?: number) => Point[];
    area: (polygon: Point[]) => number;
    pointInPolygon: (p: Point, polygon: Point[]) => boolean;
    convexHull: (points: Point[]) => Point[];
};
/** Boolean engine — union, subtract, intersect, xor on polygons */
export declare const boolean: {
    version: () => string;
    op: (subject: Point[], clip: Point[], operation: 'union' | 'subtract' | 'intersect' | 'xor') => Point[][];
    rect: (x: number, y: number, w: number, h: number) => Point[];
    circle: (cx: number, cy: number, radius: number, segments?: number) => Point[];
};
/** Offset engine — stroke-to-fill, polygon offsetting */
export declare const offset: {
    version: () => string;
    polygon: (points: Point[], distance: number, joinStyle?: 'miter' | 'round' | 'bevel', tolerance?: number) => Point[][] | Point[];
    strokeToFill: (points: Point[], width: number, capStyle?: 'butt' | 'round' | 'square', tolerance?: number) => Point[][];
};
/** TruePath engine — full 7-step cut path optimization pipeline */
export declare const truepath: {
    version: () => string;
    optimize: (segments: Segment[], config?: CutConfig) => CutJob | {
        error: string;
    };
    exportHpgl2: (segments: Segment[], config?: CutConfig) => {
        hpgl2: string;
    } | {
        error: string;
    };
    exportGpgl: (segments: Segment[], config?: CutConfig) => {
        gpgl: string;
    } | {
        error: string;
    };
};
/** PlotVision engine — mark detection, contour tracing, homography */
export declare const plotvision: {
    version: () => string;
    detectMarks: (pixels: number[], width: number, height: number, markType?: 'cross' | 'circle' | 'triangle' | 'diamond', threshold?: number) => DetectedMark[];
    applyHomography: (p: Point, matrix: number[]) => Point;
    computeHomography: (src: Point[], dst: Point[]) => number[] | null;
    undistortPoint: (p: Point, k1: number, k2: number, cx: number, cy: number) => Point;
    traceContours: (pixels: number[], width: number, height: number, threshold?: number) => Contour[];
};
/** Color engine — ICC transforms, Delta-E, gamut mapping, spot colors */
export declare const color: {
    version: () => string;
    deltaE2000: (l1: number, a1: number, b1: number, l2: number, a2: number, b2: number) => number;
    deltaE1976: (l1: number, a1: number, b1: number, l2: number, a2: number, b2: number) => number;
    srgbToLab: (r: number, g: number, b: number) => [number, number, number];
    labToSrgb: (l: number, a: number, b: number) => [number, number, number];
    mapToGamut: (l: number, a: number, b: number, intent?: 'perceptual' | 'relative' | 'saturation' | 'absolute') => [number, number, number];
    nearestSpotColor: (l: number, a: number, b: number, library?: 'pantone' | 'hks') => SpotColor;
    parseIccHeader: (data: number[]) => IccProfile | {
        error: string;
    };
    verifyG7: (npdc: [number, number][]) => [boolean, number];
};
/** Kernel engine — GPU acceleration, zero-copy memory, real-time I/O, hardware */
export declare const kernel: {
    version: () => string;
    gpuInfo: () => GpuDeviceInfo;
    memStats: () => MemoryStats;
    ioStats: () => IoStats;
    hwStats: () => HardwareStats;
};
/** Get all engine versions */
export declare const versions: () => EngineVersions;
export type { Point as GeoPoint, Segment as GeoSegment, SpotColor as SpotColorMatch, IccProfile as IccProfileInfo, EngineVersions as VersionInfo, };
//# sourceMappingURL=engine-bridge.d.ts.map