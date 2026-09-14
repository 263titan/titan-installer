export declare const HEALTH_CHECK_PORT_OFFSET = 1000;
export declare const SERVICE_PORTS: {
    readonly TITANFLOW: 50051;
    readonly DEVICESYNC: 50052;
    readonly TRUEPATH: 50053;
    readonly PLOTVISION: 50054;
    readonly COLORVISION: 50055;
    readonly FONTSRV: 50056;
    readonly PRODUCTION_INTEL: 50057;
    readonly CERT_SRV: 50061;
    readonly SYNCTRACE: 50070;
};
export type ServiceName = keyof typeof SERVICE_PORTS;
export declare function getHealthCheckPort(servicePort: number): number;
//# sourceMappingURL=ports.d.ts.map