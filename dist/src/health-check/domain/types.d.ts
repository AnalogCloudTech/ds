export declare enum HealthStatus {
    HEALTH_ALIVE = "alive",
    HEALTH_DEAD = "dead"
}
export type HealthItem = {
    name: string;
    key: string;
    responseTime: number;
    status: HealthStatus;
};
export declare class SystemHealth {
    name: 'Digital Services';
    key: 'DS';
    services: Array<HealthItem>;
    status: HealthStatus;
    responseTime: number;
}
