// ─────────────────────────────────────────────────────────────────────────────
// Titan Structured Logger
// In production: forwards to SyncTrace gRPC service.
// In development: pretty-prints to console.
// ─────────────────────────────────────────────────────────────────────────────

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  level: LogLevel;
  message: string;
  service: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

export type LogSink = (entry: LogEntry) => void;

const LOG_LEVEL_SEVERITY: Record<LogLevel, number> = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5,
};

const LEVEL_COLORS: Record<LogLevel, string> = {
  trace: '\x1b[90m', // gray
  debug: '\x1b[36m', // cyan
  info: '\x1b[32m',  // green
  warn: '\x1b[33m',  // yellow
  error: '\x1b[31m', // red
  fatal: '\x1b[35m', // magenta
};
const RESET = '\x1b[0m';

function consoleSink(entry: LogEntry): void {
  const color = LEVEL_COLORS[entry.level] ?? '';
  const level = entry.level.toUpperCase().padEnd(5);
  const ts = entry.timestamp.replace('T', ' ').replace('Z', '');
  const ctx = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
  const errStr = entry.error ? `\n  ↳ ${entry.error.message}${entry.error.stack ? '\n' + entry.error.stack : ''}` : '';
  const line = `${color}[${ts}] ${level}${RESET} [${entry.service}] ${entry.message}${ctx}${errStr}`;

  if (entry.level === 'error' || entry.level === 'fatal') {
    console.error(line);
  } else if (entry.level === 'warn') {
    console.warn(line);
  } else {
    // eslint-disable-next-line no-console
    console.log(line);
  }
}

function jsonSink(entry: LogEntry): void {
  process.stdout.write(JSON.stringify(entry) + '\n');
}

export class Logger {
  private readonly sinks: LogSink[];
  private readonly minLevel: number;

  constructor(
    private readonly service: string,
    options: {
      level?: LogLevel;
      sinks?: LogSink[];
    } = {},
  ) {
    const level = options.level ?? (process.env['NODE_ENV'] === 'production' ? 'info' : 'debug');
    this.minLevel = LOG_LEVEL_SEVERITY[level] ?? LOG_LEVEL_SEVERITY.debug;

    if (options.sinks) {
      this.sinks = options.sinks;
    } else {
      this.sinks =
        process.env['NODE_ENV'] === 'production' || process.env['LOG_FORMAT'] === 'json'
          ? [jsonSink]
          : [consoleSink];
    }
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error,
  ): void {
    if (LOG_LEVEL_SEVERITY[level] < this.minLevel) return;

    const entry: LogEntry = {
      level,
      message,
      service: this.service,
      timestamp: new Date().toISOString(),
      context,
      error: error
        ? { message: error.message, stack: error.stack, code: (error as NodeJS.ErrnoException).code }
        : undefined,
    };

    for (const sink of this.sinks) {
      try {
        sink(entry);
      } catch {
        // Never let a logging failure crash the application
      }
    }
  }

  trace(message: string, context?: Record<string, unknown>): void {
    this.log('trace', message, context);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log('error', message, context, error);
  }

  fatal(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log('fatal', message, context, error);
  }

  // Create a child logger with additional context always attached
  child(childContext: Record<string, unknown>): Logger {
    const child = new Logger(this.service, { sinks: [...this.sinks] });

    // Override the log method to merge contexts
    const origLog = child['log'].bind(child);
    child['log'] = (
      level: LogLevel,
      message: string,
      context?: Record<string, unknown>,
      error?: Error,
    ) => origLog(level, message, { ...childContext, ...context }, error);

    return child;
  }
}

// Default global logger — services should create their own named loggers
export const logger = new Logger('titan');

// Factory for creating named service loggers
export function createLogger(
  service: string,
  options?: { level?: LogLevel; sinks?: LogSink[] },
): Logger {
  return new Logger(service, options);
}
