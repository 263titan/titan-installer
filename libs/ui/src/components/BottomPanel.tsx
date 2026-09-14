import React, { useState, useCallback } from 'react';
import './BottomPanel.css';

// ─────────────────────────────────────────────────────────────────────────────
// Bottom Panel System for Titan Production Suite
// Implements: RIP Spooler Queue, Device Communications Log, Hardware Diagnostics, Engine Telemetry
// ─────────────────────────────────────────────────────────────────────────────

export interface BottomPanelProps {
  children: React.ReactNode;
  className?: string;
  height?: number;
  resizable?: boolean;
  defaultHeight?: number;
  minHeight?: number;
  maxHeight?: number;
}

export function BottomPanel({
  children,
  className = '',
  height,
  resizable = true,
  defaultHeight = 200,
  minHeight = 100,
  maxHeight = 400,
}: BottomPanelProps) {
  const [panelHeight, setPanelHeight] = useState(height || defaultHeight);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!resizable) return;
      setIsResizing(true);
      e.preventDefault();
    },
    [resizable],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const newHeight = window.innerHeight - e.clientY;
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setPanelHeight(newHeight);
      }
    },
    [isResizing, minHeight, maxHeight],
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
    return undefined;
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`titan-bottom-panel ${className}${isCollapsed ? ' collapsed' : ''}`}
      style={{ height: isCollapsed ? 32 : panelHeight }}
    >
      {/* Panel Header */}
      <div className="titan-bottom-panel-header">
        <div className="titan-bottom-panel-title">
          <button
            className="titan-bottom-panel-collapse"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d={isCollapsed ? 'M4 2l4 4-4 4' : 'M2 4l4 4 4-4'}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span>System Panel</span>
        </div>
        <div className="titan-bottom-panel-tabs">
          <BottomPanelTab active>Queue</BottomPanelTab>
          <BottomPanelTab>Log</BottomPanelTab>
          <BottomPanelTab>Diagnostics</BottomPanelTab>
          <BottomPanelTab>Telemetry</BottomPanelTab>
        </div>
      </div>

      {/* Panel Content */}
      {!isCollapsed && <div className="titan-bottom-panel-content">{children}</div>}

      {/* Resize Handle */}
      {resizable && !isCollapsed && (
        <div
          className={`titan-bottom-panel-resize-handle${isResizing ? ' resizing' : ''}`}
          onMouseDown={handleMouseDown}
        />
      )}
    </div>
  );
}

function BottomPanelTab({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return <button className={`titan-bottom-panel-tab${active ? ' active' : ''}`}>{children}</button>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Spooler Queue Component
// ─────────────────────────────────────────────────────────────────────────────

export interface SpoolerJob {
  id: string;
  name: string;
  targetDevice: string;
  status: 'queued' | 'ripping' | 'printing' | 'completed' | 'error';
  pages: number;
  copies: number;
  estimatedTime: number; // seconds
  inkConsumption: number; // mL
  progress?: number; // 0-100
}

export interface SpoolerQueueProps {
  jobs: SpoolerJob[];
  onJobAction?: (jobId: string, action: string) => void;
  className?: string;
}

export function SpoolerQueue({ jobs, onJobAction: _onJobAction, className = '' }: SpoolerQueueProps) {
  const statusColors = {
    queued: '#888',
    ripping: '#f59e0b',
    printing: '#10b981',
    completed: '#6366f1',
    error: '#ef4444',
  };

  const statusIcons = {
    queued: '○',
    ripping: '◌',
    printing: '◉',
    completed: '✓',
    error: '✕',
  };

  return (
    <div className={`titan-spooler-queue ${className}`}>
      <div className="titan-spooler-header">
        <span className="titan-spooler-title">Job Queue</span>
        <span className="titan-spooler-count">{jobs.length} jobs</span>
      </div>
      <div className="titan-spooler-list">
        {jobs.map((job) => (
          <div key={job.id} className="titan-spooler-job">
            <div className="titan-spooler-job-main">
              <span className="titan-spooler-status" style={{ color: statusColors[job.status] }}>
                {statusIcons[job.status]}
              </span>
              <span className="titan-spooler-name">{job.name}</span>
              <span className="titan-spooler-device">{job.targetDevice}</span>
            </div>
            <div className="titan-spooler-job-details">
              <span className="titan-spooler-meta">
                {job.pages}p × {job.copies}c
              </span>
              <span className="titan-spooler-meta">{Math.round(job.inkConsumption)}mL</span>
              <span className="titan-spooler-meta">{Math.round(job.estimatedTime / 60)}m</span>
              {job.progress !== undefined && (
                <div className="titan-spooler-progress">
                  <div
                    className="titan-spooler-progress-bar"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        {jobs.length === 0 && <div className="titan-spooler-empty">No jobs in queue</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Device Log Component
// ─────────────────────────────────────────────────────────────────────────────

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  source: string;
  message: string;
}

export interface DeviceLogProps {
  entries: LogEntry[];
  className?: string;
  maxEntries?: number;
}

export function DeviceLog({ entries, className = '', maxEntries = 100 }: DeviceLogProps) {
  const levelColors = {
    info: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    debug: '#6366f1',
  };

  const displayEntries = entries.slice(-maxEntries);

  return (
    <div className={`titan-device-log ${className}`}>
      <div className="titan-log-header">
        <span className="titan-log-title">Device Communications Log</span>
        <span className="titan-log-count">{entries.length} entries</span>
      </div>
      <div className="titan-log-list">
        {displayEntries.map((entry) => (
          <div key={entry.id} className="titan-log-entry">
            <span className="titan-log-timestamp">{entry.timestamp.toLocaleTimeString()}</span>
            <span className="titan-log-level" style={{ color: levelColors[entry.level] }}>
              {entry.level.toUpperCase()}
            </span>
            <span className="titan-log-source">{entry.source}</span>
            <span className="titan-log-message">{entry.message}</span>
          </div>
        ))}
        {entries.length === 0 && <div className="titan-log-empty">No log entries</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hardware Diagnostics Component
// ─────────────────────────────────────────────────────────────────────────────

export interface DiagnosticMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  min?: number;
  max?: number;
}

export interface HardwareDiagnosticsProps {
  metrics: DiagnosticMetric[];
  deviceName: string;
  connectionStatus: 'connected' | 'disconnected' | 'error';
  className?: string;
}

export function HardwareDiagnostics({
  metrics,
  deviceName,
  connectionStatus,
  className = '',
}: HardwareDiagnosticsProps) {
  const statusColors = {
    normal: '#10b981',
    warning: '#f59e0b',
    critical: '#ef4444',
  };

  const connectionColors = {
    connected: '#10b981',
    disconnected: '#888',
    error: '#ef4444',
  };

  return (
    <div className={`titan-hardware-diagnostics ${className}`}>
      <div className="titan-diagnostics-header">
        <span className="titan-diagnostics-title">Hardware Diagnostics</span>
        <span
          className="titan-diagnostics-status"
          style={{ color: connectionColors[connectionStatus] }}
        >
          {connectionStatus.toUpperCase()}
        </span>
      </div>
      <div className="titan-diagnostics-device">
        <span className="titan-diagnostics-device-name">{deviceName}</span>
      </div>
      <div className="titan-diagnostics-metrics">
        {metrics.map((metric) => (
          <div key={metric.id} className="titan-diagnostic-metric">
            <div className="titan-diagnostic-metric-header">
              <span className="titan-diagnostic-name">{metric.name}</span>
              <span
                className="titan-diagnostic-status"
                style={{ color: statusColors[metric.status] }}
              >
                {metric.status.toUpperCase()}
              </span>
            </div>
            <div className="titan-diagnostic-value">
              <span className="titan-diagnostic-number">{metric.value.toFixed(2)}</span>
              <span className="titan-diagnostic-unit">{metric.unit}</span>
            </div>
            {metric.min !== undefined && metric.max !== undefined && (
              <div className="titan-diagnostic-range">
                <span className="titan-diagnostic-range-min">{metric.min}</span>
                <div className="titan-diagnostic-range-bar">
                  <div
                    className="titan-diagnostic-range-fill"
                    style={{
                      left: `${((metric.min || 0) / (metric.max || 1)) * 100}%`,
                      width: `${((metric.value - (metric.min || 0)) / ((metric.max || 1) - (metric.min || 0))) * 100}%`,
                      backgroundColor: statusColors[metric.status],
                    }}
                  />
                </div>
                <span className="titan-diagnostic-range-max">{metric.max}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Engine Telemetry Component
// ─────────────────────────────────────────────────────────────────────────────

export interface TelemetryData {
  engineName: string;
  uptime: number; // seconds
  memoryUsage: number; // MB
  cpuUsage: number; // percentage
  threadCount: number;
  operationsPerSecond: number;
  bufferPoolSize: number; // MB
  bufferPoolUtilization: number; // percentage
  cacheHitRate: number; // percentage
}

export interface EngineTelemetryProps {
  data: TelemetryData[];
  className?: string;
}

export function EngineTelemetry({ data, className = '' }: EngineTelemetryProps) {
  return (
    <div className={`titan-engine-telemetry ${className}`}>
      <div className="titan-telemetry-header">
        <span className="titan-telemetry-title">Engine Telemetry</span>
        <span className="titan-telemetry-count">{data.length} engines</span>
      </div>
      <div className="titan-telemetry-grid">
        {data.map((engine) => (
          <div key={engine.engineName} className="titan-telemetry-card">
            <div className="titan-telemetry-card-header">
              <span className="titan-telemetry-engine-name">{engine.engineName}</span>
              <span className="titan-telemetry-uptime">
                {Math.round(engine.uptime / 60)}m uptime
              </span>
            </div>
            <div className="titan-telemetry-metrics">
              <div className="titan-telemetry-metric">
                <span className="titan-telemetry-label">Memory</span>
                <div className="titan-telemetry-bar">
                  <div
                    className="titan-telemetry-bar-fill"
                    style={{ width: `${(engine.memoryUsage / 4096) * 100}%` }}
                  />
                </div>
                <span className="titan-telemetry-value">{engine.memoryUsage.toFixed(0)} MB</span>
              </div>
              <div className="titan-telemetry-metric">
                <span className="titan-telemetry-label">CPU</span>
                <div className="titan-telemetry-bar">
                  <div
                    className="titan-telemetry-bar-fill"
                    style={{ width: `${engine.cpuUsage}%` }}
                  />
                </div>
                <span className="titan-telemetry-value">{engine.cpuUsage.toFixed(1)}%</span>
              </div>
              <div className="titan-telemetry-metric">
                <span className="titan-telemetry-label">Buffer Pool</span>
                <div className="titan-telemetry-bar">
                  <div
                    className="titan-telemetry-bar-fill"
                    style={{ width: `${engine.bufferPoolUtilization}%` }}
                  />
                </div>
                <span className="titan-telemetry-value">
                  {engine.bufferPoolUtilization.toFixed(1)}%
                </span>
              </div>
              <div className="titan-telemetry-stats">
                <span className="titan-telemetry-stat">{engine.threadCount} threads</span>
                <span className="titan-telemetry-stat">
                  {engine.operationsPerSecond.toFixed(0)} ops/s
                </span>
                <span className="titan-telemetry-stat">
                  {engine.cacheHitRate.toFixed(1)}% cache
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
