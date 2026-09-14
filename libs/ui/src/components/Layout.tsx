import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// AppShell — root layout wrapper for all Titan desktop apps
// ─────────────────────────────────────────────────────────────────────────────

export interface AppShellProps {
  sidebar?:   React.ReactNode;
  toolbar?:   React.ReactNode;
  statusBar?: React.ReactNode;
  children:   React.ReactNode;
  className?: string;
}

export function AppShell({ sidebar, toolbar, statusBar, children, className = '' }: AppShellProps) {
  return (
    <div
      className={`flex flex-col h-screen w-screen overflow-hidden bg-[var(--titan-bg)] text-[var(--titan-text)] ${className}`}
      style={{ fontFamily: '"Inter","Segoe UI",system-ui,sans-serif', fontSize: '13px' }}
    >
      {toolbar && (
        <div className="flex-shrink-0 h-10 border-b border-[var(--titan-border)] bg-[var(--titan-bg-raised)] flex items-center">
          {toolbar}
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        {sidebar && (
          <aside className="flex-shrink-0 border-r border-[var(--titan-border)] overflow-y-auto">
            {sidebar}
          </aside>
        )}
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
      </div>
      {statusBar && (
        <div className="flex-shrink-0 h-6 border-t border-[var(--titan-border)] bg-[var(--titan-bg-raised)] flex items-center px-3">
          {statusBar}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────────────────────────

export interface SidebarProps {
  width?:     number;
  children:   React.ReactNode;
  className?: string;
}

export function Sidebar({ width = 220, children, className = '' }: SidebarProps) {
  return (
    <nav
      style={{ width }}
      className={`h-full bg-[var(--titan-bg-raised)] flex flex-col overflow-hidden ${className}`}
    >
      {children}
    </nav>
  );
}

export interface SidebarItemProps {
  icon?:     React.ReactNode;
  label:     string;
  active?:   boolean;
  badge?:    string | number;
  onClick?:  () => void;
  className?: string;
}

export function SidebarItem({ icon, label, active = false, badge, onClick, className = '' }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex items-center gap-2.5 px-3 py-1.5 w-full text-left rounded-md mx-1 my-0.5',
        'text-[13px] font-medium transition-colors duration-100',
        'focus:outline-none focus:ring-2 focus:ring-[var(--titan-brand)]',
        active
          ? 'bg-[var(--titan-brand-light)] text-[var(--titan-brand)]'
          : 'text-[var(--titan-text-muted)] hover:bg-[var(--titan-bg-overlay)] hover:text-[var(--titan-text)]',
        className,
      ].join(' ')}
    >
      {icon && <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">{icon}</span>}
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && (
        <span className="bg-[var(--titan-brand)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {badge}
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Toolbar
// ─────────────────────────────────────────────────────────────────────────────

export interface ToolbarProps {
  left?:      React.ReactNode;
  center?:    React.ReactNode;
  right?:     React.ReactNode;
  className?: string;
}

export function Toolbar({ left, center, right, className = '' }: ToolbarProps) {
  return (
    <div className={`flex items-center w-full px-2 gap-1 ${className}`}>
      {left && <div className="flex items-center gap-1">{left}</div>}
      {center && <div className="flex-1 flex items-center justify-center gap-1">{center}</div>}
      {right && <div className="flex items-center gap-1 ml-auto">{right}</div>}
    </div>
  );
}

export function ToolbarDivider() {
  return <div className="w-px h-5 bg-[var(--titan-border)] mx-1 flex-shrink-0" />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Panel
// ─────────────────────────────────────────────────────────────────────────────

export interface PanelProps {
  title?:      string;
  actions?:    React.ReactNode;
  children:    React.ReactNode;
  className?:  string;
  bodyClass?:  string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function Panel({
  title, actions, children, className = '', bodyClass = '',
  collapsible = false, defaultCollapsed = false,
}: PanelProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  return (
    <div className={`flex flex-col border border-[var(--titan-border)] rounded-md overflow-hidden ${className}`}>
      {title && (
        <div className="flex items-center h-8 px-3 border-b border-[var(--titan-border)] bg-[var(--titan-bg-raised)] flex-shrink-0">
          {collapsible && (
            <button
              onClick={() => setCollapsed(c => !c)}
              className="mr-1.5 text-[var(--titan-text-muted)] hover:text-[var(--titan-text)]"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d={collapsed ? 'M4 2l4 4-4 4' : 'M2 4l4 4 4-4'} stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            </button>
          )}
          <span className="text-[12px] font-semibold text-[var(--titan-text)] flex-1 truncate">{title}</span>
          {actions && <div className="flex items-center gap-1 ml-2">{actions}</div>}
        </div>
      )}
      {!collapsed && (
        <div className={`flex-1 overflow-auto ${bodyClass}`}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SplitPane — resizable two-pane layout
// ─────────────────────────────────────────────────────────────────────────────

export interface SplitPaneProps {
  direction?:   'horizontal' | 'vertical';
  defaultSplit?: number;        // percentage 0-100
  minFirst?:    number;        // px
  minSecond?:   number;        // px
  first:        React.ReactNode;
  second:       React.ReactNode;
  className?:   string;
}

export function SplitPane({
  direction = 'horizontal',
  defaultSplit = 50,
  minFirst = 80,
  minSecond = 80,
  first,
  second,
  className = '',
}: SplitPaneProps) {
  const [split, setSplit] = React.useState(defaultSplit);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  };

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let pct: number;
      if (direction === 'horizontal') {
        pct = ((e.clientX - rect.left) / rect.width) * 100;
      } else {
        pct = ((e.clientY - rect.top) / rect.height) * 100;
      }
      const total = direction === 'horizontal' ? rect.width : rect.height;
      const minFirstPct  = (minFirst  / total) * 100;
      const minSecondPct = (minSecond / total) * 100;
      setSplit(Math.min(100 - minSecondPct, Math.max(minFirstPct, pct)));
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, [direction, minFirst, minSecond]);

  const isH = direction === 'horizontal';

  return (
    <div
      ref={containerRef}
      className={`flex ${isH ? 'flex-row' : 'flex-col'} w-full h-full overflow-hidden ${className}`}
    >
      <div style={{ [isH ? 'width' : 'height']: `${split}%` }} className="overflow-hidden flex-shrink-0">
        {first}
      </div>
      {/* Divider */}
      <div
        onMouseDown={onMouseDown}
        className={[
          'flex-shrink-0 z-10 select-none',
          isH
            ? 'w-1 cursor-col-resize hover:bg-[var(--titan-brand)] bg-[var(--titan-border)]'
            : 'h-1 cursor-row-resize hover:bg-[var(--titan-brand)] bg-[var(--titan-border)]',
          'transition-colors duration-100',
        ].join(' ')}
      />
      <div className="flex-1 overflow-hidden min-w-0 min-h-0">
        {second}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────────────────────────────────────

export interface CardProps {
  children:   React.ReactNode;
  className?: string;
  padding?:   boolean;
  hover?:     boolean;
  onClick?:   () => void;
}

export function Card({ children, className = '', padding = true, hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        'rounded-lg border border-[var(--titan-border)] bg-[var(--titan-bg-raised)]',
        padding ? 'p-4' : '',
        hover ? 'hover:border-[var(--titan-brand)] hover:shadow-sm cursor-pointer transition-all duration-150' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
