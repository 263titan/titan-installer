// ─────────────────────────────────────────────────────────────────────────────
// Titan Installer — Device Discovery Step
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect } from 'react';
import { useInstallerStore } from '../store/installer-store.js';

export function DeviceDiscoveryStep() {
  const { discoveredDevices, setDiscoveredDevices, nextStep, prevStep } = useInstallerStore();

  useEffect(() => {
    async function discover() {
      const result = await window.installer.installer.discoverDevices();
      setDiscoveredDevices(result.devices);
    }
    discover();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Device Discovery</h2>
        <p style={styles.subtitle}>Scanning for connected printers and cutters</p>
      </div>

      <div style={styles.body}>
        {discoveredDevices.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔍</div>
            <p style={styles.emptyText}>Scanning for devices...</p>
            <p style={styles.emptyHint}>
              Titan will detect USB and network-connected printers and cutters.
              You can also configure devices later from the launcher.
            </p>
          </div>
        ) : (
          <>
            <div style={styles.foundLabel}>
              {discoveredDevices.length} device(s) found:
            </div>
            {discoveredDevices.map(device => (
              <div key={device.id} style={styles.deviceCard}>
                <div style={styles.deviceIcon}>
                  {device.type === 'printer' ? '🖨' :
                    device.type === 'cutter' ? '✂' :
                      device.type === 'print-and-cut' ? '🖨✂' : '📊'}
                </div>
                <div style={styles.deviceInfo}>
                  <div style={styles.deviceName}>{device.name}</div>
                  <div style={styles.deviceMeta}>
                    {device.vendor} {device.model} · {device.protocol.toUpperCase()} · {device.address}
                  </div>
                </div>
                <div style={{
                  ...styles.deviceStatus,
                  ...(device.status === 'online' ? styles.statusOnline : styles.statusUnknown),
                }}>
                  {device.status}
                </div>
              </div>
            ))}
          </>
        )}

        <div style={styles.tipBox}>
          <div style={styles.tipTitle}>Device Setup Tips</div>
          <ul style={styles.tipList}>
            <li>USB devices are automatically detected when plugged in</li>
            <li>Network devices can be added manually by IP address</li>
            <li>Install manufacturer drivers for full feature support</li>
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
  body: { flex: 1, padding: '16px 24px', overflow: 'auto' },
  emptyState: { textAlign: 'center', padding: '40px 0' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#888' },
  emptyHint: { fontSize: 12, color: '#555', marginTop: 8, maxWidth: 400, margin: '8px auto 0' },
  foundLabel: { fontSize: 12, color: '#888', marginBottom: 12 },
  deviceCard: {
    display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
    border: '1px solid #1E1E3A', borderRadius: 8, marginBottom: 8,
    backgroundColor: '#12122A',
  },
  deviceIcon: { fontSize: 24, width: 40, textAlign: 'center' },
  deviceInfo: { flex: 1 },
  deviceName: { fontSize: 13, fontWeight: 600, color: '#E0E0E0' },
  deviceMeta: { fontSize: 11, color: '#666', marginTop: 2 },
  deviceStatus: {
    fontSize: 11, padding: '3px 8px', borderRadius: 4,
    textTransform: 'capitalize',
  },
  statusOnline: { backgroundColor: 'rgba(76, 175, 80, 0.15)', color: '#4CAF50' },
  statusUnknown: { backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#666' },
  tipBox: {
    marginTop: 16, padding: '14px 16px', border: '1px solid #1E1E3A', borderRadius: 8,
    backgroundColor: '#12122A',
  },
  tipTitle: { fontSize: 11, fontWeight: 600, color: '#888', marginBottom: 8 },
  tipList: { fontSize: 12, color: '#666', lineHeight: 2, paddingLeft: 16 },
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
