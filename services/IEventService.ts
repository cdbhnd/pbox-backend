export interface IEventService {
    subscribe(event: string, callback: (event: string, payload: any) => void): Promise<boolean>;
    broadcast(event: string, payload: any): Promise<boolean>;
}