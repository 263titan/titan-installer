import React, { useState, useCallback } from 'react';
import './PlotSyncShell.css';
import { MenuBar, getDefaultTitanMenus } from './MenuBar.js';
import { LeftToolbar, getPlotSyncToolGroups, type ToolGroup } from './LeftToolbar.js';
import {
  RightDocker,
  DockerTab,
} from './RightDocker.js';

// ─────────────────────────────────────────────────────────────────────────────
// PlotSync Shell — Unified Vector Design, Import, Plot & Contour Cutting Studio
// Integrates vector editing, contour path generation, nesting, and cut dispatch
// ─────────────────────────────────────────────────────────────────────────────

/** PlotSync exposes one continuous vector-design, plot-and-cut workspace. */
export type PlotSyncWorkspace = 'studio';

export interface PlotSyncShellProps {
  workspace?: PlotSyncWorkspace;
  children: React.ReactNode;
  className?: string;
  /** App-owned Windows title bar and menu bar. Falls back to the standard Titan menu. */
  header?: React.ReactNode;
  /** Persistent document/session strip shown between properties and the canvas rulers. */
  documentTabs?: React.ReactNode;
  /** App-owned one-click production actions shown below the title bar. */
  quickActions?: React.ReactNode;
  /** Context-aware document, object, and typography controls. */
  propertyBar?: React.ReactNode;
  /** Compact page, swatch, and production status strip above the global status bar. */
  footer?: React.ReactNode;
  /** Live workspace status supplied by the host application. */
  statusBar?: React.ReactNode;
  onWorkspaceChange?: (workspace: PlotSyncWorkspace) => void;
  onMenuAction?: (menuId: string, itemId: string) => void;
  /** Optional app-specific registry; PlotSync supplies its complete tool set. */
  toolGroups?: ToolGroup[];
  /** App-specific dockers, such as live cutter setup and hardware preferences. */
  additionalDockerTabs?: DockerTab[];
  /** Complete app-owned docker set. When supplied, no placeholder studio dockers are added. */
  dockerTabs?: DockerTab[];
  /** Makes the rail follow tool choices made from the canvas or keyboard. */
  activeToolId?: string;
  onToolSelect?: (toolId: string) => void;
}

export function PlotSyncShell({
  workspace: _workspace = 'studio',
  children,
  className = '',
  header,
  documentTabs,
  quickActions,
  propertyBar,
  footer,
  statusBar,
  onMenuAction,
  toolGroups: suppliedToolGroups,
  additionalDockerTabs = [],
  dockerTabs: suppliedDockerTabs,
  activeToolId: controlledToolId,
  onToolSelect,
}: PlotSyncShellProps) {
  const [localActiveToolId, setLocalActiveToolId] = useState('pick');
  const [activeDockerTab, setActiveDockerTab] = useState('properties');
  const activeToolId = controlledToolId ?? localActiveToolId;

  const handleToolSelect = useCallback(
    (toolId: string) => {
      setLocalActiveToolId(toolId);
      if (onToolSelect) onToolSelect(toolId);
    },
    [onToolSelect],
  );

  const handleDockerTabChange = useCallback((tabId: string) => {
    setActiveDockerTab(tabId);
  }, []);

  // Vector-design and production tools share one continuous workspace.
  const toolGroups = suppliedToolGroups ?? getPlotSyncToolGroups();

  // A host must provide live dockers. The shared shell only appends explicitly
  // supplied tabs and never creates display-only placeholder panels.
  const dockerTabs = suppliedDockerTabs ?? additionalDockerTabs;

  return (
    <div className={`titan-plotsync-shell ${className}`}>
      {/* The desktop app supplies its branded title/menu bar when running in Electron. */}
      {header ?? <MenuBar menus={getDefaultTitanMenus()} onMenuAction={onMenuAction} />}

      {/* Direct production actions replace the legacy contextual-ribbon tabs. */}
      {quickActions}

      {/* Context-aware property controls are supplied by the PlotSync workspace. */}
      {propertyBar}

      {/* Document tabs sit immediately above the ruler/canvas line. */}
      {documentTabs}

      {/* Main Content Area */}
      <div className="titan-plotsync-main">
        {/* Left Toolbar */}
        <LeftToolbar
          groups={toolGroups}
          activeToolId={activeToolId}
          onToolSelect={handleToolSelect}
          orientation="vertical"
        />

        {/* Canvas Area */}
        <div className="titan-plotsync-canvas">{children}</div>

        {/* Right Docker */}
        <RightDocker
          tabs={dockerTabs}
          defaultTab={activeDockerTab}
          onTabChange={handleDockerTabChange}
        />
      </div>

      {/* Production footer replaces the legacy expanded system panel when supplied. */}
      {footer}
      {statusBar}
    </div>
  );
}
