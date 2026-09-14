// ─────────────────────────────────────────────────────────────────────────────
// Titan Installer — Install Location Step
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { useInstallerStore } from '../store/installer-store.js';

export function InstallLocationStep() {
  const { installDir, setInstallDir, nextStep, prevStep } = useInstallerStore();
  const [isChoosing, setIsChoosing] = useState(false);

  const handleChoose = async () => {
    setIsChoosing(true);
    const result = await window.installer.installer.chooseDirectory();
    if (!result.cancelled && result.path) {
      setInstallDir(result.path);
    }
    setIsChoosing(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Installation Location</h2>
        <p style={styles.subtitle}>Choose where to install Titan Production Suite</p>
      </div>

      <div style={styles.body}>
        <div style={styles.pathSection}>
          <label style={styles.label}>Installation Directory</label>
          <div style={styles.pathRow}>
            <input
              type="text"
              value={installDir}
              onChange={e => setInstallDir(e.target.value)}
              style={styles.pathInput}
            />
            <button onClick={handleChoose} disabled={isChoosing} style={styles.browseBtn}>
              {isChoosing ? '...' : 'Browse'}
            </button>
          </div>
        </div>

        <div style={styles.infoBox}>
          <div style={styles.infoTitle}>Installation Notes</div>
          <ul style={styles.infoList}>
            <li>Titan will create subdirectories for each installed component</li>
            <li>A shared library directory will be created for fonts and profiles</li>
            <li>Desktop shortcuts will be created in your user profile</li>
            <li>The TitanDaemon service will be registered with your OS</li>
          </ul>
        </div>
      </div>

      <div style={styles.footer}>
        <button onClick={prevStep} style={styles.backBtn}>← Back</button>
        <button onClick={nextStep} style={styles.nextBtn}>Next →</button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', height: '100%' },
  header: { padding: '20px 24px 8px' },
  title: { fontSize: 20, fontWeight: 700, margin: 0, color: '#FFF' },
  subtitle: { fontSize: 12, color: '#666', marginTop: 4 },
  body: { flex: 1, padding: '20px 24px' },
  pathSection: { marginBottom: 24 },
  label: { display: 'block', fontSize: 11, color: '#666', textTransform: 'uppercase', marginBottom: 6 },
  pathRow: { display: 'flex', gap: 8 },
  pathInput: {
    flex: 1, padding: '10px 14px', border: '1px solid #2A2A4A', borderRadius: 6,
    backgroundColor: '#1A1A30', color: '#E0E0E0', fontSize: 13, outline: 'none',
    fontFamily: 'monospace',
  },
  browseBtn: {
    padding: '10px 16px', border: '1px solid #2A2A4A', borderRadius: 6,
    backgroundColor: '#1A1A30', color: '#AAA', fontSize: 12, cursor: 'pointer',
  },
  infoBox: {
    padding: '16px', border: '1px solid #1E1E3A', borderRadius: 8,
    backgroundColor: '#12122A',
  },
  infoTitle: { fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 8 },
  infoList: { fontSize: 12, color: '#666', lineHeight: 2, paddingLeft: 16 },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 24px', borderTop: '1px solid #1E1E3A',
  },
  backBtn: {
    padding: '8px 16px', border: '1px solid #2A2A4A', borderRadius: 6,
    backgroundColor: 'transparent', color: '#AAA', fontSize: 13, cursor: 'pointer',
  },
  nextBtn: {
    padding: '8px 20px', border: 'none', borderRadius: 6,
    backgroundColor: '#6C63FF', color: '#FFF', fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
};
