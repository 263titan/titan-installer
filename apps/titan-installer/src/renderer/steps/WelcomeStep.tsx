// ─────────────────────────────────────────────────────────────────────────────
// Titan Installer — Welcome Step
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { useInstallerStore } from '../store/installer-store.js';

export function WelcomeStep() {
  const { nextStep } = useInstallerStore();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.logo}>Titan</div>
        <div style={styles.subtitle}>Production Suite</div>
        <div style={styles.version}>v0.1.0</div>
      </div>

      <div style={styles.body}>
        <h2 style={styles.title}>Welcome to Titan Production Suite</h2>
        <p style={styles.description}>
          The next-generation print &amp; cut production platform. This wizard will
          guide you through installing Titan on your system.
        </p>

        <div style={styles.features}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>✂</span>
            <div>
              <strong>PlotSync</strong> — Vector design &amp; contour cutting
            </div>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🖨</span>
            <div>
              <strong>PrintSync</strong> — Professional RIP &amp; print management
            </div>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>☁</span>
            <div>
              <strong>CloudSync</strong> — Cloud sync &amp; remote job submission
            </div>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>⚡</span>
            <div>
              <strong>Device Integration</strong> — 200+ printer &amp; cutter drivers
            </div>
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <button onClick={nextStep} style={styles.startBtn}>
          Get Started →
        </button>
        <p style={styles.footerNote}>
          By continuing, you agree to Titan's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex', flexDirection: 'column', height: '100%',
    justifyContent: 'space-between',
  },
  hero: {
    textAlign: 'center', padding: '48px 24px 24px',
    background: 'linear-gradient(180deg, rgba(108,99,255,0.15) 0%, transparent 100%)',
  },
  logo: {
    fontSize: 42, fontWeight: 800, color: '#FFF', letterSpacing: -1,
    background: 'linear-gradient(135deg, #6C63FF, #A78BFA)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  subtitle: { fontSize: 18, color: '#AAA', marginTop: 4 },
  version: { fontSize: 12, color: '#666', marginTop: 8 },
  body: { flex: 1, padding: '24px 48px', maxWidth: 600, margin: '0 auto', width: '100%' },
  title: { fontSize: 22, fontWeight: 700, color: '#FFF', margin: 0 },
  description: { fontSize: 14, color: '#888', marginTop: 8, lineHeight: 1.6 },
  features: { marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 },
  feature: {
    display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
    backgroundColor: '#12122A', borderRadius: 8, border: '1px solid #1E1E3A',
  },
  featureIcon: { fontSize: 20, width: 32, textAlign: 'center' },
  footer: { padding: '24px 48px', textAlign: 'center' },
  startBtn: {
    padding: '12px 32px', border: 'none', borderRadius: 8,
    background: 'linear-gradient(135deg, #6C63FF, #5B54E6)',
    color: '#FFF', fontSize: 15, fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(108, 99, 255, 0.4)',
  },
  footerNote: { fontSize: 11, color: '#444', marginTop: 12 },
};
