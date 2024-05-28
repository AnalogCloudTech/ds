export interface HttpExceptionResponse {
    statusCode: number;
    error: string;
}
export interface CustomHttpExceptionResponse extends HttpExceptionResponse {
    path: string;
    method: string;
    timestamp: Date;
    errors: string[];
    origin: string;
    stack?: string;
    innerError?: CustomHttpExceptionResponse;
}
