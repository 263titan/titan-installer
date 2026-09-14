import React, { useState, useCallback, useRef, useEffect } from 'react';
import './LeftToolbar.css';

// ─────────────────────────────────────────────────────────────────────────────
// Left Toolbar System for Titan Production Suite
// Implements tool icons for PlotSync and PrintSync workspaces
// Tools: Select, Node Edit, Contour, Nest, Tiling, RegMark, etc.
// ─────────────────────────────────────────────────────────────────────────────

export interface ToolDef {
  id: string;
  label: string;
  shortcut?: string;
  icon: React.ReactNode;
  description?: string;
  maturity?: 'stable' | 'beta' | 'preview' | 'planned';
  engine?: string;
  engineMethod?: string;
  disabled?: boolean;
}

export interface ToolGroup {
  id: string;
  name: string;
  tools: ToolDef[];
}

export interface LeftToolbarProps {
  groups: ToolGroup[];
  activeToolId: string;
  onToolSelect: (toolId: string) => void;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  showFlyout?: boolean;
}

export function LeftToolbar({
  groups,
  activeToolId,
  onToolSelect,
  orientation = 'vertical',
  className = '',
  showFlyout = true,
}: LeftToolbarProps) {
  const [customizerOpen, setCustomizerOpen] = useState(false);

  // A toolbar slot belongs to a tool group, not to an individual tool. Keep
  // the group list unique so a caller cannot accidentally render the same
  // group twice in the rail or in the customizer.
  const uniqueGroups = groups.filter(
    (group, index, allGroups) => allGroups.findIndex((candidate) => candidate.id === group.id) === index,
  );
  const maxVisibleGroups = orientation === 'vertical' ? 10 : 12;
  const [visibleGroupIds, setVisibleGroupIds] = useState<string[]>(() =>
    uniqueGroups.slice(0, maxVisibleGroups).map((group) => group.id),
  );
  const visibleGroups = uniqueGroups.filter((group) => visibleGroupIds.includes(group.id));

  const handleToolSelect = useCallback(
    (toolId: string) => {
      onToolSelect(toolId);
    },
    [onToolSelect],
  );

  useEffect(() => {
    if (!customizerOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.titan-toolbar-customizer') && !target.closest('.titan-toolbar-customize')) {
        setCustomizerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [customizerOpen]);

  const toggleVisibleGroup = useCallback((groupId: string) => {
    setVisibleGroupIds((current) => {
      if (current.includes(groupId)) return current.filter((id) => id !== groupId);
      if (current.length >= maxVisibleGroups) return current;
      return [...current, groupId];
    });
  }, [maxVisibleGroups]);

  return (
    <div className={`titan-left-toolbar titan-toolbar-${orientation} ${className}`}>
      {visibleGroups.map((group) => {
        const tool = group.tools.find((candidate) => candidate.id === activeToolId)
          ?? group.tools.find((candidate) => !candidate.disabled)
          ?? group.tools[0];
        if (!tool) return null;
        return (
          <PinnedToolButton
            key={group.id}
            group={group}
            tool={tool}
            activeToolId={activeToolId}
            showFlyout={showFlyout}
            onToolSelect={handleToolSelect}
          />
        );
      })}
      {orientation === 'vertical' && (
        <button
          type="button"
          className={`titan-toolbar-customize${customizerOpen ? ' active' : ''}`}
          onClick={() => setCustomizerOpen((open) => !open)}
          title="Customize toolbar"
          aria-label="Customize toolbar"
          aria-expanded={customizerOpen}
        >
          +
        </button>
      )}
      {customizerOpen && (
        <ToolbarCustomizer
          groups={uniqueGroups}
          visibleGroupIds={visibleGroupIds}
          maxVisibleGroups={maxVisibleGroups}
          onToggleGroup={toggleVisibleGroup}
        />
      )}
    </div>
  );
}

interface PinnedToolButtonProps {
  group: ToolGroup;
  tool: ToolDef;
  activeToolId: string;
  showFlyout: boolean;
  onToolSelect: (toolId: string) => void;
}

function PinnedToolButton({ group, tool, activeToolId, showFlyout, onToolSelect }: PinnedToolButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setFlyoutPos({ top: rect.top, left: rect.right + 6 });
    } else {
      setFlyoutPos(null);
    }
  }, [isOpen]);

  return (
    <>
      <div className="titan-tool-group">
        <button
          ref={btnRef}
          className={`titan-tool-btn${activeToolId === tool.id ? ' active' : ''}${tool.disabled ? ' disabled' : ''}`}
          onClick={() => !tool.disabled && onToolSelect(tool.id)}
          disabled={!!tool.disabled}
          title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
        >
          <span className="titan-tool-icon">{tool.icon}</span>
          <span className="titan-tool-maturity" style={{ background: maturityColor(tool.maturity) }} />
        </button>
        {showFlyout && group.tools.length > 1 && (
          <button
            className="titan-tool-flyout-trigger"
            onClick={(event) => {
              event.stopPropagation();
              setIsOpen((open) => !open);
            }}
            title={`Show ${group.name} tools`}
            aria-label={`Show ${group.name} tools`}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 3l2 2 2-2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      {isOpen && flyoutPos && showFlyout && (
        <ToolFlyout
          group={group}
          activeToolId={activeToolId}
          position={flyoutPos}
          onToolSelect={(toolId) => { onToolSelect(toolId); setIsOpen(false); }}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

function maturityColor(maturity: ToolDef['maturity']): string {
  return {
    stable: '#10b981',
    beta: '#f59e0b',
    preview: '#d1892b',
    planned: '#6b7280',
  }[maturity || 'stable'];
}

interface ToolbarCustomizerProps {
  groups: ToolGroup[];
  visibleGroupIds: string[];
  maxVisibleGroups: number;
  onToggleGroup: (groupId: string) => void;
}

function ToolbarCustomizer({ groups, visibleGroupIds, maxVisibleGroups, onToggleGroup }: ToolbarCustomizerProps) {
  return (
    <section className="titan-toolbar-customizer" aria-label="Customize toolbar">
      <div className="titan-toolbar-customizer-header">
        <div>
          <strong>Customize Toolbar</strong>
          <span>Choose pinned tool groups</span>
        </div>
        <span className="titan-toolbar-customizer-count">{visibleGroupIds.length}/{maxVisibleGroups}</span>
      </div>
      <div className="titan-toolbar-customizer-list">
        {groups.map((group) => (
          <label
            key={group.id}
            className={`titan-toolbar-customizer-group-row${
              !visibleGroupIds.includes(group.id) && visibleGroupIds.length >= maxVisibleGroups ? ' at-limit' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={visibleGroupIds.includes(group.id)}
              disabled={!visibleGroupIds.includes(group.id) && visibleGroupIds.length >= maxVisibleGroups}
              onChange={() => onToggleGroup(group.id)}
            />
            <span className="titan-toolbar-customizer-check" aria-hidden="true" />
            <span className="titan-toolbar-customizer-icon">{group.tools[0]?.icon}</span>
            <span className="titan-toolbar-customizer-name">{group.name}</span>
            <span className="titan-toolbar-customizer-tools-count">{group.tools.length} tools</span>
          </label>
        ))}
      </div>
      <div className="titan-toolbar-customizer-footer">Each checked group appears once on the rail. Use its flyout arrow to choose a tool.</div>
    </section>
  );
}

interface ToolGroupButtonProps {
  group: ToolGroup;
  activeToolId: string;
  activeToolInGroup: ToolDef;
  isGroupActive: boolean;
  isOpen: boolean;
  showFlyout: boolean;
  onToggle: () => void;
  onOpenFlyout: () => void;
  onToolSelect: (toolId: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ToolGroupButton({
  group,
  activeToolId,
  activeToolInGroup,
  isGroupActive,
  isOpen,
  showFlyout,
  onToggle,
  onOpenFlyout,
  onToolSelect,
}: ToolGroupButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (isOpen && btnRef.current && showFlyout) {
      const rect = btnRef.current.getBoundingClientRect();
      setFlyoutPos({ top: rect.top, left: rect.right + 6 });
    } else {
      setFlyoutPos(null);
    }
  }, [isOpen, showFlyout]);

  const maturityColor = {
    stable: '#10b981',
    beta: '#f59e0b',
    preview: '#d1892b',
    planned: '#6b7280',
  };

  return (
    <>
      <div className="titan-tool-group">
        <button
          ref={btnRef}
          className={`titan-tool-btn${isGroupActive ? ' active' : ''}${activeToolInGroup.disabled ? ' disabled' : ''}`}
          onClick={onToggle}
          disabled={!!activeToolInGroup.disabled}
          title={`${activeToolInGroup.label}${activeToolInGroup.shortcut ? ` (${activeToolInGroup.shortcut})` : ''}`}
        >
          <span className="titan-tool-icon">{activeToolInGroup.icon}</span>
          <span
            className="titan-tool-maturity"
            style={{ background: maturityColor[activeToolInGroup.maturity || 'stable'] }}
          />
        </button>
        {showFlyout && group.tools.length > 1 && (
          <button
            className="titan-tool-flyout-trigger"
            onClick={(e) => {
              e.stopPropagation();
              onOpenFlyout();
            }}
            title="Show more tools"
          >
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M2 3l2 2 2-2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && flyoutPos && showFlyout && (
        <ToolFlyout
          group={group}
          activeToolId={activeToolId}
          position={flyoutPos}
          onToolSelect={onToolSelect}
          onClose={onOpenFlyout}
        />
      )}
    </>
  );
}

interface ToolFlyoutProps {
  group: ToolGroup;
  activeToolId: string;
  position: { top: number; left: number };
  onToolSelect: (toolId: string) => void;
  onClose: () => void;
}

function ToolFlyout({ group, activeToolId, position, onToolSelect, onClose }: ToolFlyoutProps) {
  const maturityColor = {
    stable: '#10b981',
    beta: '#f59e0b',
    preview: '#d1892b',
    planned: '#6b7280',
  };

  return (
    <div
      className="titan-tool-flyout"
      style={{ position: 'fixed', top: position.top, left: position.left, zIndex: 9999 }}
      onMouseLeave={onClose}
    >
      <div className="titan-tool-flyout-header">{group.name}</div>
      <div className="titan-tool-flyout-grid">
        {group.tools.map((tool) => (
          <button
            key={tool.id}
            className={`titan-tool-flyout-item${activeToolId === tool.id ? ' active' : ''}${tool.disabled ? ' disabled' : ''}`}
            onClick={() => !tool.disabled && onToolSelect(tool.id)}
            disabled={tool.disabled}
            title={tool.description}
          >
            <span className="titan-tool-flyout-icon">{tool.icon}</span>
            <span className="titan-tool-flyout-label">{tool.label}</span>
            {tool.shortcut && <span className="titan-tool-flyout-shortcut">{tool.shortcut}</span>}
            <span
              className="titan-tool-flyout-maturity"
              style={{ background: maturityColor[tool.maturity || 'stable'] }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Tool Definitions per Blueprint Specification
// ─────────────────────────────────────────────────────────────────────────────

export function getPlotSyncToolGroups(): ToolGroup[] {
  return [
    {
      id: 'selection',
      name: 'Selection',
      tools: [
        {
          id: 'select',
          label: 'Select',
          shortcut: 'V',
          icon: (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3l10 10M13 3l-10 10" />
            </svg>
          ),
          description: 'Select, move and transform objects',
          maturity: 'stable',
          engine: 'titangeometry',
          engineMethod: 'select',
        },
        {
          id: 'node-edit',
          label: 'Node Edit',
          shortcut: 'A',
          icon: (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="8" r="2" />
              <path d="M8 2v4M8 10v4M2 8h4M10 8h4" />
            </svg>
          ),
          description: 'Direct select & edit path anchor nodes',
          maturity: 'stable',
          engine: 'titangeometry',
          engineMethod: 'editNodes',
        },
      ],
    },
    {
      id: 'vector-creation',
      name: 'Vector Design',
      tools: [
        {
          id: 'pen',
          label: 'Pen Tool',
          shortcut: 'P',
          icon: (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 14l4-4 6-6 2 2-6 6-4 4" />
              <path d="M6 10l2 2" />
            </svg>
          ),
          description: 'Draw precise bezier vector paths',
          maturity: 'stable',
          engine: 'titangeometry',
          engineMethod: 'drawPath',
        },
        {
          id: 'rect',
          label: 'Rectangle',
          shortcut: 'R',
          icon: (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="12" height="10" rx="1.5" />
            </svg>
          ),
          description: 'Draw rectangles and rounded boxes',
          maturity: 'stable',
          engine: 'titangeometry',
          engineMethod: 'drawRect',
        },
        {
          id: 'ellipse',
          label: 'Ellipse',
          shortcut: 'O',
          icon: (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="8" cy="8" rx="6" ry="5" />
            </svg>
          ),
          description: 'Draw circles and ellipses',
          maturity: 'stable',
          engine: 'titangeometry',
          engineMethod: 'drawEllipse',
        },
        {
          id: 'text',
          label: 'Text',
          shortcut: 'T',
          icon: (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 4h10M8 4v9M6 13h4" />
            </svg>
          ),
          description: 'Add vector typography and convert to curves',
          maturity: 'stable',
          engine: 'titangeometry',
          engineMethod: 'addText',
        },
      ],
    },
    {
      id: 'contour-cut',
      name: 'Contour & Print-Cut',
      tools: [
        {
          id: 'contour',
          label: 'Contour Cutline',
          shortcut: 'C',
          icon: (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="10" height="10" rx="2" />
              <rect x="5" y="5" width="6" height="6" rx="1" />
            </svg>
          ),
          description: 'Generate offset contour cutlines (Kiss Cut / Perf Cut)',
          maturity: 'stable',
          engine: 'titangeometry',
          engineMethod: 'generateContour',
        },
        {
          id: 'regmark',
          label: 'Reg Marks',
          shortcut: 'M',
          icon: (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="8" r="5" />
              <circle cx="8" cy="8" r="2" />
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2" />
            </svg>
          ),
          description: 'Place 4-point optical camera registration marks',
          maturity: 'stable',
          engine: 'plotvision-engine',
          engineMethod: 'placeRegMark',
        },
        {
          id: 'weeding',
          label: 'Weed Lines',
          shortcut: 'W',
          icon: (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="10" height="10" rx="2" />
              <path d="M3 8h10M8 3v10" />
            </svg>
          ),
          description: 'Generate vinyl easy-weeding border lines',
          maturity: 'stable',
          engine: 'titangeometry',
          engineMethod: 'generateWeedingLines',
        },
      ],
    },
    {
      id: 'production-cut',
      name: 'Plot & Production',
      tools: [
        {
          id: 'nest',
          label: 'True-Shape Nest',
          shortcut: 'N',
          icon: (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="5" height="5" rx="1" />
              <rect x="9" y="2" width="5" height="5" rx="1" />
              <rect x="2" y="9" width="5" height="5" rx="1" />
              <rect x="9" y="9" width="5" height="5" rx="1" />
            </svg>
          ),
          description: 'True-shape nesting optimization for vinyl rolls',
          maturity: 'stable',
          engine: 'nest-engine',
          engineMethod: 'optimizeNest',
        },
        {
          id: 'tiling',
          label: 'Tiling & Paneling',
          shortcut: 'L',
          icon: (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="4" height="4" />
              <rect x="6" y="2" width="4" height="4" />
              <rect x="10" y="2" width="4" height="4" />
              <rect x="2" y="6" width="4" height="4" />
              <rect x="6" y="6" width="4" height="4" />
              <rect x="10" y="6" width="4" height="4" />
            </svg>
          ),
          description: 'Tile patterns and panels for oversized vinyl jobs',
          maturity: 'beta',
          engine: 'nest-engine',
          engineMethod: 'generateTiles',
        },
      ],
    },
  ];
}

export function getPrintSyncToolGroups(): ToolGroup[] {
  return [
    {
      id: 'selection',
      name: 'Selection',
      tools: [
        {
          id: 'select',
          label: 'Select',
          shortcut: 'V',
          icon: (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3l10 10M13 3l-10 10" />
            </svg>
          ),
          description: 'Select and move objects',
          maturity: 'stable',
        },
        {
          id: 'pan',
          label: 'Pan',
          shortcut: 'H',
          icon: (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2v4M8 10v4M2 8h4M10 8h4" />
              <circle cx="8" cy="8" r="2" />
            </svg>
          ),
          description: 'Pan the canvas',
          maturity: 'stable',
        },
      ],
    },
    {
      id: 'measurement',
      name: 'Measurement',
      tools: [
        {
          id: 'measure',
          label: 'Measure',
          shortcut: 'M',
          icon: (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 8h12" />
              <path d="M2 5v3M14 5v3" />
              <path d="M5 8v3M11 8v3" />
            </svg>
          ),
          description: 'Measure distances',
          maturity: 'stable',
        },
        {
          id: 'eyedropper',
          label: 'Eyedropper',
          shortcut: 'I',
          icon: (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 2l4 4-6 6-4-4 6-6z" />
              <path d="M4 12l-2 2" />
            </svg>
          ),
          description: 'Sample colors',
          maturity: 'stable',
          engine: 'titancolor',
          engineMethod: 'sampleColor',
        },
      ],
    },
    {
      id: 'rip',
      name: 'RIP',
      tools: [
        {
          id: 'process',
          label: 'Process',
          shortcut: 'R',
          icon: (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 8h2l2-4 2 8 2-8 2 4h2" />
            </svg>
          ),
          description: 'Process RIP job',
          maturity: 'stable',
          engine: 'titan-rip',
          engineMethod: 'processJob',
        },
        {
          id: 'preview',
          label: 'Preview',
          shortcut: 'P',
          icon: (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="12" height="10" rx="2" />
              <circle cx="8" cy="8" r="2" />
            </svg>
          ),
          description: 'Soft-proof preview',
          maturity: 'stable',
          engine: 'titancolor',
          engineMethod: 'softProof',
        },
      ],
    },
    {
      id: 'calibration',
      name: 'Calibration',
      tools: [
        {
          id: 'color-cal',
          label: 'Color Cal',
          shortcut: 'C',
          icon: (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8" cy="8" r="5" />
              <circle cx="8" cy="8" r="3" />
              <circle cx="8" cy="8" r="1" fill="currentColor" />
            </svg>
          ),
          description: 'Color calibration',
          maturity: 'beta',
          engine: 'titancolor',
          engineMethod: 'calibrate',
        },
        {
          id: 'printer-cal',
          label: 'Printer Cal',
          shortcut: 'K',
          icon: (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="12" height="8" rx="1" />
              <path d="M4 4V2h8v2" />
              <circle cx="5" cy="8" r="1" fill="currentColor" />
              <circle cx="11" cy="8" r="1" fill="currentColor" />
            </svg>
          ),
          description: 'Printer calibration',
          maturity: 'stable',
          engine: 'titandaemon',
          engineMethod: 'calibratePrinter',
        },
      ],
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Touch-Optimized Canvas Tool Button (44px Minimum Touch Target)
// ─────────────────────────────────────────────────────────────────────────────

export interface ToolButtonProps {
  icon: React.ComponentType<{ className?: string }> | React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
}

export const TouchToolButton: React.FC<ToolButtonProps> = ({
  icon: Icon,
  label,
  isActive = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer ${
        isActive
          ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/50'
      } ${className}`}
    >
      {typeof Icon === 'function' ? (
        <Icon className="w-5 h-5 stroke-[2.2]" />
      ) : React.isValidElement(Icon) ? (
        Icon
      ) : null}
    </button>
  );
};
