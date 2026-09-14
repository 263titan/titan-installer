import React, { useState, useCallback } from 'react';
import './RightDocker.css';

// ─────────────────────────────────────────────────────────────────────────────
// Right Docker Tab System for Titan Production Suite
// Implements tabbed dockers: Nesting, Color, Hardware, Spooler, Properties Inspector
// ─────────────────────────────────────────────────────────────────────────────

export interface DockerTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface RightDockerProps {
  tabs: DockerTab[];
  defaultTab?: string;
  className?: string;
  onTabChange?: (tabId: string) => void;
  width?: number;
  resizable?: boolean;
}

export function RightDocker({
  tabs,
  defaultTab,
  className = '',
  onTabChange,
  width = 280,
  resizable = true,
}: RightDockerProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [dockerWidth, setDockerWidth] = useState(width);
  const [isResizing, setIsResizing] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleTabClick = useCallback(
    (tabId: string) => {
      if (tabs.find((t) => t.id === tabId)?.disabled) return;
      setActiveTab(tabId);
      if (collapsed) setCollapsed(false);
      if (onTabChange) onTabChange(tabId);
    },
    [collapsed, tabs, onTabChange],
  );

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
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 200 && newWidth <= 600) {
        setDockerWidth(newWidth);
      }
    },
    [isResizing],
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

  const activeTabContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <aside
      className={`titan-right-docker${collapsed ? ' collapsed' : ''} ${className}`}
      style={{ width: collapsed ? 42 : dockerWidth }}
      aria-label="PlotSync dockers"
    >
      <div className="titan-docker-header">
        {!collapsed && <span className="titan-docker-header-title">DOCKERS</span>}
        <button
          type="button"
          className="titan-docker-collapse"
          onClick={() => setCollapsed((value) => !value)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand dockers' : 'Collapse dockers'}
          title={collapsed ? 'Expand dockers' : 'Collapse dockers'}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={collapsed ? 'M6 3l5 5-5 5' : 'M10 3L5 8l5 5'} />
          </svg>
        </button>
      </div>

      {/* Tab Headers */}
      <div className="titan-docker-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`titan-docker-tab${activeTab === tab.id ? ' active' : ''}${tab.disabled ? ' disabled' : ''}`}
            onClick={() => handleTabClick(tab.id)}
            disabled={tab.disabled}
            title={tab.label}
          >
            {tab.icon && <span className="titan-docker-tab-icon">{tab.icon}</span>}
            <span className="titan-docker-tab-collapsed-label" aria-hidden="true">{tab.label.slice(0, 1)}</span>
            <span className="titan-docker-tab-label">{tab.label}</span>
            {tab.badge !== undefined && <span className="titan-docker-tab-badge">{tab.badge}</span>}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {!collapsed && <div className="titan-docker-content">{activeTabContent}</div>}

      {/* Resize Handle */}
      {resizable && !collapsed && (
        <div
          className={`titan-docker-resize-handle${isResizing ? ' resizing' : ''}`}
          onMouseDown={handleMouseDown}
        />
      )}
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Docker Panel Components
// ─────────────────────────────────────────────────────────────────────────────

export interface DockerPanelProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function DockerPanel({
  title,
  children,
  actions,
  collapsible = false,
  defaultCollapsed = false,
}: DockerPanelProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className="titan-docker-panel">
      <div className="titan-docker-panel-header">
        {collapsible && (
          <button className="titan-docker-panel-collapse" onClick={() => setCollapsed(!collapsed)}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d={collapsed ? 'M4 2l4 4-4 4' : 'M2 4l4 4 4-4'}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <span className="titan-docker-panel-title">{title}</span>
        {actions && <div className="titan-docker-panel-actions">{actions}</div>}
      </div>
      {!collapsed && <div className="titan-docker-panel-body">{children}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Nesting Docker Content (nest_engine integration)
// ─────────────────────────────────────────────────────────────────────────────

export interface NestingDockerProps {
  rollWidth: number;
  clearance: number;
  margin: number;
  rotations: string[];
  engineMode: 'fast' | 'balanced' | 'deep';
  yield?: number;
  runtime?: number;
  partsPlaced?: number;
  totalParts?: number;
  onRunNest: () => void;
  onExportReport: () => void;
  onChange: (field: string, value: number | string) => void;
}

export function NestingDocker({
  rollWidth,
  clearance,
  margin,
  rotations,
  engineMode,
  yield: yieldValue = 0,
  runtime = 0,
  partsPlaced = 0,
  totalParts = 0,
  onRunNest,
  onExportReport,
  onChange,
}: NestingDockerProps) {
  return (
    <div className="titan-nesting-docker">
      <DockerPanel title="Material Settings">
        <div className="titan-nesting-row">
          <label className="titan-nesting-label">Roll Width</label>
          <div className="titan-nesting-input-group">
            <input
              type="number"
              className="titan-nesting-input"
              value={rollWidth}
              onChange={(e) => onChange('rollWidth', parseFloat(e.target.value))}
            />
            <span className="titan-nesting-unit">mm</span>
          </div>
        </div>
        <div className="titan-nesting-row">
          <label className="titan-nesting-label">Clearance</label>
          <div className="titan-nesting-input-group">
            <input
              type="number"
              className="titan-nesting-input"
              value={clearance}
              step="0.5"
              onChange={(e) => onChange('clearance', parseFloat(e.target.value))}
            />
            <span className="titan-nesting-unit">mm</span>
          </div>
        </div>
        <div className="titan-nesting-row">
          <label className="titan-nesting-label">Margin</label>
          <div className="titan-nesting-input-group">
            <input
              type="number"
              className="titan-nesting-input"
              value={margin}
              onChange={(e) => onChange('margin', parseFloat(e.target.value))}
            />
            <span className="titan-nesting-unit">mm</span>
          </div>
        </div>
      </DockerPanel>

      <DockerPanel title="Nesting Options">
        <div className="titan-nesting-row">
          <label className="titan-nesting-label">Rotations</label>
          <select
            className="titan-nesting-select"
            value={rotations.join(',')}
            onChange={(e) => onChange('rotations', e.target.value)}
          >
            <option value="0">0°</option>
            <option value="0,90">0° / 90°</option>
            <option value="0,90,180">0° / 90° / 180°</option>
            <option value="0,90,180,270,360">Free (1° steps)</option>
          </select>
        </div>
        <div className="titan-nesting-row">
          <label className="titan-nesting-label">Engine Mode</label>
          <div className="titan-nesting-radio-group">
            {(['fast', 'balanced', 'deep'] as const).map((mode) => (
              <label key={mode} className="titan-nesting-radio">
                <input
                  type="radio"
                  name="engineMode"
                  value={mode}
                  checked={engineMode === mode}
                  onChange={() => onChange('engineMode', mode)}
                />
                <span className="titan-nesting-radio-label">
                  {mode === 'fast' ? 'Fast' : mode === 'balanced' ? 'Balanced' : 'Deep NFP'}
                </span>
              </label>
            ))}
          </div>
        </div>
      </DockerPanel>

      {yieldValue > 0 && (
        <DockerPanel title="Results">
          <div className="titan-nesting-results">
            <div className="titan-nesting-result-row">
              <span className="titan-nesting-result-label">Material Yield</span>
              <div className="titan-nesting-progress-bar">
                <div className="titan-nesting-progress-fill" style={{ width: `${yieldValue}%` }} />
              </div>
              <span className="titan-nesting-result-value">{yieldValue.toFixed(1)}%</span>
            </div>
            <div className="titan-nesting-result-row">
              <span className="titan-nesting-result-label">Parts Placed</span>
              <span className="titan-nesting-result-value">
                {partsPlaced}/{totalParts}
              </span>
            </div>
            <div className="titan-nesting-result-row">
              <span className="titan-nesting-result-label">Runtime</span>
              <span className="titan-nesting-result-value">{runtime.toFixed(2)}s</span>
            </div>
          </div>
        </DockerPanel>
      )}

      <div className="titan-nesting-actions">
        <button className="titan-nesting-btn primary" onClick={onRunNest}>
          Run True-Shape Nest
        </button>
        <button className="titan-nesting-btn secondary" onClick={onExportReport}>
          Export Report
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Color Docker Content (titancolor integration)
// ─────────────────────────────────────────────────────────────────────────────

export interface ColorDockerProps {
  mediaProfile: string;
  renderingIntent: string;
  inkLimits: { c: number; m: number; y: number; k: number; total: number };
  softProofEnabled: boolean;
  gamutWarningEnabled: boolean;
  onProfileChange: (profile: string) => void;
  onIntentChange: (intent: string) => void;
  onInkLimitChange: (channel: string, value: number) => void;
  onSoftProofToggle: (enabled: boolean) => void;
  onGamutWarningToggle: (enabled: boolean) => void;
}

export function ColorDocker({
  mediaProfile,
  renderingIntent,
  inkLimits,
  softProofEnabled,
  gamutWarningEnabled,
  onProfileChange,
  onIntentChange,
  onInkLimitChange,
  onSoftProofToggle,
  onGamutWarningToggle,
}: ColorDockerProps) {
  return (
    <div className="titan-color-docker">
      <DockerPanel title="Color Profile">
        <div className="titan-color-row">
          <label className="titan-color-label">Media Profile</label>
          <select
            className="titan-color-select"
            value={mediaProfile}
            onChange={(e) => onProfileChange(e.target.value)}
          >
            <option value="srgb">sRGB IEC61966-2.1</option>
            <option value="cmyk">US Web Coated (SWOP) v2</option>
            <option value="p3">Display P3</option>
            <option value="prophoto">ProPhoto RGB</option>
          </select>
          <span className="titan-color-badge certified">✓ Certified</span>
        </div>
        <div className="titan-color-row">
          <label className="titan-color-label">Rendering Intent</label>
          <select
            className="titan-color-select"
            value={renderingIntent}
            onChange={(e) => onIntentChange(e.target.value)}
          >
            <option value="perceptual">Perceptual</option>
            <option value="relative">Relative Colorimetric</option>
            <option value="absolute">Absolute Colorimetric</option>
            <option value="saturation">Saturation</option>
          </select>
        </div>
      </DockerPanel>

      <DockerPanel title="Ink Limits">
        {(['c', 'm', 'y', 'k'] as const).map((channel) => (
          <div key={channel} className="titan-color-slider-row">
            <label className="titan-color-slider-label">{channel.toUpperCase()}</label>
            <input
              type="range"
              className="titan-color-slider"
              min="0"
              max="100"
              value={inkLimits[channel]}
              onChange={(e) => onInkLimitChange(channel, parseFloat(e.target.value))}
            />
            <input
              type="number"
              className="titan-color-number"
              min="0"
              max="100"
              value={inkLimits[channel]}
              onChange={(e) => onInkLimitChange(channel, parseFloat(e.target.value))}
            />
            <span className="titan-color-unit">%</span>
          </div>
        ))}
        <div className="titan-color-slider-row">
          <label className="titan-color-slider-label">Total</label>
          <input
            type="range"
            className="titan-color-slider"
            min="100"
            max="400"
            value={inkLimits.total}
            onChange={(e) => onInkLimitChange('total', parseFloat(e.target.value))}
          />
          <input
            type="number"
            className="titan-color-number"
            min="100"
            max="400"
            value={inkLimits.total}
            onChange={(e) => onInkLimitChange('total', parseFloat(e.target.value))}
          />
          <span className="titan-color-unit">%</span>
        </div>
      </DockerPanel>

      <DockerPanel title="Preview Overlays">
        <div className="titan-color-toggle-row">
          <label className="titan-color-toggle">
            <input
              type="checkbox"
              checked={softProofEnabled}
              onChange={(e) => onSoftProofToggle(e.target.checked)}
            />
            <span>Soft-Proof Preview</span>
          </label>
        </div>
        <div className="titan-color-toggle-row">
          <label className="titan-color-toggle">
            <input
              type="checkbox"
              checked={gamutWarningEnabled}
              onChange={(e) => onGamutWarningToggle(e.target.checked)}
            />
            <span>Gamut Warning</span>
          </label>
        </div>
      </DockerPanel>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Properties Inspector Docker
// ─────────────────────────────────────────────────────────────────────────────

export interface PropertiesInspectorProps {
  object?: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    opacity: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  };
  onChange: (field: string, value: number | string) => void;
}

export function PropertiesInspector({ object, onChange }: PropertiesInspectorProps) {
  if (!object) {
    return (
      <div className="titan-properties-docker">
        <div className="titan-properties-empty">No object selected</div>
      </div>
    );
  }

  return (
    <div className="titan-properties-docker">
      <DockerPanel title="Position">
        <div className="titan-prop-row">
          <label className="titan-prop-label">X</label>
          <input
            type="number"
            className="titan-prop-input"
            value={Math.round(object.x)}
            onChange={(e) => onChange('x', parseFloat(e.target.value))}
          />
          <label className="titan-prop-label">Y</label>
          <input
            type="number"
            className="titan-prop-input"
            value={Math.round(object.y)}
            onChange={(e) => onChange('y', parseFloat(e.target.value))}
          />
        </div>
      </DockerPanel>

      <DockerPanel title="Dimensions">
        <div className="titan-prop-row">
          <label className="titan-prop-label">W</label>
          <input
            type="number"
            className="titan-prop-input"
            value={Math.round(object.width)}
            min="1"
            onChange={(e) => onChange('width', parseFloat(e.target.value))}
          />
          <label className="titan-prop-label">H</label>
          <input
            type="number"
            className="titan-prop-input"
            value={Math.round(object.height)}
            min="1"
            onChange={(e) => onChange('height', parseFloat(e.target.value))}
          />
        </div>
      </DockerPanel>

      <DockerPanel title="Transform">
        <div className="titan-prop-row">
          <label className="titan-prop-label">Rotation</label>
          <input
            type="number"
            className="titan-prop-input"
            value={Math.round(object.rotation)}
            min="-180"
            max="180"
            onChange={(e) => onChange('rotation', parseFloat(e.target.value))}
          />
          <span className="titan-prop-unit">°</span>
        </div>
        <div className="titan-prop-row">
          <label className="titan-prop-label">Opacity</label>
          <input
            type="range"
            className="titan-prop-slider"
            min="0"
            max="100"
            value={Math.round(object.opacity * 100)}
            onChange={(e) => onChange('opacity', parseFloat(e.target.value) / 100)}
          />
          <span className="titan-prop-value">{Math.round(object.opacity * 100)}%</span>
        </div>
      </DockerPanel>

      {object.fill !== undefined && (
        <DockerPanel title="Appearance">
          <div className="titan-prop-row">
            <label className="titan-prop-label">Fill</label>
            <input
              type="color"
              className="titan-prop-color"
              value={object.fill === 'transparent' ? '#000000' : object.fill}
              onChange={(e) => onChange('fill', e.target.value)}
            />
          </div>
          {object.stroke !== undefined && (
            <div className="titan-prop-row">
              <label className="titan-prop-label">Stroke</label>
              <input
                type="color"
                className="titan-prop-color"
                value={object.stroke}
                onChange={(e) => onChange('stroke', e.target.value)}
              />
            </div>
          )}
          {object.strokeWidth !== undefined && (
            <div className="titan-prop-row">
              <label className="titan-prop-label">Stroke Width</label>
              <input
                type="number"
                className="titan-prop-input"
                value={object.strokeWidth}
                min="0"
                step="0.5"
                onChange={(e) => onChange('strokeWidth', parseFloat(e.target.value))}
              />
              <span className="titan-prop-unit">px</span>
            </div>
          )}
        </DockerPanel>
      )}
    </div>
  );
}
