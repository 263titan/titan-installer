// ─────────────────────────────────────────────────────────────────────────────
// Titan Installer — Complete Step
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { useInstallerStore } from '../store/installer-store.js';

export function CompleteStep() {
  const { installSuccess, installErrors, installProgress } = useInstallerStore();
  const installedCount = installProgress.filter(p => p.phase === 'done').length;
  const errorCount = installProgress.filter(p => p.phase === 'error').length;

  const handleLaunch = () => {
    window.installer.window.close();
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={{
          ...styles.heroIcon,
          ...(installSuccess ? styles.heroIconSuccess : styles.heroIconError),
        }}>
          {installSuccess ? '✓' : '⚠'}
        </div>
        <h2 style={styles.title}>
          {installSuccess ? 'Installation Complete!' : 'Installation Finished with Errors'}
        </h2>
        <p style={styles.subtitle}>
          {installSuccess
            ? 'Titan Production Suite is ready to use.'
            : `${errorCount} component(s) failed to install. You can retry from the launcher.`}
        </p>
      </div>

      <div style={styles.body}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Components Installed</span>
            <span style={styles.summaryValue}>{installedCount}</span>
          </div>
          {errorCount > 0 && (
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Failed</span>
              <span style={styles.summaryValueError}>{errorCount}</span>
            </div>
          )}
        </div>

        {installErrors.length > 0 && (
          <div style={styles.errorsSection}>
            <h3 style={styles.errorsTitle}>Errors</h3>
            {installErrors.map((err, i) => (
              <div key={i} style={styles.errorItem}>{err}</div>
            ))}
          </div>
        )}

        <div style={styles.tipsCard}>
          <div style={styles.tipsTitle}>Next Steps</div>
          <ul style={styles.tipsList}>
            <li>Open Titan Launcher from your desktop or Start Menu</li>
            <li>Sign in with your Titan Account to activate your license</li>
            <li>Connect your printers and cutters from the device settings</li>
            <li>Import your font library with FontSync</li>
          </ul>
        </div>
      </div>

      <div style={styles.footer}>
        <button onClick={handleLaunch} style={styles.launchBtn}>
          {installSuccess ? 'Close & Launch Titan' : 'Close'}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', height: '100%' },
  hero: { textAlign: 'center', padding: '40px 24px 16px' },
  heroIcon: {
    width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: 28, fontWeight: 700, margin: '0 auto 16px',
  },
  heroIconSuccess: { backgroundColor: 'rgba(76, 175, 80, 0.15)', color: '#4CAF50' },
  heroIconError: { backgroundColor: 'rgba(255, 152, 0, 0.15)', color: '#FF9800' },
  title: { fontSize: 22, fontWeight: 700, margin: 0, color: '#FFF' },
  subtitle: { fontSize: 13, color: '#888', marginTop: 8, maxWidth: 400, margin: '8px auto 0' },
  body: { flex: 1, padding: '0 48px 24px', maxWidth: 500, margin: '0 auto', width: '100%' },
  summaryCard: {
    padding: '14px 16px', border: '1px solid #1E1E3A', borderRadius: 8,
    backgroundColor: '#12122A', marginBottom: 16,
  },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between', padding: '4px 0',
  },
  summaryLabel: { fontSize: 13, color: '#888' },
  summaryValue: { fontSize: 13, fontWeight: 600, color: '#4CAF50' },
  summaryValueError: { fontSize: 13, fontWeight: 600, color: '#FF6B6B' },
  errorsSection: { marginBottom: 16 },
  errorsTitle: { fontSize: 12, fontWeight: 600, color: '#FF6B6B', marginBottom: 8 },
  errorItem: {
    fontSize: 11, color: '#FF6B6B', padding: '6px 10px', marginBottom: 4,
    backgroundColor: 'rgba(255, 68, 68, 0.08)', borderRadius: 4,
  },
  tipsCard: {
    padding: '14px 16px', border: '1px solid #1E1E3A', borderRadius: 8,
    backgroundColor: '#12122A',
  },
  tipsTitle: { fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 8 },
  tipsList: { fontSize: 12, color: '#666', lineHeight: 2, paddingLeft: 16 },
  footer: { padding: '16px 24px', textAlign: 'center' },
  launchBtn: {
    padding: '12px 32px', border: 'none', borderRadius: 8,
    background: 'linear-gradient(135deg, #6C63FF, #5B54E6)',
    color: '#FFF', fontSize: 15, fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(108, 99, 255, 0.4)',
  },
};
