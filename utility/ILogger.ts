export interface ILogger {
    createHttpLog(log: HttpLogEntry): void 
}

export interface HttpLogEntry {
    createdAt: Date,
    request: LogRequest,
    response: LogResponse
}
interface LogResponse {
    headers: any,
    statusCode: number,
    body: any
}
interface LogRequest {
    headers: any,
    method: string,
    url: string,
    params: any,
    query: string,
    body: any
}