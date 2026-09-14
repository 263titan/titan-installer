// ─────────────────────────────────────────────────────────────────────────────
// Titan Installer — Service Setup Step
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { useInstallerStore } from '../store/installer-store.js';

export function ServiceSetupStep() {
  const { installDir, nextStep, prevStep } = useInstallerStore();
  const [serviceStatus, setServiceStatus] = useState<'idle' | 'setting-up' | 'done' | 'error'>('idle');
  const [serviceResult, setServiceResult] = useState<{
    serviceInstalled: boolean; serviceRunning: boolean; error?: string;
  } | null>(null);

  const handleSetup = async () => {
    setServiceStatus('setting-up');
    try {
      const result = await window.installer.installer.setupService({ installDir });
      setServiceResult(result);
      setServiceStatus(result.success ? 'done' : 'error');
    } catch (e) {
      setServiceStatus('error');
      setServiceResult({
        serviceInstalled: false, serviceRunning: false,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Service Setup</h2>
        <p style={styles.subtitle}>Configure TitanDaemon background service</p>
      </div>

      <div style={styles.body}>
        <div style={styles.infoCard}>
          <h3 style={styles.infoTitle}>TitanDaemon</h3>
          <p style={styles.infoText}>
            TitanDaemon runs in the background and handles:
          </p>
          <ul style={styles.featureList}>
            <li>Device polling and status monitoring</li>
            <li>Auto-update checking and installation</li>
            <li>Hot folder watching for automatic job submission</li>
            <li>Network font activation</li>
            <li>License heartbeat verification</li>
          </ul>
        </div>

        {serviceStatus === 'idle' && (
          <button onClick={handleSetup} style={styles.setupBtn}>
            Install &amp; Start Service
          </button>
        )}

        {serviceStatus === 'setting-up' && (
          <div style={styles.settingUp}>
            <div style={styles.spinner} />
            <span>Setting up service...</span>
          </div>
        )}

        {serviceStatus === 'done' && serviceResult && (
          <div style={styles.resultCard}>
            <span style={styles.resultIcon}>✓</span>
            <div>
              <div style={styles.resultTitle}>Service installed successfully</div>
              <div style={styles.resultDetail}>
                Status: {serviceResult.serviceRunning ? 'Running' : 'Installed (not started)'}
              </div>
            </div>
          </div>
        )}

        {serviceStatus === 'error' && serviceResult && (
          <div style={styles.errorCard}>
            <span style={styles.errorIcon}>✕</span>
            <div>
              <div style={styles.errorTitle}>Service setup failed</div>
              <div style={styles.errorDetail}>{serviceResult.error}</div>
            </div>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <button onClick={prevStep} style={styles.backBtn}>← Back</button>
        <button
          onClick={nextStep}
          style={styles.nextBtn}
        >
          {serviceStatus === 'done' ? 'Next →' : 'Skip for Now'}
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
  body: { flex: 1, padding: '16px 24px', overflow: 'auto' },
  infoCard: {
    padding: '16px', border: '1px solid #1E1E3A', borderRadius: 8,
    backgroundColor: '#12122A', marginBottom: 16,
  },
  infoTitle: { fontSize: 14, fontWeight: 600, color: '#E0E0E0', margin: 0 },
  infoText: { fontSize: 12, color: '#888', marginTop: 8, lineHeight: 1.6 },
  featureList: { fontSize: 12, color: '#666', lineHeight: 2, paddingLeft: 16, marginTop: 8 },
  setupBtn: {
    width: '100%', padding: '12px', border: 'none', borderRadius: 6,
    backgroundColor: '#6C63FF', color: '#FFF', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  settingUp: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: 16, color: '#888',
  },
  spinner: {
    width: 18, height: 18, border: '2px solid #2A2A4A', borderTopColor: '#6C63FF',
    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
  },
  resultCard: {
    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
    backgroundColor: 'rgba(76, 175, 80, 0.1)', border: '1px solid #2A4A2A', borderRadius: 8,
  },
  resultIcon: { fontSize: 18, color: '#4CAF50', fontWeight: 700 },
  resultTitle: { fontSize: 13, fontWeight: 600, color: '#E0E0E0' },
  resultDetail: { fontSize: 11, color: '#666', marginTop: 2 },
  errorCard: {
    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
    backgroundColor: 'rgba(255, 68, 68, 0.1)', border: '1px solid #4A2020', borderRadius: 8,
  },
  errorIcon: { fontSize: 18, color: '#FF6B6B', fontWeight: 700 },
  errorTitle: { fontSize: 13, fontWeight: 600, color: '#E0E0E0' },
  errorDetail: { fontSize: 11, color: '#FF6B6B', marginTop: 2 },
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
