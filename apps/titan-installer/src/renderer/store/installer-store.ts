// ─────────────────────────────────────────────────────────────────────────────
// Titan Installer — Zustand Store
// ─────────────────────────────────────────────────────────────────────────────
import { create } from 'zustand';

// ── Types ────────────────────────────────────────────────────────────────────
export type WizardStep =
  | 'welcome'
  | 'components'
  | 'system-check'
  | 'install-location'
  | 'license'
  | 'device-discovery'
  | 'service-setup'
  | 'installing'
  | 'complete';

export interface Component {
  id: string;
  name: string;
  description: string;
  version: string;
  sizeBytes: number;
  required: boolean;
  selected: boolean;
  category: string;
}

export interface SystemCheckResult {
  platform: string;
  arch: string;
  osVersion: string;
  osRelease: string;
  totalMemoryGB: number;
  freeMemoryGB: number;
  cpuCores: number;
  cpuModel: string;
  diskSpaceGB: number;
  diskFreeGB: number;
  passes: boolean;
  issues: string[];
  warnings: string[];
}

export interface Device {
  id: string;
  name: string;
  vendor: string;
  model: string;
  type: string;
  protocol: string;
  address: string;
  status: string;
}

export interface InstallProgress {
  componentId: string;
  componentName: string;
  phase: string;
  progressPercent: number;
  bytesDownloaded: number;
  totalBytes: number;
  error?: string;
}

// ── Store ────────────────────────────────────────────────────────────────────
interface InstallerState {
  // Wizard
  currentStep: WizardStep;
  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Components
  components: Component[];
  setComponents: (components: Component[]) => void;
  toggleComponent: (id: string) => void;
  totalSizeBytes: () => number;

  // System
  systemCheck: SystemCheckResult | null;
  setSystemCheck: (check: SystemCheckResult) => void;

  // Install location
  installDir: string;
  setInstallDir: (dir: string) => void;

  // License
  licenseKey: string;
  setLicenseKey: (key: string) => void;
  licenseValid: boolean;
  setLicenseValid: (valid: boolean) => void;

  // Devices
  discoveredDevices: Device[];
  setDiscoveredDevices: (devices: Device[]) => void;

  // Install progress
  installProgress: InstallProgress[];
  addProgress: (progress: InstallProgress) => void;
  installComplete: boolean;
  installSuccess: boolean;
  installErrors: string[];
  setInstallComplete: (success: boolean, errors: string[]) => void;

  // CLI flags
  isSilent: boolean;
  setIsSilent: (silent: boolean) => void;
}

const WIZARD_ORDER: WizardStep[] = [
  'welcome', 'components', 'system-check', 'install-location',
  'license', 'device-discovery', 'service-setup', 'installing', 'complete',
];

export const useInstallerStore = create<InstallerState>((set, get) => ({
  currentStep: 'welcome',
  setStep: (currentStep) => set({ currentStep }),
  nextStep: () => {
    const idx = WIZARD_ORDER.indexOf(get().currentStep);
    if (idx < WIZARD_ORDER.length - 1) set({ currentStep: WIZARD_ORDER[idx + 1]! });
  },
  prevStep: () => {
    const idx = WIZARD_ORDER.indexOf(get().currentStep);
    if (idx > 0) set({ currentStep: WIZARD_ORDER[idx - 1]! });
  },

  components: [],
  setComponents: (components) => set({ components }),
  toggleComponent: (id) => {
    const components = get().components.map(c =>
      c.id === id && !c.required ? { ...c, selected: !c.selected } : c,
    );
    set({ components });
  },
  totalSizeBytes: () => get().components.filter(c => c.selected).reduce((s, c) => s + c.sizeBytes, 0),

  systemCheck: null,
  setSystemCheck: (systemCheck) => set({ systemCheck }),

  installDir: '',
  setInstallDir: (installDir) => set({ installDir }),

  licenseKey: '',
  setLicenseKey: (licenseKey) => set({ licenseKey }),
  licenseValid: false,
  setLicenseValid: (licenseValid) => set({ licenseValid }),

  discoveredDevices: [],
  setDiscoveredDevices: (discoveredDevices) => set({ discoveredDevices }),

  installProgress: [],
  addProgress: (progress) => {
    const existing = get().installProgress.filter(p => p.componentId !== progress.componentId);
    set({ installProgress: [...existing, progress] });
  },
  installComplete: false,
  installSuccess: false,
  installErrors: [],
  setInstallComplete: (installSuccess, installErrors) => set({ installComplete: true, installSuccess, installErrors }),

  isSilent: false,
  setIsSilent: (isSilent) => set({ isSilent }),
}));
