interface Response {
    status: number;
}
export declare class ErrorInfo extends Error {
    response: Response;
    message: string;
}
export {};
