import React from 'react';
import { Badge, Progress, StatusDot } from './Feedback.js';
import type { Job } from '@titan/common';

// ─────────────────────────────────────────────────────────────────────────────
// JobCard — displays a job in the queue with status, progress, cost
// ─────────────────────────────────────────────────────────────────────────────

export interface JobCardProps {
  job:        Job;
  selected?:  boolean;
  onClick?:   () => void;
  onCancel?:  () => void;
  className?: string;
}

const statusColor: Record<string, 'green' | 'amber' | 'red' | 'gray' | 'blue'> = {
  completed: 'green', printing: 'blue', ripping: 'blue',
  cutting: 'blue', queued: 'amber', preflight: 'amber',
  failed: 'red', cancelled: 'gray', draft: 'gray',
};

const priorityBadge: Record<string, 'error' | 'warning' | 'default' | 'purple'> = {
  urgent: 'error', high: 'warning', normal: 'default', low: 'default',
};

export function JobCard({ job, selected = false, onClick, onCancel, className = '' }: JobCardProps) {
  const isActive   = ['queued','preflight','ripping','printing','cutting'].includes(job.status);
  const totalCents = job.cost
    ? job.cost.materialCostCents + job.cost.inkCostCents + job.cost.labourCostCents
    : null;

  return (
    <div
      onClick={onClick}
      className={[
        'flex flex-col gap-2 p-3 rounded-md border transition-all duration-100 cursor-pointer',
        selected
          ? 'border-[var(--titan-brand)] bg-[var(--titan-brand-light)]'
          : 'border-[var(--titan-border)] bg-[var(--titan-bg)] hover:border-[var(--titan-border-strong)]',
        className,
      ].join(' ')}
    >
      {/* Header row */}
      <div className="flex items-start gap-2">
        <StatusDot color={statusColor[job.status] ?? 'gray'} pulse={isActive} />
        <span className="flex-1 text-[13px] font-medium text-[var(--titan-text)] truncate">{job.title}</span>
        {job.priority !== 'normal' && (
          <Badge variant={priorityBadge[job.priority] ?? 'default'}>{job.priority}</Badge>
        )}
      </div>

      {/* Progress bar when active */}
      {isActive && job.progressPercent !== undefined && (
        <Progress value={job.progressPercent} size="sm" showPercent variant="default" />
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="default">{job.type}</Badge>
          <span className="text-[11px] text-[var(--titan-text-muted)] capitalize">{job.status}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {totalCents !== null && (
            <span className="text-[11px] tabular-nums text-[var(--titan-text-muted)]">
              ${(totalCents / 100).toFixed(2)}
            </span>
          )}
          {onCancel && isActive && (
            <button
              onClick={(e) => { e.stopPropagation(); onCancel(); }}
              className="text-[11px] text-[var(--titan-error)] hover:underline"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
