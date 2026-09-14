// ─────────────────────────────────────────────────────────────────────────────
// Titan Installer — License Step
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { useInstallerStore } from '../store/installer-store.js';

export function LicenseStep() {
  const { licenseKey, setLicenseKey, licenseValid, setLicenseValid, nextStep, prevStep } = useInstallerStore();
  const [error, setError] = useState('');
  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = async () => {
    if (!licenseKey.trim()) {
      setError('Please enter a license key');
      return;
    }

    setIsActivating(true);
    setError('');

    try {
      const result = await window.installer.installer.activateLicense({ licenseKey: licenseKey.trim() });
      if (result.valid) {
        setLicenseValid(true);
      } else {
        setError(result.error ?? 'Invalid license key');
      }
    } catch {
      setError('Failed to activate license. Please check your connection.');
    }
    setIsActivating(false);
  };

  const handleSkip = async () => {
    await window.installer.installer.skipLicense();
    setLicenseValid(true);
  };

  if (licenseValid) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>License Activated</h2>
          <p style={styles.subtitle}>Your Titan license is valid</p>
        </div>
        <div style={styles.body}>
          <div style={styles.successBanner}>
            <span style={styles.successIcon}>✓</span>
            <span style={styles.successText}>License activated successfully</span>
          </div>
        </div>
        <div style={styles.footer}>
          <button onClick={nextStep} style={styles.nextBtn}>Next →</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>License Activation</h2>
        <p style={styles.subtitle}>Enter your Titan license key or continue with a trial</p>
      </div>

      <div style={styles.body}>
        <div style={styles.inputSection}>
          <label style={styles.label}>License Key</label>
          <input
            type="text"
            value={licenseKey}
            onChange={e => { setLicenseKey(e.target.value); setError(''); }}
            placeholder="TITAN-XXXX-XXXX-XXXX"
            style={styles.licenseInput}
          />
          {error && <div style={styles.error}>{error}</div>}
          <button
            onClick={handleActivate}
            disabled={isActivating}
            style={styles.activateBtn}
          >
            {isActivating ? 'Activating...' : 'Activate License'}
          </button>
        </div>

        <div style={styles.divider}>
          <span style={styles.dividerText}>or</span>
        </div>

        <div style={styles.trialSection}>
          <p style={styles.trialText}>
            Continue with a 30-day trial. No credit card required.
          </p>
          <button onClick={handleSkip} style={styles.trialBtn}>
            Start Free Trial
          </button>
        </div>

        <div style={styles.infoBox}>
          <div style={styles.infoTitle}>License Types</div>
          <div style={styles.licenseGrid}>
            <div style={styles.licenseType}>
              <strong>Trial</strong> — 30 days, full features, 1 seat
            </div>
            <div style={styles.licenseType}>
              <strong>Standard</strong> — Per-seat, core apps
            </div>
            <div style={styles.licenseType}>
              <strong>Professional</strong> — All apps + priority support
            </div>
            <div style={styles.licenseType}>
              <strong>Enterprise</strong> — Unlimited seats + SLA
            </div>
          </div>
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
  body: { flex: 1, padding: '16px 24px', overflow: 'auto' },
  inputSection: { marginBottom: 16 },
  label: { display: 'block', fontSize: 11, color: '#666', textTransform: 'uppercase', marginBottom: 6 },
  licenseInput: {
    width: '100%', padding: '12px 14px', border: '1px solid #2A2A4A', borderRadius: 6,
    backgroundColor: '#1A1A30', color: '#E0E0E0', fontSize: 15, outline: 'none',
    fontFamily: 'monospace', letterSpacing: 1,
  },
  error: { fontSize: 12, color: '#FF6B6B', marginTop: 6 },
  activateBtn: {
    marginTop: 10, padding: '10px 20px', border: 'none', borderRadius: 6,
    backgroundColor: '#6C63FF', color: '#FFF', fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  divider: {
    display: 'flex', alignItems: 'center', margin: '16px 0',
    borderTop: '1px solid #1E1E3A',
  },
  dividerText: { fontSize: 11, color: '#555', padding: '0 12px', position: 'relative', top: -1, backgroundColor: '#0D0D1A' },
  trialSection: { textAlign: 'center', marginBottom: 20 },
  trialText: { fontSize: 13, color: '#888', marginBottom: 10 },
  trialBtn: {
    padding: '10px 24px', border: '1px solid #2A2A4A', borderRadius: 6,
    backgroundColor: 'transparent', color: '#AAA', fontSize: 13, cursor: 'pointer',
  },
  successBanner: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '16px',
    backgroundColor: 'rgba(76, 175, 80, 0.1)', border: '1px solid #2A4A2A', borderRadius: 8,
  },
  successIcon: { fontSize: 18, color: '#4CAF50', fontWeight: 700 },
  successText: { fontSize: 14, color: '#E0E0E0', fontWeight: 600 },
  infoBox: {
    padding: '14px 16px', border: '1px solid #1E1E3A', borderRadius: 8,
    backgroundColor: '#12122A',
  },
  infoTitle: { fontSize: 11, fontWeight: 600, color: '#888', marginBottom: 8 },
  licenseGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  licenseType: { fontSize: 12, color: '#666', padding: '4px 0' },
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
