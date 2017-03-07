import { ITask } from './ITask';
import { DeactivateBots } from '../../actions/';
import { injectable } from 'inversify';

@injectable()
export class DeactivateBotsTask implements ITask {

    public async execute(): Promise<boolean> {
        try {
            console.log('Activate bots task run!');
            let action = new DeactivateBots.Action();
            action.run();
            setInterval(function() { 
                console.log('Restarted bots activation');
                let action = new DeactivateBots.Action();
                action.run();
            }, 300000);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}