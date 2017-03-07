import { ITask } from './ITask';
import { ActivateBots } from '../../actions/';
import { injectable } from 'inversify';

@injectable()
export class ActivateBotsTask implements ITask {

    public async execute(): Promise<boolean> {
        try {
            console.log('Activate bots task run!');
            let action = new ActivateBots.Action();
            action.run();
            setInterval(function() { 
                console.log('Restarted bots activation');
                let action = new ActivateBots.Action();
                action.run();
            }, 180000);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}