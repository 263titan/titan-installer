/* eslint-disable no-console */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import './MenuBar.css';

// ─────────────────────────────────────────────────────────────────────────────
// Global Menu Bar System for Titan Production Suite
// Implements the complete menu structure per blueprint specification
// ─────────────────────────────────────────────────────────────────────────────

export interface MenuItem {
  id: string;
  label?: string; // Optional for separators
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  action?: () => void;
  children?: MenuItem[];
  badge?: string; // For certification/lock badges
}

export interface MenuBarProps {
  menus: Record<string, MenuItem[]>;
  className?: string;
  onMenuAction?: (menuId: string, itemId: string) => void;
}

export function MenuBar({ menus, className = '', onMenuAction }: MenuBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRefs = useRef<Record<string, HTMLButtonElement>>({});
  const dropdownRefs = useRef<Record<string, HTMLDivElement>>({});

  const handleMenuClick = useCallback((menuId: string) => {
    setOpenMenu((prev) => (prev === menuId ? null : menuId));
  }, []);

  const handleItemClick = useCallback(
    (menuId: string, item: MenuItem) => {
      if (item.disabled || item.separator) return;
      if (item.action) {
        item.action();
      }
      if (onMenuAction) {
        onMenuAction(menuId, item.id);
      }
      setOpenMenu(null);
    },
    [onMenuAction],
  );

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        openMenu &&
        !menuRefs.current[openMenu]?.contains(e.target as Node) &&
        !dropdownRefs.current[openMenu]?.contains(e.target as Node)
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenu]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
      }
      if (e.key === 'Alt' && openMenu === null) {
        // Could implement Alt-key navigation here
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openMenu]);

  return (
    <div className={`titan-menu-bar ${className}`}>
      {Object.entries(menus).map(([menuId, items]) => (
        <div key={menuId} className="titan-menu-container">
          <button
            ref={(el) => {
              if (el) menuRefs.current[menuId] = el;
            }}
            className={`titan-menu-trigger${openMenu === menuId ? ' active' : ''}`}
            onClick={() => handleMenuClick(menuId)}
          >
            {menuId}
          </button>
          {openMenu === menuId && (
            <div
              ref={(el) => {
                if (el) dropdownRefs.current[menuId] = el;
              }}
              className="titan-menu-dropdown"
            >
              {items.map((item, idx) =>
                item.separator ? (
                  <div key={`sep-${idx}`} className="titan-menu-separator" />
                ) : (
                  <MenuItemComponent
                    key={item.id}
                    item={item}
                    onClick={() => handleItemClick(menuId, item)}
                  />
                ),
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MenuItemComponent({ item, onClick }: { item: MenuItem; onClick: () => void }) {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const itemRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submenuOpen && itemRef.current && submenuRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      submenuRef.current.style.top = `${rect.top}px`;
      submenuRef.current.style.left = `${rect.right}px`;
    }
  }, [submenuOpen]);

  const handleMouseEnter = () => {
    if (hasChildren && !item.disabled) {
      setSubmenuOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setSubmenuOpen(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.disabled) {
      if (hasChildren) {
        setSubmenuOpen(!submenuOpen);
      } else {
        onClick();
      }
    }
  };

  return (
    <div
      ref={itemRef}
      className={`titan-menu-item${item.disabled ? ' disabled' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="titan-menu-item-content">
        <span className="titan-menu-item-label">{item.label}</span>
        {item.badge && <span className="titan-menu-item-badge">{item.badge}</span>}
        {item.shortcut && <span className="titan-menu-item-shortcut">{item.shortcut}</span>}
        {hasChildren && (
          <span className="titan-menu-item-arrow">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 2l4 3-4 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>
      {hasChildren && submenuOpen && (
        <div ref={submenuRef} className="titan-menu-submenu">
          {item.children?.map((child) =>
            child.separator ? (
              <div key={`sep-${child.id}`} className="titan-menu-separator" />
            ) : (
              <MenuItemComponent
                key={child.id}
                item={child}
                onClick={() => {
                  if (child.action) child.action();
                }}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Menu Definitions per Blueprint Specification
// ─────────────────────────────────────────────────────────────────────────────

export function getDefaultTitanMenus(): Record<string, MenuItem[]> {
  return {
    File: [
      {
        id: 'new',
        label: 'New Document',
        shortcut: 'Ctrl+N',
        action: () => console.log('New Document'),
      },
      { id: 'open', label: 'Open', shortcut: 'Ctrl+O', action: () => console.log('Open') },
      {
        id: 'import',
        label: 'Import Raster/Vector',
        shortcut: 'Ctrl+I',
        action: () => console.log('Import'),
      },
      {
        id: 'export',
        label: 'Export Web/CAD',
        shortcut: 'Ctrl+E',
        action: () => console.log('Export'),
      },
      { id: 'sep1', separator: true },
      {
        id: 'hotfolder',
        label: 'RIP Hot Folder Monitor Setup',
        action: () => console.log('Hot Folder'),
      },
      {
        id: 'print',
        label: 'Print/Cut Queue Dispatch',
        shortcut: 'Ctrl+P',
        action: () => console.log('Print'),
      },
      {
        id: 'batch',
        label: 'Batch Production Wizard',
        action: () => console.log('Batch Production'),
      },
      { id: 'sep2', separator: true },
      {
        id: 'archive',
        label: 'Project Archive (.titanpack)',
        action: () => console.log('Archive'),
      },
      { id: 'sep3', separator: true },
      { id: 'exit', label: 'Exit', action: () => console.log('Exit') },
    ],
    Edit: [
      { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z', action: () => console.log('Undo') },
      { id: 'redo', label: 'Redo', shortcut: 'Ctrl+Y', action: () => console.log('Redo') },
      { id: 'sep1', separator: true },
      { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X', action: () => console.log('Cut') },
      { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C', action: () => console.log('Copy') },
      { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V', action: () => console.log('Paste') },
      {
        id: 'duplicate',
        label: 'Duplicate Array',
        shortcut: 'Ctrl+D',
        action: () => console.log('Duplicate'),
      },
      { id: 'sep2', separator: true },
      {
        id: 'selectall',
        label: 'Select All',
        shortcut: 'Ctrl+A',
        action: () => console.log('Select All'),
      },
      {
        id: 'selectby',
        label: 'Select By',
        children: [
          { id: 'selectcolor', label: 'Color', action: () => console.log('Select by Color') },
          { id: 'selectlayer', label: 'Layer', action: () => console.log('Select by Layer') },
          { id: 'selecttype', label: 'Type', action: () => console.log('Select by Type') },
        ],
      },
      { id: 'sep3', separator: true },
      {
        id: 'preferences',
        label: 'Preferences',
        shortcut: 'Ctrl+,',
        action: () => console.log('Preferences'),
      },
    ],
    View: [
      { id: 'zoomin', label: 'Zoom In', action: () => console.log('Zoom In') },
      { id: 'zoomout', label: 'Zoom Out', action: () => console.log('Zoom Out') },
      {
        id: 'fitpage',
        label: 'Fit to Page',
        shortcut: 'Ctrl+0',
        action: () => console.log('Fit to Page'),
      },
      { id: 'sep1', separator: true },
      {
        id: 'wireframe',
        label: 'Wireframe Mode',
        shortcut: 'F9',
        action: () => console.log('Wireframe'),
      },
      {
        id: 'softproof',
        label: 'Color Soft-Proof Overlay',
        shortcut: 'F10',
        action: () => console.log('Soft-Proof'),
      },
      {
        id: 'gamut',
        label: 'Out-of-Gamut Highlight',
        shortcut: 'F11',
        action: () => console.log('Gamut Warning'),
      },
      { id: 'sep2', separator: true },
      {
        id: 'gridguides',
        label: 'Grid/Guides/Snap',
        children: [
          { id: 'showgrid', label: 'Show Grid', action: () => console.log('Show Grid') },
          { id: 'showguides', label: 'Show Guides', action: () => console.log('Show Guides') },
          { id: 'snap', label: 'Snap to Grid', action: () => console.log('Snap') },
        ],
      },
      {
        id: 'units',
        label: 'Ruler Units)',
        children: [
          { id: 'unitmm', label: 'Millimeters (mm)', action: () => console.log('mm') },
          { id: 'unitin', label: 'Inches (in)', action: () => console.log('in') },
          { id: 'unitpt', label: 'Points (pt)', action: () => console.log('pt') },
        ],
      },
    ],
    Object: [
      { id: 'group', label: 'Group', shortcut: 'Ctrl+G', action: () => console.log('Group') },
      { id: 'ungroup', label: 'Ungroup', shortcut: 'Ctrl+U', action: () => console.log('Ungroup') },
      { id: 'sep1', separator: true },
      { id: 'align', label: 'Align & Distribute Panel', action: () => console.log('Align') },
      {
        id: 'order',
        label: 'Order',
        children: [
          { id: 'front', label: 'To Front', action: () => console.log('To Front') },
          { id: 'back', label: 'To Back', action: () => console.log('To Back') },
          { id: 'forward', label: 'Forward', action: () => console.log('Forward') },
          { id: 'backward', label: 'Backward', action: () => console.log('Backward') },
        ],
      },
      { id: 'lock', label: 'Lock/Unlock', action: () => console.log('Lock') },
      { id: 'sep2', separator: true },
      {
        id: 'transform',
        label: 'Transform',
        children: [
          { id: 'scale', label: 'Scale', action: () => console.log('Scale') },
          { id: 'rotate', label: 'Rotate', action: () => console.log('Rotate') },
          { id: 'skew', label: 'Skew', action: () => console.log('Skew') },
          { id: 'mirrorh', label: 'Mirror Horizontal', action: () => console.log('Mirror H') },
          { id: 'mirrorv', label: 'Mirror Vertical', action: () => console.log('Mirror V') },
        ],
      },
      { id: 'sep3', separator: true },
      { id: 'combine', label: 'Combine/Weld', action: () => console.log('Combine') },
      { id: 'trim', label: 'Trim', action: () => console.log('Trim') },
      { id: 'intersect', label: 'Intersect', action: () => console.log('Intersect') },
    ],
    Path: [
      {
        id: 'curves',
        label: 'Convert to Curves',
        shortcut: 'Ctrl+Q',
        action: () => console.log('Convert to Curves'),
      },
      {
        id: 'break',
        label: 'Break Apart',
        shortcut: 'Ctrl+K',
        action: () => console.log('Break Apart'),
      },
      { id: 'sep1', separator: true },
      { id: 'simplify', label: 'Node Simplification', action: () => console.log('Simplify') },
      { id: 'autoclose', label: 'Auto-Close Paths', action: () => console.log('Auto-Close') },
      { id: 'sep2', separator: true },
      {
        id: 'outercontour',
        label: 'Generate Outer Contour',
        action: () => console.log('Outer Contour'),
      },
      {
        id: 'innerinline',
        label: 'Generate Inner Inline',
        action: () => console.log('Inner Inline'),
      },
      { id: 'autoweeding', label: 'Auto-Weeding Frame', action: () => console.log('Auto-Weeding') },
    ],
    RIP: [
      {
        id: 'process',
        label: 'Process Job',
        shortcut: 'Ctrl+R',
        action: () => console.log('Process Job'),
      },
      { id: 'render', label: 'Render to Raster Band', action: () => console.log('Render') },
      { id: 'respool', label: 'Re-Spool Job', action: () => console.log('Re-Spool') },
      { id: 'sep1', separator: true },
      { id: 'inklimit', label: 'Ink Limit Overrides', action: () => console.log('Ink Limits') },
      {
        id: 'colortable',
        label: 'Color Replacement Table',
        action: () => console.log('Color Table'),
      },
      {
        id: 'softproof',
        label: 'Soft-Proof Color Profile Assignment',
        action: () => console.log('Soft-Proof Profile'),
      },
    ],
    Hardware: [
      { id: 'comport', label: 'Direct COM Port Setup', action: () => console.log('COM Port') },
      {
        id: 'network',
        label: 'Network Print Server Search (Port 9100/LPR)',
        action: () => console.log('Network Search'),
      },
      { id: 'sep1', separator: true },
      {
        id: 'blade',
        label: 'Plotter Blade Calibration Test',
        action: () => console.log('Blade Calibration'),
      },
      {
        id: 'camera',
        label: 'Camera Optical Offset Calibration',
        action: () => console.log('Camera Calibration'),
      },
      { id: 'sep2', separator: true },
      {
        id: 'diagnostic',
        label: 'Device Diagnostic Terminal',
        action: () => console.log('Diagnostics'),
      },
    ],
    Certification: [
      {
        id: 'dongle',
        label: 'Dongle/Token Status',
        badge: '🔒',
        action: () => console.log('Dongle Status'),
      },
      { id: 'rfid', label: 'Verify Ink RFID Chips', action: () => console.log('Verify RFID') },
      {
        id: 'substrate',
        label: 'Validate Substrate Presets',
        action: () => console.log('Validate Substrate'),
      },
      {
        id: 'signature',
        label: 'Renew Operator Signatures',
        action: () => console.log('Renew Signatures'),
      },
      { id: 'sep1', separator: true },
      {
        id: 'safety',
        label: 'Hardware Safety Limits Audit',
        action: () => console.log('Safety Audit'),
      },
    ],
    Window: [
      {
        id: 'layouts',
        label: 'Workspace Layout Presets',
        children: [
          { id: 'layoutdesign', label: 'Design', action: () => console.log('Design Layout') },
          {
            id: 'layoutproduction',
            label: 'Production',
            action: () => console.log('Production Layout'),
          },
          {
            id: 'layoutdual',
            label: 'Dual-Monitor RIP',
            action: () => console.log('Dual Monitor'),
          },
        ],
      },
      { id: 'sep1', separator: true },
      {
        id: 'toggledockers',
        label: 'Toggle Dockers',
        children: [
          { id: 'docker nesting', label: 'Nesting', action: () => console.log('Toggle Nesting') },
          { id: 'docker color', label: 'Color', action: () => console.log('Toggle Color') },
          { id: 'docker queue', label: 'Queue', action: () => console.log('Toggle Queue') },
          {
            id: 'docker properties',
            label: 'Properties',
            action: () => console.log('Toggle Properties'),
          },
        ],
      },
      { id: 'sep2', separator: true },
      { id: 'resetlayout', label: 'Reset UI Layout', action: () => console.log('Reset Layout') },
    ],
    Help: [
      { id: 'manual', label: 'Interactive Operator Manual', action: () => console.log('Manual') },
      {
        id: 'shortcuts',
        label: 'Keyboard Shortcut Cheat Sheet',
        action: () => console.log('Shortcuts'),
      },
      { id: 'sep1', separator: true },
      { id: 'apilogs', label: 'Engine API Logs', action: () => console.log('API Logs') },
      {
        id: 'diagnostics',
        label: 'System Diagnostics Export',
        action: () => console.log('Diagnostics Export'),
      },
      { id: 'sep2', separator: true },
      { id: 'updates', label: 'Check for OTA Updates', action: () => console.log('Check Updates') },
    ],
  };
}
