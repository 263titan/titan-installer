// ─────────────────────────────────────────────────────────────────────────────
// Titan Installer — Installing Step
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect } from 'react';
import { useInstallerStore } from '../store/installer-store.js';

export function InstallingStep() {
  const {
    installProgress, addProgress, installComplete,
    setInstallComplete, installDir, components, setStep,
  } = useInstallerStore();

  useEffect(() => {
    if (installComplete) return;

    // Register progress listener
    window.installer.installer.onProgress((progress) => {
      addProgress(progress);
      if (progress.phase === 'error' || progress.phase === 'done') {
        // Check if all components are done
        const store = useInstallerStore.getState();
        const selected = store.components.filter(c => c.selected);
        const allDone = selected.every(c =>
          store.installProgress.some(p => p.componentId === c.id && (p.phase === 'done' || p.phase === 'error')),
        );
        if (allDone) {
          const errors = store.installProgress
            .filter(p => p.phase === 'error')
            .map(p => `${p.componentName}: ${p.error ?? 'Unknown error'}`);
          setInstallComplete(errors.length === 0, errors);
          setTimeout(() => setStep('complete'), 1000);
        }
      }
    });

    // Start installation
    async function startInstall() {
      try {
        const result = await window.installer.installer.install({ installDir });
        setInstallComplete(result.success, result.errors);
        setTimeout(() => setStep('complete'), 1000);
      } catch (e) {
        setInstallComplete(false, [e instanceof Error ? e.message : String(e)]);
        setTimeout(() => setStep('complete'), 1000);
      }
    }
    startInstall();
  }, []);

  const selected = components.filter(c => c.selected);
  const overallProgress = selected.length > 0
    ? Math.round(installProgress.reduce((sum, p) => {
        if (p.phase === 'done') return sum + 100;
        if (p.phase === 'error') return sum + 100;
        return sum + p.progressPercent;
      }, 0) / selected.length)
    : 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Installing Titan Production Suite</h2>
        <p style={styles.subtitle}>Please wait while components are being installed</p>
      </div>

      <div style={styles.body}>
        {/* Overall progress bar */}
        <div style={styles.overallSection}>
          <div style={styles.overallHeader}>
            <span style={styles.overallLabel}>Overall Progress</span>
            <span style={styles.overallPercent}>{overallProgress}%</span>
          </div>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${overallProgress}%` }} />
          </div>
        </div>

        {/* Component list */}
        <div style={styles.componentList}>
          {selected.map(comp => {
            const progress = installProgress.find(p => p.componentId === comp.id);
            const phase = progress?.phase ?? 'pending';
            const pct = progress?.progressPercent ?? 0;

            return (
              <div key={comp.id} style={styles.componentRow}>
                <div style={styles.componentIcon}>
                  {phase === 'done' ? '✓' :
                    phase === 'error' ? '✕' :
                      phase === 'pending' ? '○' : '⟳'}
                </div>
                <div style={styles.componentDetails}>
                  <div style={styles.componentName}>{comp.name}</div>
                  <div style={styles.componentPhase}>
                    {phase === 'pending' ? 'Waiting...' :
                      phase === 'downloading' ? `Downloading (${pct}%)` :
                        phase === 'extracting' ? 'Extracting...' :
                          phase === 'configuring' ? 'Configuring...' :
                            phase === 'done' ? 'Installed' :
                              `Error: ${progress?.error ?? 'Unknown'}`}
                  </div>
                </div>
                {phase !== 'pending' && phase !== 'done' && phase !== 'error' && (
                  <div style={styles.componentProgress}>
                    <div style={styles.miniTrack}>
                      <div style={{ ...styles.miniFill, width: `${pct}%` }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', height: '100%' },
  header: { padding: '24px 24px 8px', textAlign: 'center' },
  title: { fontSize: 20, fontWeight: 700, margin: 0, color: '#FFF' },
  subtitle: { fontSize: 12, color: '#666', marginTop: 4 },
  body: { flex: 1, padding: '20px 24px', overflow: 'auto' },
  overallSection: { marginBottom: 24 },
  overallHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
  overallLabel: { fontSize: 12, color: '#888' },
  overallPercent: { fontSize: 14, fontWeight: 700, color: '#6C63FF' },
  progressTrack: {
    width: '100%', height: 8, borderRadius: 4, backgroundColor: '#1E1E3A', overflow: 'hidden',
  },
  progressFill: {
    height: '100%', borderRadius: 4,
    background: 'linear-gradient(90deg, #6C63FF, #A78BFA)',
    transition: 'width 0.3s ease',
  },
  componentList: { display: 'flex', flexDirection: 'column', gap: 6 },
  componentRow: {
    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
    border: '1px solid #1E1E3A', borderRadius: 8, backgroundColor: '#12122A',
  },
  componentIcon: { fontSize: 14, width: 24, textAlign: 'center', color: '#6C63FF' },
  componentDetails: { flex: 1 },
  componentName: { fontSize: 13, fontWeight: 600, color: '#E0E0E0' },
  componentPhase: { fontSize: 11, color: '#666', marginTop: 2 },
  componentProgress: { width: 80 },
  miniTrack: { width: '100%', height: 4, borderRadius: 2, backgroundColor: '#1E1E3A', overflow: 'hidden' },
  miniFill: {
    height: '100%', borderRadius: 2, backgroundColor: '#6C63FF',
    transition: 'width 0.3s ease',
  },
};
