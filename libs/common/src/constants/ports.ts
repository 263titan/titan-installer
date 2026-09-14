export const HEALTH_CHECK_PORT_OFFSET = 1000;

export const SERVICE_PORTS = {
  TITANFLOW: 50051,
  DEVICESYNC: 50052,
  TRUEPATH: 50053,
  PLOTVISION: 50054,
  COLORVISION: 50055,
  FONTSRV: 50056,
  PRODUCTION_INTEL: 50057,
  CERT_SRV: 50061,
  SYNCTRACE: 50070,
  // NOTE: titandaemon telemetry defaults to 50071, which currently collides
  // with the synctrace WebSocket port (tracked separately).
  TITANDAEMON: 50071,
} as const;

export type ServiceName = keyof typeof SERVICE_PORTS;

export function getHealthCheckPort(servicePort: number): number {
  return servicePort + HEALTH_CHECK_PORT_OFFSET;
}