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
};
export function getHealthCheckPort(servicePort) {
    return servicePort + HEALTH_CHECK_PORT_OFFSET;
}
//# sourceMappingURL=ports.js.map