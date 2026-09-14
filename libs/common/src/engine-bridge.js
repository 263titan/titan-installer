// ─────────────────────────────────────────────────────────────────────────────
// Titan Engine Bridge — TypeScript Wrapper
// Typed interface for the N-API Rust engine bindings.
// Usage: import { geometry, boolean, offset, truepath, plotvision, color } from '@titan/engine-bridge';
// ─────────────────────────────────────────────────────────────────────────────
// ── Lazy loader ──────────────────────────────────────────────────────────────
let _native = null;
function loadNative() {
    if (!_native) {
        try {
            // The .node file is built by napi-rs during `cargo build`
            // Path varies by platform: titan_engine_bridge.win32-x64-msvc.node
            const platform = process.platform;
            const suffix = platform === 'win32' ? '.win32-x64-msvc.node' :
                platform === 'darwin' ? '.darwin-arm64.node' :
                    '.linux-x64-gnu.node';
            _native = require(`../../engines/titan-engine-bridge/titan_engine_bridge${suffix}`);
        }
        catch {
            // Fallback: try the standard napi-rs loading pattern
            try {
                _native = require('@titan/engine-bridge');
            }
            catch {
                throw new Error('Failed to load titan-engine-bridge native module. '
                    + 'Run `cargo build -p titan-engine-bridge --release` first.');
            }
        }
    }
    return _native;
}
// ── Typed API namespaces ─────────────────────────────────────────────────────
/** Geometry engine — vector math, bounding boxes, point-in-polygon */
export const geometry = {
    version: () => loadNative().geometryVersion(),
    flattenBezier: (p0, p1, p2, p3, tolerance = 0.5) => loadNative().flattenBezier(p0, p1, p2, p3, tolerance),
    boundingBox: (points) => loadNative().computeBoundingBox(points),
    flattenPath: (points, tolerance = 0.5) => loadNative().flattenPath(points, tolerance),
    simplify: (points, tolerance = 0.5) => loadNative().simplifyPolyline(points, tolerance),
    area: (polygon) => loadNative().polygonArea(polygon),
    pointInPolygon: (p, polygon) => loadNative().pointInPolygon(p.x, p.y, polygon),
    convexHull: (points) => loadNative().convexHull(points),
};
/** Boolean engine — union, subtract, intersect, xor on polygons */
export const boolean = {
    version: () => loadNative().booleanVersion(),
    op: (subject, clip, operation) => loadNative().booleanOperation(subject, clip, operation),
    rect: (x, y, w, h) => loadNative().rectPolygon(x, y, w, h),
    circle: (cx, cy, radius, segments = 64) => loadNative().circlePolygon(cx, cy, radius, segments),
};
/** Offset engine — stroke-to-fill, polygon offsetting */
export const offset = {
    version: () => loadNative().offsetVersion(),
    polygon: (points, distance, joinStyle = 'miter', tolerance = 0.5) => loadNative().offsetPolygon(points, distance, joinStyle, tolerance),
    strokeToFill: (points, width, capStyle = 'butt', tolerance = 0.5) => loadNative().strokeToFill(points, width, capStyle, tolerance),
};
/** TruePath engine — full 7-step cut path optimization pipeline */
export const truepath = {
    version: () => loadNative().truepathVersion(),
    optimize: (segments, config) => loadNative().optimizeCutPath(segments, config),
    exportHpgl2: (segments, config) => loadNative().exportHpgl2(segments, config),
    exportGpgl: (segments, config) => loadNative().exportGpgl(segments, config),
};
/** PlotVision engine — mark detection, contour tracing, homography */
export const plotvision = {
    version: () => loadNative().plotvisionVersion(),
    detectMarks: (pixels, width, height, markType = 'cross', threshold = 0.5) => loadNative().detectMarks(pixels, width, height, markType, threshold),
    applyHomography: (p, matrix) => loadNative().applyHomography(p.x, p.y, matrix),
    computeHomography: (src, dst) => loadNative().computeHomography(src, dst),
    undistortPoint: (p, k1, k2, cx, cy) => loadNative().undistortPoint(p.x, p.y, k1, k2, cx, cy),
    traceContours: (pixels, width, height, threshold = 128) => loadNative().traceContours(pixels, width, height, threshold),
};
/** Color engine — ICC transforms, Delta-E, gamut mapping, spot colors */
export const color = {
    version: () => loadNative().colorVersion(),
    deltaE2000: (l1, a1, b1, l2, a2, b2) => loadNative().deltaE2000(l1, a1, b1, l2, a2, b2),
    deltaE1976: (l1, a1, b1, l2, a2, b2) => loadNative().deltaE1976(l1, a1, b1, l2, a2, b2),
    srgbToLab: (r, g, b) => loadNative().srgbToLab(r, g, b),
    labToSrgb: (l, a, b) => loadNative().labToSrgb(l, a, b),
    mapToGamut: (l, a, b, intent = 'perceptual') => loadNative().mapToGamut(l, a, b, intent),
    nearestSpotColor: (l, a, b, library = 'pantone') => loadNative().nearestSpotColor(l, a, b, library),
    parseIccHeader: (data) => loadNative().parseIccHeader(data),
    verifyG7: (npdc) => loadNative().verifyG7Neutrality(npdc),
};
/** Kernel engine — GPU acceleration, zero-copy memory, real-time I/O, hardware */
export const kernel = {
    version: () => '0.1.0',
    // GPU
    gpuInfo: () => ({
        name: 'CPU Fallback', backend: 'cpu', vramBytes: Number.MAX_SAFE_INTEGER,
        computeUnits: 1, maxTextureDim: 16384, supportsCompute: true, supportsTransfer: true,
    }),
    // Memory
    memStats: () => ({
        regionsAllocated: 0, totalAllocated: 0, totalCapacity: 1024 * 1024,
        ringBuffers: 0, fragmentationRatio: 0,
    }),
    // I/O
    ioStats: () => ({
        totalRequests: 0, completed: 0, failed: 0, bytesRead: 0, bytesWritten: 0,
        avgLatencyUs: 0, queueDepth: 0, deadlineMisses: 0,
    }),
    // Hardware
    hwStats: () => ({
        devicesTracked: 0, jobsSent: 0, totalBytesSent: 0, avgJobLatencyMs: 0, errors: 0,
    }),
};
/** Get all engine versions */
export const versions = () => loadNative().engineVersions();
//# sourceMappingURL=engine-bridge.js.map