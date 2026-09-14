// ─────────────────────────────────────────────────────────────────────────────
// Titan Installer — System Check Step
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { useInstallerStore } from '../store/installer-store.js';

export function SystemCheckStep() {
  const { systemCheck, nextStep, prevStep } = useInstallerStore();

  if (!systemCheck) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Running system check...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>System Check</h2>
        <p style={styles.subtitle}>Verifying your system meets requirements</p>
      </div>

      <div style={styles.body}>
        {/* Status banner */}
        <div style={{
          ...styles.statusBanner,
          ...(systemCheck.passes ? styles.statusPass : styles.statusFail),
        }}>
          <span style={styles.statusIcon}>{systemCheck.passes ? '✓' : '✕'}</span>
          <span style={styles.statusText}>
            {systemCheck.passes ? 'System meets all requirements' : 'System does not meet requirements'}
          </span>
        </div>

        {/* System info grid */}
        <div style={styles.grid}>
          <div style={styles.infoCard}>
            <div style={styles.infoLabel}>Platform</div>
            <div style={styles.infoValue}>{systemCheck.platform} {systemCheck.arch}</div>
          </div>
          <div style={styles.infoCard}>
            <div style={styles.infoLabel}>OS</div>
            <div style={styles.infoValue}>{systemCheck.osVersion}</div>
            <div style={styles.infoDetail}>{systemCheck.osRelease}</div>
          </div>
          <div style={styles.infoCard}>
            <div style={styles.infoLabel}>Memory</div>
            <div style={styles.infoValue}>{systemCheck.totalMemoryGB} GB</div>
            <div style={styles.infoDetail}>{systemCheck.freeMemoryGB} GB free</div>
          </div>
          <div style={styles.infoCard}>
            <div style={styles.infoLabel}>CPU</div>
            <div style={styles.infoValue}>{systemCheck.cpuCores} cores</div>
            <div style={styles.infoDetail}>{systemCheck.cpuModel}</div>
          </div>
          <div style={styles.infoCard}>
            <div style={styles.infoLabel}>Disk Free</div>
            <div style={styles.infoValue}>{systemCheck.diskFreeGB} GB</div>
          </div>
          <div style={styles.infoCard}>
            <div style={styles.infoLabel}>Node.js</div>
            <div style={styles.infoValue}>{systemCheck.nodeVersion}</div>
          </div>
        </div>

        {/* Issues */}
        {systemCheck.issues.length > 0 && (
          <div style={styles.issuesSection}>
            <h3 style={styles.issuesTitle}>Issues (must fix)</h3>
            {systemCheck.issues.map((issue, i) => (
              <div key={i} style={styles.issue}>✕ {issue}</div>
            ))}
          </div>
        )}

        {systemCheck.warnings.length > 0 && (
          <div style={styles.issuesSection}>
            <h3 style={styles.warningTitle}>Warnings (recommended)</h3>
            {systemCheck.warnings.map((warning, i) => (
              <div key={i} style={styles.warning}>⚠ {warning}</div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <button onClick={prevStep} style={styles.backBtn}>← Back</button>
        <button
          onClick={nextStep}
          disabled={!systemCheck.passes}
          style={{
            ...styles.nextBtn,
            opacity: systemCheck.passes ? 1 : 0.5,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', height: '100%' },
  header: { padding: '20px 24px 8px' },
  title: { fontSize: 20, fontWeight: 700, margin: 0, color: '#FFF' },
  subtitle: { fontSize: 12, color: '#666', marginTop: 4 },
  loadingText: { textAlign: 'center', padding: 40, color: '#888' },
  body: { flex: 1, overflow: 'auto', padding: '12px 24px' },
  statusBanner: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
    borderRadius: 8, marginBottom: 16,
  },
  statusPass: { backgroundColor: 'rgba(76, 175, 80, 0.1)', border: '1px solid #2A4A2A' },
  statusFail: { backgroundColor: 'rgba(255, 68, 68, 0.1)', border: '1px solid #4A2020' },
  statusIcon: { fontSize: 16, fontWeight: 700 },
  statusText: { fontSize: 13, fontWeight: 600, color: '#E0E0E0' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 },
  infoCard: {
    padding: '12px 14px', border: '1px solid #1E1E3A', borderRadius: 8,
    backgroundColor: '#12122A',
  },
  infoLabel: { fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontSize: 14, fontWeight: 600, color: '#E0E0E0', marginTop: 4 },
  infoDetail: { fontSize: 11, color: '#666', marginTop: 2 },
  issuesSection: { marginTop: 16 },
  issuesTitle: { fontSize: 12, fontWeight: 600, color: '#FF6B6B', marginBottom: 8 },
  warningTitle: { fontSize: 12, fontWeight: 600, color: '#FF9800', marginBottom: 8 },
  issue: { fontSize: 12, color: '#FF6B6B', padding: '6px 0', borderBottom: '1px solid #1E1E3A' },
  warning: { fontSize: 12, color: '#FF9800', padding: '6px 0', borderBottom: '1px solid #1E1E3A' },
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
