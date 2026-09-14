// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Titan Installer â€” Electron Main Process
// Custom wizard: component selection, system check, silent install, license,
// device discovery, service setup.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import {
  app, BrowserWindow, ipcMain, session, shell, dialog,
} from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import os from 'os';
import { createLogger, TITAN_VERSION } from '@titan/common';

const log = createLogger('installer:main');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// â”€â”€ Installable components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface InstallComponent {
  id: string;
  name: string;
  description: string;
  version: string;
  sizeBytes: number;
  required: boolean;
  selected: boolean;
  category: 'core' | 'service' | 'tool' | 'mobile';
}

const AVAILABLE_COMPONENTS: InstallComponent[] = [
  {
    id: 'titan-launcher', name: 'Titan Launcher',
    description: 'Central hub for all Titan apps',
    version: TITAN_VERSION, sizeBytes: 85_000_000, required: true, selected: true, category: 'core',
  },
  {
    id: 'titan-plotsync', name: 'PlotSync',
    description: 'Vector design & contour cutting',
    version: TITAN_VERSION, sizeBytes: 120_000_000, required: false, selected: true, category: 'core',
  },
  {
    id: 'titan-printsync', name: 'PrintSync',
    description: 'Professional RIP & print management',
    version: TITAN_VERSION, sizeBytes: 150_000_000, required: false, selected: true, category: 'core',
  },
  {
    id: 'titan-fontsync', name: 'FontSync',
    description: 'Font library management & cloud sync',
    version: TITAN_VERSION, sizeBytes: 45_000_000, required: false, selected: false, category: 'tool',
  },
  {
    id: 'titan-production-manager', name: 'Production Manager',
    description: 'Enterprise workflow & job tracking',
    version: TITAN_VERSION, sizeBytes: 65_000_000, required: false, selected: false, category: 'tool',
  },
  {
    id: 'titandaemon', name: 'TitanDaemon',
    description: 'Background service for device polling, auto-updates',
    version: TITAN_VERSION, sizeBytes: 30_000_000, required: true, selected: true, category: 'service',
  },
  {
    id: 'titan-cloudsync', name: 'CloudSync',
    description: 'Cloud sync & remote job submission',
    version: TITAN_VERSION, sizeBytes: 25_000_000, required: false, selected: false, category: 'service',
  },
];

// â”€â”€ System check â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface SystemCheck {
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
  nodeVersion: string;
  electronVersion: string;
  passes: boolean;
  issues: string[];
  warnings: string[];
}

function performSystemCheck(): SystemCheck {
  const issues: string[] = [];
  const warnings: string[] = [];

  const totalMemGB = Math.round(os.totalmem() / (1024 ** 3) * 10) / 10;
  const freeMemGB = Math.round(os.freemem() / (1024 ** 3) * 10) / 10;
  const cpus = os.cpus();
  const cpuModel = cpus[0]?.model ?? 'Unknown';

  // Check memory
  if (totalMemGB < 4) {
    issues.push(`Insufficient RAM: ${totalMemGB} GB (minimum 4 GB required)`);
  } else if (totalMemGB < 8) {
    warnings.push(`Low RAM: ${totalMemGB} GB (8+ GB recommended)`);
  }

  // Check CPU cores
  if (cpus.length < 2) {
    warnings.push(`Single-core CPU detected (${cpuModel}). Multi-core recommended.`);
  }

  // Platform checks
  const platform = process.platform;
  const osType = os.type();
  const osRelease = os.release();

  if (platform === 'win32') {
    const majorVersion = parseInt(osRelease.split('.')[0] ?? '0', 10);
    if (majorVersion < 10) {
      issues.push(`Windows ${osRelease} is not supported. Windows 10+ required.`);
    }
  } else if (platform === 'darwin') {
    const [major] = osRelease.split('.').map(Number);
    if (major && major < 20) {
      issues.push(`macOS ${osRelease} is not supported. macOS 11 (Big Sur) required.`);
    }
  }

  // Disk space (estimated, rough check)
  // Node.js os doesn't expose disk space directly; we use a heuristic
  const estimatedDiskFreeGB = 50; // Placeholder â€” real impl uses platform-specific APIs

  const totalSizeBytes = AVAILABLE_COMPONENTS
    .filter(c => c.selected)
    .reduce((sum, c) => sum + c.sizeBytes, 0);
  const requiredGB = Math.ceil(totalSizeBytes / (1024 ** 3) * 10) / 10;

  if (estimatedDiskFreeGB < requiredGB) {
    issues.push(`Insufficient disk space: ~${requiredGB} GB needed, estimated ${estimatedDiskFreeGB} GB available`);
  }

  return {
    platform,
    arch: process.arch,
    osVersion: osType,
    osRelease,
    totalMemoryGB: totalMemGB,
    freeMemoryGB: freeMemGB,
    cpuCores: cpus.length,
    cpuModel,
    diskSpaceGB: estimatedDiskFreeGB + requiredGB,
    diskFreeGB: estimatedDiskFreeGB,
    nodeVersion: process.versions.node,
    electronVersion: process.versions.electron,
    passes: issues.length === 0,
    issues,
    warnings,
  };
}

// â”€â”€ Installation logic â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface InstallProgress {
  componentId: string;
  componentName: string;
  phase: 'downloading' | 'extracting' | 'installing' | 'configuring' | 'done' | 'error';
  progressPercent: number;
  bytesDownloaded: number;
  totalBytes: number;
  error?: string;
}

async function installComponents(
  components: InstallComponent[],
  installDir: string,
  onProgress: (p: InstallProgress) => void,
): Promise<{ success: boolean; installedCount: number; errors: string[] }> {
  const errors: string[] = [];
  let installedCount = 0;

  for (const component of components) {
    if (!component.selected) continue;

    try {
      // Phase 1: Download
      onProgress({
        componentId: component.id,
        componentName: component.name,
        phase: 'downloading',
        progressPercent: 0,
        bytesDownloaded: 0,
        totalBytes: component.sizeBytes,
      });

      // Simulate download progress
      for (let pct = 0; pct <= 100; pct += 10) {
        await new Promise(r => setTimeout(r, 50));
        onProgress({
          componentId: component.id,
          componentName: component.name,
          phase: 'downloading',
          progressPercent: pct,
          bytesDownloaded: Math.floor(component.sizeBytes * pct / 100),
          totalBytes: component.sizeBytes,
        });
      }

      // Phase 2: Extract
      onProgress({
        componentId: component.id,
        componentName: component.name,
        phase: 'extracting',
        progressPercent: 0,
        bytesDownloaded: component.sizeBytes,
        totalBytes: component.sizeBytes,
      });

      const componentDir = path.join(installDir, component.id);
      await fs.mkdir(componentDir, { recursive: true });

      // Create component manifest
      const manifest = {
        id: component.id,
        name: component.name,
        version: component.version,
        installedAt: new Date().toISOString(),
        sizeBytes: component.sizeBytes,
      };
      await fs.writeFile(
        path.join(componentDir, 'manifest.json'),
        JSON.stringify(manifest, null, 2),
      );

      // Phase 3: Configure
      onProgress({
        componentId: component.id,
        componentName: component.name,
        phase: 'configuring',
        progressPercent: 100,
        bytesDownloaded: component.sizeBytes,
        totalBytes: component.sizeBytes,
      });

      await new Promise(r => setTimeout(r, 100));

      // Phase 4: Done
      onProgress({
        componentId: component.id,
        componentName: component.name,
        phase: 'done',
        progressPercent: 100,
        bytesDownloaded: component.sizeBytes,
        totalBytes: component.sizeBytes,
      });

      installedCount++;
      log.info('Component installed', { id: component.id, name: component.name });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`${component.name}: ${msg}`);
      onProgress({
        componentId: component.id,
        componentName: component.name,
        phase: 'error',
        progressPercent: 0,
        bytesDownloaded: 0,
        totalBytes: component.sizeBytes,
        error: msg,
      });
      log.error('Component install failed', e instanceof Error ? e : new Error(msg));
    }
  }

  return { success: errors.length === 0, installedCount, errors };
}

// â”€â”€ License activation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function activateLicense(licenseKey: string): Promise<{
  valid: boolean; licenseId: string; type: string; expiresAt: string; seats: number; error?: string;
}> {
  // Validate format: TITAN-XXXX-XXXX-XXXX
  const keyRegex = /^TITAN-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  if (!keyRegex.test(licenseKey)) {
    return {
      valid: false, licenseId: '', type: '', expiresAt: '', seats: 0,
      error: 'Invalid license key format. Expected: TITAN-XXXX-XXXX-XXXX',
    };
  }

  // In production, call license server. Mock for now.
  return {
    valid: true,
    licenseId: `lic-${Date.now()}`,
    type: 'professional',
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    seats: 5,
  };
}

// â”€â”€ Device discovery â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface DiscoveredDevice {
  id: string;
  name: string;
  vendor: string;
  model: string;
  type: 'printer' | 'cutter' | 'print-and-cut' | 'spectrophotometer';
  protocol: 'usb' | 'ethernet' | 'wifi';
  address: string;
  status: 'online' | 'offline' | 'unknown';
}

async function discoverDevices(): Promise<DiscoveredDevice[]> {
  // Simulate device discovery on the local network
  const devices: DiscoveredDevice[] = [];

  // Check for USB devices (simulated)
  const usbDevices: DiscoveredDevice[] = [
    {
      id: 'usb-001', name: 'HP Latex 315', vendor: 'HP', model: 'Latex 315',
      type: 'printer', protocol: 'usb', address: 'USB001', status: 'online',
    },
    {
      id: 'usb-002', name: 'Graphtec CE7000', vendor: 'Graphtec', model: 'CE7000',
      type: 'cutter', protocol: 'usb', address: 'USB002', status: 'online',
    },
  ];

  // Check for network devices (simulated)
  const networkDevices: DiscoveredDevice[] = [
    {
      id: 'net-001', name: 'Mimaki CJV150', vendor: 'Mimaki', model: 'CJV150-160',
      type: 'print-and-cut', protocol: 'ethernet', address: '192.168.1.100', status: 'unknown',
    },
  ];

  devices.push(...usbDevices, ...networkDevices);
  return devices;
}

// â”€â”€ Service setup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function setupDaemon(installDir: string): Promise<{
  success: boolean; serviceInstalled: boolean; serviceRunning: boolean; error?: string;
}> {
  try {
    const daemonPath = path.join(installDir, 'titandaemon');

    if (process.platform === 'win32') {
      // On Windows, we'd use sc.exe or nssm to install the service
      log.info('Windows service setup', { path: daemonPath });
    } else if (process.platform === 'darwin') {
      // On macOS, we'd create a LaunchDaemon plist
      const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.titan.daemon</string>
  <key>ProgramArguments</key>
  <array>
    <string>${daemonPath}/titandaemon</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
</dict>
</plist>`;
      log.info('macOS LaunchDaemon setup', { plist });
    } else {
      // Linux: systemd unit file
      log.info('Linux systemd service setup', { path: daemonPath });
    }

    return { success: true, serviceInstalled: true, serviceRunning: true };
  } catch (e) {
    return {
      success: false, serviceInstalled: false, serviceRunning: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

// â”€â”€ Window creation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let mainWindow: BrowserWindow | null = null;

async function createWindow(): Promise<BrowserWindow> {
  const win = new BrowserWindow({
    width: 780,
    height: 620,
    minWidth: 700,
    minHeight: 560,
    title: 'Titan Production Suite â€” Installer',
    backgroundColor: '#0D0D1A',
    frame: process.platform !== 'darwin',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    trafficLightPosition: { x: 16, y: 14 },
    show: false,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Enforce Content Security Policy
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.titan-suite.com wss://api.titan-suite.com",
        ],
      },
    });
  });

  win.once('ready-to-show', () => win.show());

  if (process.env['ELECTRON_RENDERER_URL']) {
    await win.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    await win.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  return win;
}

// â”€â”€ IPC handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function registerIpcHandlers(): void {
  // â”€â”€ Components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ipcMain.handle('installer:get-components', () => {
    return { components: AVAILABLE_COMPONENTS };
  });

  ipcMain.handle('installer:set-components', (_event, selected: Record<string, boolean>) => {
    for (const comp of AVAILABLE_COMPONENTS) {
      if (!comp.required && comp.id in selected) {
        comp.selected = selected[comp.id]!;
      }
    }
    return { components: AVAILABLE_COMPONENTS };
  });

  // â”€â”€ System check â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ipcMain.handle('installer:system-check', () => {
    return performSystemCheck();
  });

  // â”€â”€ Installation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ipcMain.handle('installer:get-install-dir', () => {
    if (process.platform === 'win32') {
      return path.join(process.env['PROGRAMFILES'] ?? 'C:\\Program Files', 'Titan Production Suite');
    } else if (process.platform === 'darwin') {
      return '/Applications/Titan Production Suite';
    } else {
      return path.join(os.homedir(), '.titan');
    }
  });

  ipcMain.handle('installer:set-install-dir', (_event, dir: string) => {
    return { installDir: dir };
  });

  ipcMain.handle('installer:choose-directory', async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      title: 'Choose Installation Directory',
      properties: ['openDirectory', 'createDirectory'],
    });
    if (result.canceled) return { cancelled: true };
    return { path: result.filePaths[0] };
  });

  ipcMain.handle('installer:install', async (_event, { installDir }: { installDir: string }) => {
    const components = AVAILABLE_COMPONENTS.filter(c => c.selected);

    const result = await installComponents(components, installDir, (progress) => {
      mainWindow?.webContents.send('installer:progress', progress);
    });

    return result;
  });

  // â”€â”€ License â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ipcMain.handle('installer:activate-license', async (_event, { licenseKey }: { licenseKey: string }) => {
    const result = await activateLicense(licenseKey);
    if (result.valid) {
      log.info('License activated', { licenseId: result.licenseId, type: result.type });
    }
    return result;
  });

  ipcMain.handle('installer:skip-license', () => {
    return { valid: true, type: 'trial', licenseId: 'trial', expiresAt: null, seats: 1 };
  });

  // â”€â”€ Device discovery â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ipcMain.handle('installer:discover-devices', async () => {
    const devices = await discoverDevices();
    return { devices };
  });

  ipcMain.handle('installer:configure-device', async (_event, { deviceId, settings }: { deviceId: string; settings: Record<string, unknown> }) => {
    log.info('Device configured', { deviceId, settings });
    return { success: true };
  });

  // â”€â”€ Service setup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ipcMain.handle('installer:setup-service', async (_event, { installDir }: { installDir: string }) => {
    return setupDaemon(installDir);
  });

  // â”€â”€ CLI flags â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ipcMain.handle('installer:get-cli-flags', () => {
    const args = process.argv.slice(2);
    const silent = args.includes('--silent') || args.includes('-s');
    const installDir = args.find(a => a.startsWith('--dir='))?.split('=')[1];
    const licenseKey = args.find(a => a.startsWith('--license='))?.split('=')[1];
    const noServices = args.includes('--no-services');
    const components = args.find(a => a.startsWith('--components='))?.split('=')[1]?.split(',');

    return {
      silent,
      installDir: installDir ?? null,
      licenseKey: licenseKey ?? null,
      noServices,
      components: components ?? null,
      isElevated: process.env['ELEVATED'] === 'true',
    };
  });

  // â”€â”€ System â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ipcMain.handle('system:get-info', () => ({
    version: TITAN_VERSION,
    platform: process.platform,
    arch: process.arch,
  }));

  ipcMain.handle('system:open-external', async (_event, url: string) => {
    if (url.startsWith('https://')) await shell.openExternal(url);
  });

  // â”€â”€ Window â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ipcMain.handle('window:close', () => mainWindow?.close());
}

// â”€â”€ App lifecycle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.whenReady().then(async () => {
  registerIpcHandlers();
  mainWindow = await createWindow();

  // Handle silent install mode
  const args = process.argv.slice(2);
  if (args.includes('--silent') || args.includes('-s')) {
    log.info('Silent install mode detected');
    const installDir = args.find(a => a.startsWith('--dir='))?.split('=')[1]
      ?? path.join(process.env['PROGRAMFILES'] ?? 'C:\\Program Files', 'Titan Production Suite');
    const components = AVAILABLE_COMPONENTS.filter(c => c.selected);

    await installComponents(components, installDir, (progress) => {
      log.info('Silent install progress', { component: progress.componentId, phase: progress.phase, pct: progress.progressPercent });
    });

    log.info('Silent install complete');
    app.quit();
  }
}).catch((e: unknown) => {
  log.error('Installer failed to start', e instanceof Error ? e : new Error(String(e)));
  app.quit();
});

app.on('window-all-closed', () => {
  app.quit();
});

// Prevent navigation to external URLs
app.on('web-contents-created', (_event, contents) => {
  contents.on('will-navigate', (event, url) => {
    if (!url.startsWith('http://localhost') && !url.startsWith('file://')) {
      event.preventDefault();
    }
  });
  contents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) void shell.openExternal(url);
    return { action: 'deny' };
  });
});

