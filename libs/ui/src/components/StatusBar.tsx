import React from 'react';
import './StatusBar.css';

// ─────────────────────────────────────────────────────────────────────────────
// Status Bar System for Titan Production Suite
// Widgets: Cursor X/Y, Selection Specs, Active ICC Profile, Buffer Pool %, License Status
// ─────────────────────────────────────────────────────────────────────────────

export interface StatusBarWidget {
  id: string;
  content: React.ReactNode;
  separator?: boolean;
  className?: string;
}

export interface StatusBarProps {
  leftWidgets?: StatusBarWidget[];
  rightWidgets?: StatusBarWidget[];
  className?: string;
}

export function StatusBar({ leftWidgets = [], rightWidgets = [], className = '' }: StatusBarProps) {
  return (
    <div className={`titan-status-bar ${className}`}>
      {/* Left side widgets */}
      <div className="titan-status-bar-left">
        {leftWidgets.map((widget, index) => (
          <React.Fragment key={widget.id}>
            {index > 0 && widget.separator !== false && <div className="titan-status-separator" />}
            <div className={`titan-status-widget ${widget.className || ''}`}>{widget.content}</div>
          </React.Fragment>
        ))}
      </div>

      {/* Spacer */}
      <div className="titan-status-spacer" />

      {/* Right side widgets */}
      <div className="titan-status-bar-right">
        {rightWidgets.map((widget, index) => (
          <React.Fragment key={widget.id}>
            {index > 0 && widget.separator !== false && <div className="titan-status-separator" />}
            <div className={`titan-status-widget ${widget.className || ''}`}>{widget.content}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Status Widget Components
// ─────────────────────────────────────────────────────────────────────────────

export interface CursorPositionProps {
  x: number;
  y: number;
  unit?: 'mm' | 'in' | 'pt' | 'px';
}

export function CursorPosition({ x, y, unit = 'mm' }: CursorPositionProps) {
  return (
    <div className="titan-cursor-position">
      <span className="titan-cursor-label">X:</span>
      <span className="titan-cursor-value">{x.toFixed(2)}</span>
      <span className="titan-cursor-unit">{unit}</span>
      <span className="titan-cursor-label">Y:</span>
      <span className="titan-cursor-value">{y.toFixed(2)}</span>
      <span className="titan-cursor-unit">{unit}</span>
    </div>
  );
}

export interface SelectionSpecsProps {
  count: number;
  type?: string;
  dimensions?: { width: number; height: number };
}

export function SelectionSpecs({ count, type, dimensions }: SelectionSpecsProps) {
  if (count === 0) {
    return (
      <div className="titan-selection-specs">
        <span className="titan-selection-empty">No selection</span>
      </div>
    );
  }

  return (
    <div className="titan-selection-specs">
      <span className="titan-selection-count">{count}</span>
      <span className="titan-selection-label">object{count !== 1 ? 's' : ''}</span>
      {type && (
        <>
          <span className="titan-selection-sep">·</span>
          <span className="titan-selection-type">{type}</span>
        </>
      )}
      {dimensions && (
        <>
          <span className="titan-selection-sep">·</span>
          <span className="titan-selection-dim">
            {dimensions.width.toFixed(1)} × {dimensions.height.toFixed(1)}
          </span>
        </>
      )}
    </div>
  );
}

export interface ICCProfileProps {
  profile: string;
  certified?: boolean;
  renderingIntent?: string;
}

export function ICCProfile({ profile, certified = false, renderingIntent }: ICCProfileProps) {
  return (
    <div className="titan-icc-profile">
      {certified && <span className="titan-icc-certified">✓</span>}
      <span className="titan-icc-name">{profile}</span>
      {renderingIntent && (
        <>
          <span className="titan-icc-sep">·</span>
          <span className="titan-icc-intent">{renderingIntent}</span>
        </>
      )}
    </div>
  );
}

export interface BufferPoolProps {
  used: number;
  total: number;
  unit?: 'MB' | 'GB';
  cacheHitRate?: number;
}

export function BufferPool({ used, total, unit = 'MB', cacheHitRate }: BufferPoolProps) {
  const percentage = (used / total) * 100;
  const displayUsed = unit === 'GB' ? (used / 1024).toFixed(1) : used.toFixed(0);
  const displayTotal = unit === 'GB' ? (total / 1024).toFixed(1) : total.toFixed(0);

  return (
    <div className="titan-buffer-pool">
      <span className="titan-buffer-label">Buffer:</span>
      <div className="titan-buffer-bar">
        <div className="titan-buffer-fill" style={{ width: `${percentage}%` }} />
      </div>
      <span className="titan-buffer-value">
        {displayUsed}/{displayTotal} {unit}
      </span>
      {cacheHitRate !== undefined && (
        <>
          <span className="titan-buffer-sep">·</span>
          <span className="titan-buffer-cache">{cacheHitRate.toFixed(0)}% hit</span>
        </>
      )}
    </div>
  );
}

export interface LicenseStatusProps {
  status: 'active' | 'trial' | 'expired' | 'invalid';
  tier?: string;
  expiry?: Date;
}

export function LicenseStatus({ status, tier, expiry }: LicenseStatusProps) {
  const statusConfig = {
    active: { color: '#10b981', label: 'ACTIVE' },
    trial: { color: '#f59e0b', label: 'TRIAL' },
    expired: { color: '#ef4444', label: 'EXPIRED' },
    invalid: { color: '#ef4444', label: 'INVALID' },
  };

  const config = statusConfig[status];

  return (
    <div className="titan-license-status">
      <span className="titan-license-indicator" style={{ background: config.color }} />
      <span className="titan-license-label" style={{ color: config.color }}>
        {config.label}
      </span>
      {tier && (
        <>
          <span className="titan-license-sep">·</span>
          <span className="titan-license-tier">{tier}</span>
        </>
      )}
      {expiry && status === 'trial' && (
        <>
          <span className="titan-license-sep">·</span>
          <span className="titan-license-expiry">
            {Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d left
          </span>
        </>
      )}
    </div>
  );
}

export interface ZoomWidgetProps {
  zoom: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
}

export function ZoomWidget({ zoom, onZoomIn, onZoomOut, onZoomReset }: ZoomWidgetProps) {
  return (
    <div className="titan-zoom-widget">
      <button className="titan-zoom-btn" onClick={onZoomOut} title="Zoom out">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="5" cy="5" r="3" />
          <path d="M8 8l2.5 2.5" />
          <path d="M3 5h4" />
        </svg>
      </button>
      <span className="titan-zoom-value">{Math.round(zoom * 100)}%</span>
      <button className="titan-zoom-btn" onClick={onZoomIn} title="Zoom in">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="5" cy="5" r="3" />
          <path d="M8 8l2.5 2.5" />
          <path d="M3 5h4M5 3v4" />
        </svg>
      </button>
      <button className="titan-zoom-btn" onClick={onZoomReset} title="Reset zoom">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M2 4V2a1 1 0 011-1h2M9 2h2a1 1 0 011 1v2M10 9v2a1 1 0 01-1 1H8M4 10H2a1 1 0 01-1-1V8" />
        </svg>
      </button>
    </div>
  );
}

export interface ToolInfoProps {
  tool: string;
  shortcut?: string;
  engine?: string;
}

export function ToolInfo({ tool, shortcut, engine }: ToolInfoProps) {
  return (
    <div className="titan-tool-info">
      <span className="titan-tool-name">{tool}</span>
      {shortcut && (
        <>
          <span className="titan-tool-sep">·</span>
          <span className="titan-tool-shortcut">{shortcut}</span>
        </>
      )}
      {engine && (
        <>
          <span className="titan-tool-sep">·</span>
          <span className="titan-tool-engine">{engine}</span>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Status Bar Configuration
// ─────────────────────────────────────────────────────────────────────────────

export interface DefaultStatusBarProps {
  cursorX: number;
  cursorY: number;
  selectionCount: number;
  selectionType?: string;
  selectionDimensions?: { width: number; height: number };
  iccProfile: string;
  iccCertified?: boolean;
  bufferUsed: number;
  bufferTotal: number;
  cacheHitRate?: number;
  licenseStatus: 'active' | 'trial' | 'expired' | 'invalid';
  licenseTier?: string;
  licenseExpiry?: Date;
  zoom: number;
  activeTool: string;
  toolShortcut?: string;
  toolEngine?: string;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  className?: string;
}

export function DefaultStatusBar({
  cursorX,
  cursorY,
  selectionCount,
  selectionType,
  selectionDimensions,
  iccProfile,
  iccCertified,
  bufferUsed,
  bufferTotal,
  cacheHitRate,
  licenseStatus,
  licenseTier,
  licenseExpiry,
  zoom,
  activeTool,
  toolShortcut,
  toolEngine,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  className = '',
}: DefaultStatusBarProps) {
  const leftWidgets: StatusBarWidget[] = [
    {
      id: 'cursor',
      content: <CursorPosition x={cursorX} y={cursorY} />,
    },
    {
      id: 'selection',
      content: (
        <SelectionSpecs
          count={selectionCount}
          type={selectionType}
          dimensions={selectionDimensions}
        />
      ),
    },
    {
      id: 'tool',
      content: <ToolInfo tool={activeTool} shortcut={toolShortcut} engine={toolEngine} />,
    },
  ];

  const rightWidgets: StatusBarWidget[] = [
    {
      id: 'icc',
      content: <ICCProfile profile={iccProfile} certified={iccCertified} />,
    },
    {
      id: 'buffer',
      content: <BufferPool used={bufferUsed} total={bufferTotal} cacheHitRate={cacheHitRate} />,
    },
    {
      id: 'zoom',
      content: (
        <ZoomWidget
          zoom={zoom}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onZoomReset={onZoomReset}
        />
      ),
    },
    {
      id: 'license',
      content: <LicenseStatus status={licenseStatus} tier={licenseTier} expiry={licenseExpiry} />,
    },
  ];

  return <StatusBar leftWidgets={leftWidgets} rightWidgets={rightWidgets} className={className} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Real-time Dual-Watermark Buffer Gauge
// ─────────────────────────────────────────────────────────────────────────────

export interface BufferGaugeProps {
  bytesUsed: number;
  totalCapacity: number; // e.g. 65536 bytes
  className?: string;
}

export const HardwareBufferGauge: React.FC<BufferGaugeProps> = ({
  bytesUsed,
  totalCapacity,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (bytesUsed / totalCapacity) * 100));

  let statusColor = 'bg-emerald-500 text-emerald-400';
  let badgeText = 'NOMINAL';
  let isAlarm = false;

  if (percentage >= 90) {
    statusColor = 'bg-rose-500 text-rose-400';
    badgeText = 'HIGH WATERMARK';
    isAlarm = true;
  } else if (percentage >= 50) {
    statusColor = 'bg-amber-500 text-amber-400';
    badgeText = 'THROTTLED';
  }

  return (
    <div className={`flex items-center gap-3 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 ${className}`}>
      <div className="flex flex-col gap-1 w-28">
        <div className="flex justify-between text-[10px] font-mono font-medium text-slate-400">
          <span>BUF</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${statusColor.split(' ')[0]} ${
              isAlarm ? 'animate-pulse' : ''
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <span
        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border border-current font-semibold ${
          statusColor.split(' ')[1]
        } bg-slate-950`}
      >
        {badgeText}
      </span>
    </div>
  );
};

