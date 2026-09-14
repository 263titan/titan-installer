import React, { useState, useCallback } from 'react';
import './ContextualRibbon.css';

// ─────────────────────────────────────────────────────────────────────────────
// Contextual Ribbon System for Titan Production Suite
// Dynamic ribbon that changes based on active tool/workspace
// Sections: Tool Parameters | Preset Selectors | Transform Geometry | Layer Target | Action
// ─────────────────────────────────────────────────────────────────────────────

export interface RibbonSection {
  id: string;
  title: string;
  content: React.ReactNode;
  visible?: boolean;
}

export interface RibbonAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  primary?: boolean;
  onClick: () => void;
}

export interface ContextualRibbonProps {
  sections: RibbonSection[];
  actions?: RibbonAction[];
  className?: string;
  onSectionToggle?: (sectionId: string) => void;
}

export function ContextualRibbon({
  sections = [],
  actions = [],
  className = '',
  onSectionToggle,
}: ContextualRibbonProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleSectionClick = useCallback(
    (sectionId: string) => {
      const newActive = activeSection === sectionId ? null : sectionId;
      setActiveSection(newActive);
      if (onSectionToggle) {
        onSectionToggle(sectionId);
      }
    },
    [activeSection, onSectionToggle],
  );

  const visibleSections = sections.filter((s) => s.visible !== false);

  return (
    <div className={`titan-contextual-ribbon ${className}`}>
      {/* Ribbon Sections */}
      <div className="titan-ribbon-sections">
        {visibleSections.map((section) => (
          <RibbonSectionTab
            key={section.id}
            section={section}
            isActive={activeSection === section.id}
            onClick={() => handleSectionClick(section.id)}
          />
        ))}
      </div>

      {/* Ribbon Content Area */}
      {activeSection && (
        <div className="titan-ribbon-content">
          {visibleSections.find((s) => s.id === activeSection)?.content}
        </div>
      )}

      {/* Action Buttons */}
      {actions.length > 0 && (
        <div className="titan-ribbon-actions">
          {actions.map((action) => (
            <RibbonActionButton key={action.id} action={action} />
          ))}
        </div>
      )}
    </div>
  );
}

function RibbonSectionTab({
  section,
  isActive,
  onClick,
}: {
  section: RibbonSection;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button className={`titan-ribbon-tab${isActive ? ' active' : ''}`} onClick={onClick}>
      <span className="titan-ribbon-tab-title">{section.title}</span>
      <span className="titan-ribbon-tab-indicator" />
    </button>
  );
}

function RibbonActionButton({ action }: { action: RibbonAction }) {
  return (
    <button
      className={`titan-ribbon-action${action.primary ? ' primary' : ''}${action.disabled ? ' disabled' : ''}`}
      onClick={action.onClick}
      disabled={action.disabled}
      title={action.label}
    >
      {action.icon && <span className="titan-ribbon-action-icon">{action.icon}</span>}
      <span className="titan-ribbon-action-label">{action.label}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ribbon Section Components
// ─────────────────────────────────────────────────────────────────────────────

export interface ToolParameterProps {
  label: string;
  value: number | string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (value: number | string) => void;
  type?: 'number' | 'slider' | 'select';
  options?: { value: string; label: string }[];
}

export function ToolParameter({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  type = 'number',
  options,
}: ToolParameterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue =
      type === 'number' || type === 'slider' ? parseFloat(e.target.value) : e.target.value;
    onChange(newValue);
  };

  return (
    <div className="titan-tool-parameter">
      <label className="titan-tool-parameter-label">{label}</label>
      <div className="titan-tool-parameter-input-wrapper">
        {type === 'select' && options ? (
          <select
            className="titan-tool-parameter-select"
            value={value as string}
            onChange={handleChange}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : type === 'slider' ? (
          <>
            <input
              type="range"
              className="titan-tool-parameter-slider"
              value={value as number}
              min={min}
              max={max}
              step={step}
              onChange={handleChange}
            />
            <input
              type="number"
              className="titan-tool-parameter-number"
              value={value as number}
              min={min}
              max={max}
              step={step}
              onChange={handleChange}
            />
          </>
        ) : (
          <input
            type="number"
            className="titan-tool-parameter-number"
            value={value as number}
            min={min}
            max={max}
            step={step}
            onChange={handleChange}
          />
        )}
        {unit && <span className="titan-tool-parameter-unit">{unit}</span>}
      </div>
    </div>
  );
}

export interface PresetSelectorProps {
  label: string;
  presets: { id: string; name: string; icon?: React.ReactNode }[];
  selected: string;
  onSelect: (presetId: string) => void;
}

export function PresetSelector({ label, presets, selected, onSelect }: PresetSelectorProps) {
  return (
    <div className="titan-preset-selector">
      <label className="titan-preset-label">{label}</label>
      <div className="titan-preset-grid">
        {presets.map((preset) => (
          <button
            key={preset.id}
            className={`titan-preset-item${selected === preset.id ? ' active' : ''}`}
            onClick={() => onSelect(preset.id)}
            title={preset.name}
          >
            {preset.icon && <span className="titan-preset-icon">{preset.icon}</span>}
            <span className="titan-preset-name">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export interface TransformControlProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX?: number;
  scaleY?: number;
  onChange: (field: string, value: number) => void;
  onLockAspect?: (locked: boolean) => void;
}

export function TransformControl({
  x,
  y,
  width,
  height,
  rotation,
  scaleX: _scaleX = 1,
  scaleY: _scaleY = 1,
  onChange,
  onLockAspect,
}: TransformControlProps) {
  const [aspectLocked, setAspectLocked] = useState(true);

  const handleLockAspect = useCallback(
    (locked: boolean) => {
      setAspectLocked(locked);
      if (onLockAspect) onLockAspect(locked);
    },
    [onLockAspect],
  );

  const handleDimensionChange = useCallback(
    (field: 'width' | 'height', value: number) => {
      onChange(field, value);
      if (aspectLocked) {
        const aspect = width / height;
        if (field === 'width') {
          onChange('height', value / aspect);
        } else {
          onChange('width', value * aspect);
        }
      }
    },
    [width, height, aspectLocked, onChange],
  );

  return (
    <div className="titan-transform-control">
      <div className="titan-transform-row">
        <ToolParameter label="X" value={x} onChange={(v) => onChange('x', v as number)} />
        <ToolParameter label="Y" value={y} onChange={(v) => onChange('y', v as number)} />
      </div>
      <div className="titan-transform-row">
        <ToolParameter
          label="W"
          value={width}
          min={1}
          onChange={(v) => handleDimensionChange('width', v as number)}
        />
        <ToolParameter
          label="H"
          value={height}
          min={1}
          onChange={(v) => handleDimensionChange('height', v as number)}
        />
        <button
          className={`titan-aspect-lock${aspectLocked ? ' locked' : ''}`}
          onClick={() => handleLockAspect(!aspectLocked)}
          title={aspectLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {aspectLocked ? (
              <>
                <rect x="2" y="2" width="10" height="10" rx="1" />
                <path d="M7 2v10M2 7h10" />
              </>
            ) : (
              <>
                <rect x="2" y="2" width="10" height="10" rx="1" />
                <path d="M7 2v10M2 7h10" strokeDasharray="2 2" />
              </>
            )}
          </svg>
        </button>
      </div>
      <div className="titan-transform-row">
        <ToolParameter
          label="Rotation"
          value={rotation}
          min={-180}
          max={180}
          unit="°"
          onChange={(v) => onChange('rotation', v as number)}
        />
      </div>
    </div>
  );
}

export interface LayerTargetProps {
  layers: { id: string; name: string; color: string; visible: boolean }[];
  selected: string;
  onSelect: (layerId: string) => void;
  onToggleVisibility?: (layerId: string) => void;
}

export function LayerTarget({ layers, selected, onSelect, onToggleVisibility }: LayerTargetProps) {
  return (
    <div className="titan-layer-target">
      <label className="titan-layer-label">Target Layer</label>
      <div className="titan-layer-list">
        {layers.map((layer) => (
          <button
            key={layer.id}
            className={`titan-layer-item${selected === layer.id ? ' active' : ''}`}
            onClick={() => onSelect(layer.id)}
          >
            <span className="titan-layer-color" style={{ background: layer.color }} />
            <span className="titan-layer-name">{layer.name}</span>
            {onToggleVisibility && (
              <button
                className="titan-layer-visibility"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility(layer.id);
                }}
              >
                {layer.visible ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M1 6s2.5-3 5-3 5 3 5 3-2.5 3-5 3-5-3-5-3z" />
                    <circle cx="6" cy="6" r="1.5" />
                  </svg>
                ) : (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M1 1l10 10" />
                  </svg>
                )}
              </button>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
