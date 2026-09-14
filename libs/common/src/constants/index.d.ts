export declare const TITAN_VERSION: '0.1.1';
export declare const TITAN_API_VERSION: 'v1';
export declare const TITAN_MIN_LICENSE_VERSION: '0.1.0';
export { HEALTH_CHECK_PORT_OFFSET, SERVICE_PORTS, getHealthCheckPort } from './ports.js';
export type { ServiceName } from './ports.js';
export declare const SUPPORTED_PRINT_FORMATS: readonly ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff'];
export declare const SUPPORTED_CUT_FORMATS: readonly ['image/svg+xml', 'application/postscript', 'application/illustrator', 'application/dxf', 'application/pdf'];
export declare const SUPPORTED_FILE_FORMATS: readonly ["application/pdf", "image/jpeg", "image/png", "image/tiff", "image/svg+xml", "application/postscript", "application/illustrator", "application/dxf", "application/pdf"];
export type SupportedFileFormat = (typeof SUPPORTED_FILE_FORMATS)[number];
/** Maximum file size accepted by Import Authority (1 GB) */
export declare const MAX_JOB_SIZE_BYTES = 1073741824;
/** Maximum number of vector nodes before Import Authority flags complexity */
export declare const MAX_PATH_NODE_COUNT = 500000;
/** Minimum feature size in mm (below this, geometry authority warns) */
export declare const MIN_FEATURE_SIZE_MM = 0.3;
export declare const DEFAULT_JOB_PRIORITY: 'normal';
export declare const JOB_UNDO_STACK_DEPTH = 50;
export declare const MAX_CONCURRENT_RIP_JOBS = 4;
export declare const DEVICE_POLL_INTERVAL_MS = 5000;
export declare const DEVICE_TELEMETRY_INTERVAL_MS = 500;
export declare const DEVICE_RECONNECT_DELAY_MS = 3000;
export declare const DEVICE_MAX_RECONNECT_ATTEMPTS = 5;
export declare const GRPC_MAX_MESSAGE_BYTES: number;
export declare const REST_REQUEST_TIMEOUT_MS = 30000;
export declare const WS_PING_INTERVAL_MS = 30000;
export declare const WS_RECONNECT_DELAY_MS = 2000;
export declare const API_RATE_LIMIT_STANDARD = 60;
export declare const API_RATE_LIMIT_ENTERPRISE = 600;
export declare const ACCESS_TOKEN_TTL_SECONDS = 900;
export declare const REFRESH_TOKEN_TTL_SECONDS = 604800;
export declare const LICENSE_CHECK_INTERVAL_MS = 3600000;
export declare const CLOUD_SYNC_INTERVAL_MS = 30000;
export declare const CLOUD_SYNC_MAX_BATCH_SIZE = 50;
export declare const UPDATE_CHANNELS: readonly ['stable', 'beta', 'canary'];
export type UpdateChannel = (typeof UPDATE_CHANNELS)[number];
export declare const DEFAULT_BLADE_OFFSET_MM = 0.25;
export declare const DEFAULT_OVERCUT_MM = 0.5;
export declare const DEFAULT_CORNER_ANGLE_THRESHOLD_DEG = 20;
export declare const DEFAULT_NESTING_MARGIN_MM = 3;
export declare const NESTING_ROTATIONS: readonly [0, 90, 180, 270];
export declare const LOG_RETENTION_DAYS = 30;
export declare const LOG_COMPRESS_AFTER_DAYS = 7;
export declare const G7_DELTA_E_PASS_THRESHOLD = 2;
export declare const FOGRA39_DELTA_E_PASS_THRESHOLD = 2;
/** Legacy 31-band spectral wavelengths (400–700nm at 10nm). Deprecated: use SPECTRAL_WAVELENGTHS_36NM. */
export declare const SPECTRAL_WAVELENGTHS_NM: readonly [400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700];
/** Standard 36-band spectral wavelengths (380–730nm at 10nm). Primary spectral resolution. */
export declare const SPECTRAL_WAVELENGTHS_36NM: readonly [380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730];
export declare const FEATURES: {
    readonly CLOUD_SYNC: boolean;
    readonly MOBILE_SYNC: boolean;
    readonly PRODUCTION_INTEL: boolean;
    readonly PLOTVISION: boolean;
    readonly COLORVISION: boolean;
};
//# sourceMappingURL=index.d.ts.map