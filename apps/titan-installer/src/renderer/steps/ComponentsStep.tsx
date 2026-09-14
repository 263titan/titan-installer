// ─────────────────────────────────────────────────────────────────────────────
// Titan Installer — Components Step
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { useInstallerStore } from '../store/installer-store.js';
import type { Component } from '../store/installer-store.js';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

const CATEGORY_LABELS: Record<string, string> = {
  core: 'Core Applications',
  service: 'Background Services',
  tool: 'Utilities',
  mobile: 'Mobile',
};

export function ComponentsStep() {
  const { components, toggleComponent, totalSizeBytes, nextStep, prevStep } = useInstallerStore();

  const grouped = components.reduce<Record<string, Component[]>>((acc, comp) => {
    (acc[comp.category] ??= []).push(comp);
    return acc;
  }, {});

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Select Components</h2>
        <p style={styles.subtitle}>Choose which Titan apps to install</p>
      </div>

      <div style={styles.list}>
        {Object.entries(grouped).map(([category, comps]) => (
          <div key={category} style={styles.category}>
            <h3 style={styles.categoryTitle}>{CATEGORY_LABELS[category] ?? category}</h3>
            {comps.map(comp => (
              <div
                key={comp.id}
                onClick={() => toggleComponent(comp.id)}
                style={{
                  ...styles.componentCard,
                  ...(comp.selected ? styles.componentCardSelected : {}),
                  ...(comp.required ? styles.componentCardRequired : {}),
                }}
              >
                <div style={styles.checkbox}>
                  <div style={{
                    ...styles.checkboxInner,
                    backgroundColor: comp.selected ? '#6C63FF' : 'transparent',
                    borderColor: comp.selected ? '#6C63FF' : '#3A3A5A',
                  }}>
                    {comp.selected && <span style={styles.checkmark}>✓</span>}
                  </div>
                </div>
                <div style={styles.componentInfo}>
                  <div style={styles.componentName}>{comp.name}</div>
                  <div style={styles.componentDesc}>{comp.description}</div>
                </div>
                <div style={styles.componentMeta}>
                  <span style={styles.componentSize}>{formatBytes(comp.sizeBytes)}</span>
                  {comp.required && <span style={styles.requiredBadge}>Required</span>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <div style={styles.summary}>
          {components.filter(c => c.selected).length} components selected — {formatBytes(totalSizeBytes())}
        </div>
        <div style={styles.actions}>
          <button onClick={prevStep} style={styles.backBtn}>← Back</button>
          <button onClick={nextStep} style={styles.nextBtn}>Next →</button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', height: '100%' },
  header: { padding: '20px 24px 8px' },
  title: { fontSize: 20, fontWeight: 700, margin: 0, color: '#FFF' },
  subtitle: { fontSize: 12, color: '#666', marginTop: 4 },
  list: { flex: 1, overflow: 'auto', padding: '8px 24px' },
  category: { marginBottom: 16 },
  categoryTitle: { fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  componentCard: {
    display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
    border: '1px solid #1E1E3A', borderRadius: 8, marginBottom: 6,
    cursor: 'pointer', transition: 'all 0.12s',
  },
  componentCardSelected: { borderColor: '#6C63FF', backgroundColor: 'rgba(108, 99, 255, 0.08)' },
  componentCardRequired: { opacity: 0.7, cursor: 'default' },
  checkbox: { flexShrink: 0 },
  checkboxInner: {
    width: 20, height: 20, borderRadius: 4, border: '2px solid #3A3A5A',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.12s',
  },
  checkmark: { color: '#FFF', fontSize: 12, fontWeight: 700 },
  componentInfo: { flex: 1 },
  componentName: { fontSize: 13, fontWeight: 600, color: '#E0E0E0' },
  componentDesc: { fontSize: 11, color: '#666', marginTop: 2 },
  componentMeta: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 },
  componentSize: { fontSize: 11, color: '#555' },
  requiredBadge: {
    fontSize: 9, padding: '2px 6px', borderRadius: 4, backgroundColor: '#2A2A4A',
    color: '#888', textTransform: 'uppercase',
  },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 24px', borderTop: '1px solid #1E1E3A',
  },
  summary: { fontSize: 12, color: '#888' },
  actions: { display: 'flex', gap: 8 },
  backBtn: {
    padding: '8px 16px', border: '1px solid #2A2A4A', borderRadius: 6,
    backgroundColor: 'transparent', color: '#AAA', fontSize: 13, cursor: 'pointer',
  },
  nextBtn: {
    padding: '8px 20px', border: 'none', borderRadius: 6,
    backgroundColor: '#6C63FF', color: '#FFF', fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
};
