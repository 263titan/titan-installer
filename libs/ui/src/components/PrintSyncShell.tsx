import React from 'react';
import './PrintSyncShell.css';
import { MenuBar, getDefaultTitanMenus } from './MenuBar.js';
import type { ToolGroup } from './LeftToolbar.js';
import type { DockerTab } from './RightDocker.js';

/** PrintSync is one continuous RIP, color-management, and production workspace. */
export type PrintSyncWorkspace = 'rip';

export interface PrintSyncShellProps {
  workspace?: PrintSyncWorkspace;
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
  onWorkspaceChange?: (workspace: PrintSyncWorkspace) => void;
  onMenuAction?: (menuId: string, itemId: string) => void;
  /** Optional app-specific registry; PrintSync supplies its complete tool set. */
  toolGroups?: ToolGroup[];
  /** App-specific dockers, such as live color, queue, and cut-path panels. */
  additionalDockerTabs?: DockerTab[];
  /** Complete app-owned docker set. When supplied, no placeholder dockers are added. */
  dockerTabs?: DockerTab[];
  /** Makes the rail follow tool choices made from the canvas or keyboard. */
  activeToolId?: string;
  onToolSelect?: (toolId: string) => void;
}

export function PrintSyncShell({
  workspace: _workspace = 'rip',
  children,
  className = '',
  header,
  documentTabs,
  quickActions,
  propertyBar,
  footer,
  statusBar,
  onMenuAction,
}: PrintSyncShellProps) {
  return (
    <div className={`titan-printsync-shell ${className}`}>
      {/* The desktop app supplies its branded title/menu bar when running in Electron. */}
      {header ?? <MenuBar menus={getDefaultTitanMenus()} onMenuAction={onMenuAction} />}

      {/* Direct production actions replace the legacy contextual-ribbon tabs. */}
      {quickActions}

      {/* Context-aware property controls are supplied by the RIP workspace. */}
      {propertyBar}

      {/* Document tabs sit immediately above the ruler/canvas line. */}
      {documentTabs}

      {/* Main Content Area — RIP workspace owns its own tool rail + docker */}
      <div className="titan-printsync-main">
        <div className="titan-printsync-canvas">{children}</div>
      </div>

      {/* Production footer replaces the legacy expanded system panel when supplied. */}
      {footer}
      {statusBar}
    </div>
  );
}