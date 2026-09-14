// Consolidated @titan/common mock for test suites across all services.
// Single source of truth — keep in sync with libs/common/src/index.ts exports.

import crypto from 'crypto';

export function createLogger(_name: string) {
  return {
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {},
    trace: () => {},
  };
}

export function generateId(): string {
  return `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function now(): string {
  return new Date().toISOString();
}

export function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function isExpired(isoDate: string): boolean {
  return new Date(isoDate) < new Date();
}

export type LicenseType = 'trial' | 'standard' | 'professional' | 'enterprise';

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function sha256(data: string | Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export const TITAN_VERSION = '0.1.0';

export const SERVICE_PORTS = {
  TITANFLOW: 50060,
  DEVICESYNC: 50050,
  COLORVISION: 50070,
  PRODUCTION_INTEL: 50080,
  TITANSTUDIO: 50090,
  TITANLINK: 50100,
  TITANDAEMON: 50071,
  TRUEPATH: 50110,
  PLOTVISION: 50120,
  FONTSRV: 50130,
  SYNCTRACE: 50140,
  UPDATER: 50150,
  CERT_SRV: 50061,
};

export type JobPriority = 'low' | 'normal' | 'high' | 'urgent';

export const G7_DELTA_E_PASS_THRESHOLD = 2.0;

export const LOG_RETENTION_DAYS = 30;
export const LOG_COMPRESS_AFTER_DAYS = 7;

export const UPDATE_CHANNELS = ['stable', 'beta', 'canary'] as const;
export type UpdateChannel = (typeof UPDATE_CHANNELS)[number];

export const DEFAULT_BLADE_OFFSET_MM = 0.25;
export const DEFAULT_OVERCUT_MM = 0.5;

export const JOB_UNDO_STACK_DEPTH = 50;

export const telemetry = {
  version: () => '0.1.0',

  estimateHealthIndex: (params: { samples: Array<{ temperatureC?: number; dutyCyclePct?: number; vibrationMmS?: number; voltageV?: number }> }) => {
    const samples = params.samples;
    if (samples.length === 0) return 100;
    let sum = 0;
    for (const s of samples) {
      let score = 100;
      score -= s.voltageV && s.voltageV < 20 ? (20 - s.voltageV) * 2 : 0;
      score -= s.temperatureC && s.temperatureC > 45 ? (s.temperatureC - 45) * 2 : 0;
      score -= s.vibrationMmS && s.vibrationMmS > 0.5 ? (s.vibrationMmS - 0.5) * 40 : 0;
      score -= s.dutyCyclePct && s.dutyCyclePct > 95 ? (s.dutyCyclePct - 95) : 0;
      sum += Math.max(0, Math.min(100, score));
    }
    return sum / samples.length;
  },

  fitWeibullCurve: () => ({ beta: 2, eta: 4000 }),

  rul: () => ({
    remainingHours: 2000,
    optimisticHours: 2200,
    pessimisticHours: 1500,
    confidence: 0.8,
    failureProbability30d: 4.2,
    slopePerHour: -0.02,
    trend: 'degrading',
  }),

  predictRemainingLife: () => ({
    remainingHours: 2000,
    optimisticHours: 2200,
    pessimisticHours: 1500,
    confidence: 0.8,
    failureProbability30d: 4.2,
    slopePerHour: -0.02,
    trend: 'degrading',
  }),

  predictPrintheadLifeInfo: () => ({
    healthPercent: 85,
    remainingHours: 1200,
    etaHours: 4200,
    serviceDueHours: 1122,
    failureProbability30d: 4.0,
  }),

  predictPrintheadLife: () => ({
    healthIndex: 85,
    fatigueExponent: 0.15,
    pulseRatio: 0.02,
  }),

  piezoPulseFatigueIndex: () => ({
    healthIndex: 85,
    fatigueExponent: 0.15,
    pulseRatio: 0.02,
  }),

  thermalShockAccumulator: () => ({
    accumulator: 0,
    maxRateCPerMin: 0,
    stressIndex: 0,
  }),

  driveVoltageOffset: (elasticity: number) => ({
    offsetV: (1 / Math.max(0.15, elasticity) - 1) * 28,
    driveVoltageV: (1 / Math.max(0.15, elasticity)) * 28,
    updatedVelocityMS: 6.5,
  }),
};
