// ─────────────────────────────────────────────────────────────────────────────
// Titan Installer — Wizard App
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect } from 'react';
import { useInstallerStore } from './store/installer-store.js';
import { WelcomeStep } from './steps/WelcomeStep.js';
import { ComponentsStep } from './steps/ComponentsStep.js';
import { SystemCheckStep } from './steps/SystemCheckStep.js';
import { InstallLocationStep } from './steps/InstallLocationStep.js';
import { LicenseStep } from './steps/LicenseStep.js';
import { DeviceDiscoveryStep } from './steps/DeviceDiscoveryStep.js';
import { ServiceSetupStep } from './steps/ServiceSetupStep.js';
import { InstallingStep } from './steps/InstallingStep.js';
import { CompleteStep } from './steps/CompleteStep.js';
import type { WizardStep } from './store/installer-store.js';

const STEP_COMPONENTS: Record<WizardStep, React.FC> = {
  'welcome': WelcomeStep,
  'components': ComponentsStep,
  'system-check': SystemCheckStep,
  'install-location': InstallLocationStep,
  'license': LicenseStep,
  'device-discovery': DeviceDiscoveryStep,
  'service-setup': ServiceSetupStep,
  'installing': InstallingStep,
  'complete': CompleteStep,
};

const STEP_LABELS: Record<WizardStep, string> = {
  'welcome': 'Welcome',
  'components': 'Components',
  'system-check': 'System Check',
  'install-location': 'Location',
  'license': 'License',
  'device-discovery': 'Devices',
  'service-setup': 'Service',
  'installing': 'Installing',
  'complete': 'Complete',
};

const ALL_STEPS: WizardStep[] = [
  'welcome', 'components', 'system-check', 'install-location',
  'license', 'device-discovery', 'service-setup', 'installing', 'complete',
];

export default function App() {
  const { currentStep, setComponents, setInstallDir, setSystemCheck, setIsSilent } = useInstallerStore();

  useEffect(() => {
    async function init() {
      const [compsResult, dirResult, checkResult, cliFlags] = await Promise.all([
        window.installer.installer.getComponents(),
        window.installer.installer.getInstallDir(),
        window.installer.installer.systemCheck(),
        window.installer.installer.getCliFlags(),
      ]);

      setComponents(compsResult.components);
      setInstallDir(dirResult);
      setSystemCheck(checkResult);
      setIsSilent(cliFlags.silent);

      if (cliFlags.silent) {
        // In silent mode, skip straight to installing
        useInstallerStore.getState().setStep('installing');
      }
    }
    init();
  }, []);

  const StepComponent = STEP_COMPONENTS[currentStep];
  const currentIdx = ALL_STEPS.indexOf(currentStep);

  // Filter out installing/complete from the progress bar
  const visibleSteps = ALL_STEPS.filter(s => s !== 'installing' && s !== 'complete');

  return (
    <div style={styles.root}>
      {/* Progress bar */}
      {currentStep !== 'welcome' && currentStep !== 'installing' && currentStep !== 'complete' && (
        <div style={styles.progressBar}>
          {visibleSteps.map((step, i) => {
            const idx = ALL_STEPS.indexOf(step);
            const isPast = currentIdx > idx;
            const isCurrent = currentStep === step;
            return (
              <React.Fragment key={step}>
                {i > 0 && (
                  <div style={{
                    ...styles.progressLine,
                    backgroundColor: isPast || isCurrent ? '#6C63FF' : '#2A2A4A',
                  }} />
                )}
                <div style={styles.progressStep}>
                  <div style={{
                    ...styles.progressDot,
                    backgroundColor: isPast ? '#6C63FF' : isCurrent ? '#6C63FF' : '#2A2A4A',
                    borderColor: isPast || isCurrent ? '#6C63FF' : '#3A3A5A',
                  }}>
                    {isPast ? '✓' : (i + 1)}
                  </div>
                  <span style={{
                    ...styles.progressLabel,
                    color: isCurrent ? '#FFF' : isPast ? '#6C63FF' : '#555',
                  }}>
                    {STEP_LABELS[step]}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Step content */}
      <div style={styles.content}>
        <StepComponent />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex', flexDirection: 'column', height: '100vh',
    backgroundColor: '#0D0D1A', color: '#E0E0E0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  progressBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '16px 24px', gap: 0, borderBottom: '1px solid #1E1E3A',
  },
  progressStep: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
  },
  progressDot: {
    width: 24, height: 24, borderRadius: '50%', border: '2px solid #3A3A5A',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, color: '#FFF',
  },
  progressLine: {
    width: 32, height: 2, margin: '0 4px', marginBottom: 18,
    borderRadius: 1,
  },
  progressLabel: {
    fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: 0.5,
  },
  content: {
    flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto',
  },
};
