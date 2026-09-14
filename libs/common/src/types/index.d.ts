export type UUID = string;
export type ULID = string;
export type ISODateString = string;
export type UserRole = 'operator' | 'supervisor' | 'admin';
export interface User {
    id: UUID;
    email: string;
    name: string;
    avatarUrl?: string;
    role: UserRole;
    createdAt: ISODateString;
    updatedAt: ISODateString;
}
export interface Session {
    id: UUID;
    userId: UUID;
    accessToken: string;
    refreshToken: string;
    expiresAt: ISODateString;
    createdAt: ISODateString;
}
export type JobStatus = 'draft' | 'queued' | 'preflight' | 'ripping' | 'printing' | 'cutting' | 'completed' | 'failed' | 'cancelled';
export type JobType = 'print' | 'cut' | 'print-and-cut';
export type JobPriority = 'low' | 'normal' | 'high' | 'urgent';
export interface JobAsset {
    id: ULID;
    jobId: ULID;
    filename: string;
    filePath: string;
    contentType: string;
    sizeBytes: number;
    checksum: string;
}
export interface JobCost {
    materialCostCents: number;
    inkCostCents: number;
    labourCostCents: number;
    totalCostCents: number;
    currency: string;
}
export interface Job {
    id: ULID;
    title: string;
    status: JobStatus;
    type: JobType;
    deviceId?: string;
    presetId?: string;
    priority: JobPriority;
    assets: JobAsset[];
    metadata: Record<string, string>;
    cost?: JobCost;
    progressPercent?: number;
    errorMessage?: string;
    createdAt: ISODateString;
    updatedAt: ISODateString;
    startedAt?: ISODateString;
    completedAt?: ISODateString;
}
export type DeviceType = 'printer' | 'cutter' | 'print-and-cut' | 'spectrophotometer';
export type DeviceProtocol = 'usb' | 'ethernet' | 'wifi';
export type DeviceState = 'idle' | 'busy' | 'error' | 'offline' | 'warming-up';
export interface InkLevel {
    channel: string;
    color: string;
    percentRemaining: number;
}
export interface DeviceStatus {
    state: DeviceState;
    inkLevels: InkLevel[];
    currentJobId?: string;
    jobProgress?: number;
    errorCodes: string[];
    headTemperatureCelsius?: number;
    updatedAt: ISODateString;
}
export interface DeviceCapabilities {
    maxWidthMm: number;
    maxLengthMm?: number;
    colorChannels: string[];
    maxDpi: number;
    supportsCut: boolean;
    supportsPrint: boolean;
}
export interface Device {
    id: string;
    name: string;
    vendor: string;
    model: string;
    type: DeviceType;
    protocol: DeviceProtocol;
    address: string;
    driverVersion?: string;
    status: DeviceStatus;
    capabilities: DeviceCapabilities;
    createdAt: ISODateString;
    updatedAt: ISODateString;
}
export type ColorProfileType = 'icc' | 'devicelink' | 'abstract';
export type RenderingIntent = 'perceptual' | 'relative-colorimetric' | 'saturation' | 'absolute-colorimetric';
export interface ColorProfile {
    id: ULID;
    name: string;
    type: ColorProfileType;
    deviceId?: string;
    filePath: string;
    colorSpace: string;
    channels: number;
    renderingIntent: RenderingIntent;
    checksum: string;
    createdAt: ISODateString;
}
export type FontFormat = 'otf' | 'ttf' | 'woff2' | 'type1';
export type FontEmbeddingPermission = 'installable' | 'editable' | 'print-and-preview' | 'restricted';
export interface FontInfo {
    id: ULID;
    family: string;
    style: string;
    weight: number;
    format: FontFormat;
    filePath: string;
    checksum: string;
    embeddingPermission: FontEmbeddingPermission;
    isActivated: boolean;
}
export interface FontReference {
    family: string;
    style: string;
    weight: number;
    filePath?: string;
}
export interface FontValidation {
    valid: boolean;
    embeddingPermission: FontEmbeddingPermission;
    issues: string[];
}
export interface MissingFontReport {
    missing: FontReference[];
    totalChecked: number;
}
export interface SubstituteMatch {
    family: string;
    style: string;
    weight: number;
    similarity: number;
    filePath: string;
}
export type LicenseType = 'trial' | 'standard' | 'professional' | 'enterprise';
export interface License {
    id: ULID;
    type: LicenseType;
    seats: number;
    activations: number;
    features: string[];
    expiresAt: ISODateString;
    isValid: boolean;
    issuedAt: ISODateString;
}
export interface Substrate {
    id: ULID;
    name: string;
    type: string;
    widthMm: number;
    lengthMm?: number;
    costPerSqMeterCents: number;
    colorProfileId?: ULID;
    notes?: string;
}
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}
export interface ValidationError {
    field: string;
    message: string;
    code: string;
}
export interface ApiError {
    code: string;
    message: string;
    statusCode: number;
    errors?: ValidationError[];
}
export interface JobEvent {
    type: 'job:created' | 'job:updated' | 'job:completed' | 'job:failed' | 'job:cancelled';
    jobId: ULID;
    timestamp: ISODateString;
    data?: Partial<Job>;
}
export interface DeviceEvent {
    type: 'device:connected' | 'device:disconnected' | 'device:status-changed' | 'device:error';
    deviceId: string;
    timestamp: ISODateString;
    data?: Partial<DeviceStatus>;
}
export type TitanEvent = JobEvent | DeviceEvent;
//# sourceMappingURL=index.d.ts.map