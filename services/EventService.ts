import { IEventService } from './IEventService';

export class EventService implements IEventService {

    public async subscribe(event: string, callback: (event: string, payload: any) => void): Promise<boolean> {
        return true;
    }

    public async broadcast(event: string, payload: any): Promise<boolean> {
        return true;
    }

}