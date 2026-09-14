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
export declare class Logger {
    private readonly service;
    private readonly sinks;
    private readonly minLevel;
    constructor(service: string, options?: {
        level?: LogLevel;
        sinks?: LogSink[];
    });
    private log;
    trace(message: string, context?: Record<string, unknown>): void;
    debug(message: string, context?: Record<string, unknown>): void;
    info(message: string, context?: Record<string, unknown>): void;
    warn(message: string, context?: Record<string, unknown>): void;
    error(message: string, error?: Error, context?: Record<string, unknown>): void;
    fatal(message: string, error?: Error, context?: Record<string, unknown>): void;
    child(childContext: Record<string, unknown>): Logger;
}
export declare const logger: Logger;
export declare function createLogger(service: string, options?: {
    level?: LogLevel;
    sinks?: LogSink[];
}): Logger;
//# sourceMappingURL=index.d.ts.map