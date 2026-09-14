// ─────────────────────────────────────────────────────────────────────────────
// Titan Production Suite — Global Constants
// ─────────────────────────────────────────────────────────────────────────────

// ── Version ───────────────────────────────────────────────────────────────────
export const TITAN_VERSION = '0.1.1' as const;
export const TITAN_API_VERSION = 'v1' as const;
export const TITAN_MIN_LICENSE_VERSION = '0.1.0' as const;

// ── Service ports (local gRPC) ───────────────────────────────────────────────
export { HEALTH_CHECK_PORT_OFFSET, SERVICE_PORTS, getHealthCheckPort } from './ports.js';
export type { ServiceName } from './ports.js';

// ── File formats ──────────────────────────────────────────────────────────────
export const SUPPORTED_PRINT_FORMATS = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/tiff',
] as const;

export const SUPPORTED_CUT_FORMATS = [
  'image/svg+xml',
  'application/postscript',         // EPS
  'application/illustrator',        // AI
  'application/dxf',
  'application/pdf',
] as const;

export const SUPPORTED_FILE_FORMATS = [
  ...SUPPORTED_PRINT_FORMATS,
  ...SUPPORTED_CUT_FORMATS,
] as const;

export type SupportedFileFormat = (typeof SUPPORTED_FILE_FORMATS)[number];

// ── File limits ───────────────────────────────────────────────────────────────
/** Maximum file size accepted by Import Authority (1 GB) */
export const MAX_JOB_SIZE_BYTES = 1_073_741_824;

/** Maximum number of vector nodes before Import Authority flags complexity */
export const MAX_PATH_NODE_COUNT = 500_000;

/** Minimum feature size in mm (below this, geometry authority warns) */
export const MIN_FEATURE_SIZE_MM = 0.3;

// ── Job settings ──────────────────────────────────────────────────────────────
export const DEFAULT_JOB_PRIORITY = 'normal' as const;
export const JOB_UNDO_STACK_DEPTH = 50;
export const MAX_CONCURRENT_RIP_JOBS = 4;

// ── Device settings ───────────────────────────────────────────────────────────
export const DEVICE_POLL_INTERVAL_MS = 5_000;
export const DEVICE_TELEMETRY_INTERVAL_MS = 500;
export const DEVICE_RECONNECT_DELAY_MS = 3_000;
export const DEVICE_MAX_RECONNECT_ATTEMPTS = 5;

// ── Network / API ─────────────────────────────────────────────────────────────
export const GRPC_MAX_MESSAGE_BYTES = 100 * 1024 * 1024; // 100 MB
export const REST_REQUEST_TIMEOUT_MS = 30_000;
export const WS_PING_INTERVAL_MS = 30_000;
export const WS_RECONNECT_DELAY_MS = 2_000;
export const API_RATE_LIMIT_STANDARD = 60;   // requests per minute
export const API_RATE_LIMIT_ENTERPRISE = 600;

// ── Auth ──────────────────────────────────────────────────────────────────────
export const ACCESS_TOKEN_TTL_SECONDS = 900;      // 15 min
export const REFRESH_TOKEN_TTL_SECONDS = 604_800; // 7 days
export const LICENSE_CHECK_INTERVAL_MS = 3_600_000; // 1 hour

// ── Sync ──────────────────────────────────────────────────────────────────────
export const CLOUD_SYNC_INTERVAL_MS = 30_000;
export const CLOUD_SYNC_MAX_BATCH_SIZE = 50;

// ── Update channels ───────────────────────────────────────────────────────────
export const UPDATE_CHANNELS = ['stable', 'beta', 'canary'] as const;
export type UpdateChannel = (typeof UPDATE_CHANNELS)[number];

// ── TruePath defaults ─────────────────────────────────────────────────────────
export const DEFAULT_BLADE_OFFSET_MM = 0.25;
export const DEFAULT_OVERCUT_MM = 0.5;
export const DEFAULT_CORNER_ANGLE_THRESHOLD_DEG = 20;

// ── Nesting ───────────────────────────────────────────────────────────────────
export const DEFAULT_NESTING_MARGIN_MM = 3;
export const NESTING_ROTATIONS = [0, 90, 180, 270] as const;

// ── SyncTrace ─────────────────────────────────────────────────────────────────
export const LOG_RETENTION_DAYS = 30;
export const LOG_COMPRESS_AFTER_DAYS = 7;

// ── Colour ────────────────────────────────────────────────────────────────────
export const G7_DELTA_E_PASS_THRESHOLD = 2.0;
export const FOGRA39_DELTA_E_PASS_THRESHOLD = 2.0;

/** Legacy 31-band spectral wavelengths (400–700nm at 10nm). Deprecated: use SPECTRAL_WAVELENGTHS_36NM. */
export const SPECTRAL_WAVELENGTHS_NM = [400, 410, 420, 430, 440, 450, 460, 470, 480, 490,
  500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650, 660,
  670, 680, 690, 700] as const;

/** Standard 36-band spectral wavelengths (380–730nm at 10nm). Primary spectral resolution. */
export const SPECTRAL_WAVELENGTHS_36NM = [380, 390, 400, 410, 420, 430, 440, 450, 460, 470,
  480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640,
  650, 660, 670, 680, 690, 700, 710, 720, 730] as const;

// ── Feature flags (can be overridden by environment) ─────────────────────────
export const FEATURES = {
  CLOUD_SYNC:          process.env['TITAN_FEAT_CLOUD_SYNC'] !== 'false',
  MOBILE_SYNC:         process.env['TITAN_FEAT_MOBILE_SYNC'] !== 'false',
  PRODUCTION_INTEL:    process.env['TITAN_FEAT_INTEL'] !== 'false',
  PLOTVISION:          process.env['TITAN_FEAT_PLOTVISION'] !== 'false',
  COLORVISION:         process.env['TITAN_FEAT_COLORVISION'] !== 'false',
} as const;
