// ─────────────────────────────────────────────────────────────────────────────
// Titan Installer — Preload (Context Bridge)
// ─────────────────────────────────────────────────────────────────────────────
import { contextBridge, ipcRenderer } from 'electron';

export interface InstallerBridgeApi {
  installer: {
    getComponents: () => Promise<{ components: Array<{
      id: string; name: string; description: string; version: string;
      sizeBytes: number; required: boolean; selected: boolean; category: string;
    }> }>;
    setComponents: (selected: Record<string, boolean>) => Promise<{ components: Array<{
      id: string; name: string; description: string; version: string;
      sizeBytes: number; required: boolean; selected: boolean; category: string;
    }> }>;
    systemCheck: () => Promise<{
      platform: string; arch: string; osVersion: string; osRelease: string;
      totalMemoryGB: number; freeMemoryGB: number; cpuCores: number; cpuModel: string;
      diskSpaceGB: number; diskFreeGB: number; nodeVersion: string; electronVersion: string;
      passes: boolean; issues: string[]; warnings: string[];
    }>;
    getInstallDir: () => Promise<string>;
    setInstallDir: (dir: string) => Promise<{ installDir: string }>;
    chooseDirectory: () => Promise<{ cancelled?: boolean; path?: string }>;
    install: (opts: { installDir: string }) => Promise<{
      success: boolean; installedCount: number; errors: string[];
    }>;
    activateLicense: (opts: { licenseKey: string }) => Promise<{
      valid: boolean; licenseId: string; type: string; expiresAt: string; seats: number; error?: string;
    }>;
    skipLicense: () => Promise<{ valid: boolean; type: string; licenseId: string; expiresAt: null; seats: number }>;
    discoverDevices: () => Promise<{ devices: Array<{
      id: string; name: string; vendor: string; model: string; type: string;
      protocol: string; address: string; status: string;
    }> }>;
    configureDevice: (opts: { deviceId: string; settings: Record<string, unknown> }) => Promise<{ success: boolean }>;
    setupService: (opts: { installDir: string }) => Promise<{
      success: boolean; serviceInstalled: boolean; serviceRunning: boolean; error?: string;
    }>;
    getCliFlags: () => Promise<{
      silent: boolean; installDir: string | null; licenseKey: string | null;
      noServices: boolean; components: string[] | null; isElevated: boolean;
    }>;
    onProgress: (callback: (progress: {
      componentId: string; componentName: string; phase: string;
      progressPercent: number; bytesDownloaded: number; totalBytes: number; error?: string;
    }) => void) => void;
  };
  system: {
    getInfo: () => Promise<{ version: string; platform: string; arch: string }>;
    openExternal: (url: string) => Promise<void>;
  };
  window: {
    close: () => Promise<void>;
  };
}

const api: InstallerBridgeApi = {
  installer: {
    getComponents: () => ipcRenderer.invoke('installer:get-components'),
    setComponents: (selected) => ipcRenderer.invoke('installer:set-components', selected),
    systemCheck: () => ipcRenderer.invoke('installer:system-check'),
    getInstallDir: () => ipcRenderer.invoke('installer:get-install-dir'),
    setInstallDir: (dir) => ipcRenderer.invoke('installer:set-install-dir', dir),
    chooseDirectory: () => ipcRenderer.invoke('installer:choose-directory'),
    install: (opts) => ipcRenderer.invoke('installer:install', opts),
    activateLicense: (opts) => ipcRenderer.invoke('installer:activate-license', opts),
    skipLicense: () => ipcRenderer.invoke('installer:skip-license'),
    discoverDevices: () => ipcRenderer.invoke('installer:discover-devices'),
    configureDevice: (opts) => ipcRenderer.invoke('installer:configure-device', opts),
    setupService: (opts) => ipcRenderer.invoke('installer:setup-service', opts),
    getCliFlags: () => ipcRenderer.invoke('installer:get-cli-flags'),
    onProgress: (callback) => {
      ipcRenderer.on('installer:progress', (_event, progress) => callback(progress));
    },
  },
  system: {
    getInfo: () => ipcRenderer.invoke('system:get-info'),
    openExternal: (url) => ipcRenderer.invoke('system:open-external', url),
  },
  window: {
    close: () => ipcRenderer.invoke('window:close'),
  },
};

contextBridge.exposeInMainWorld('installer', api);
