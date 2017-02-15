import { ITask } from './ITask';
import { ActivateBots } from '../../actions/';
import { injectable } from 'inversify';

@injectable()
export class ActivateBotsTask implements ITask {

    public async execute(): Promise<boolean> {
        try {
            console.log('Start listen');
            let action = new ActivateBots.Action();
            action.run();
            /*setInterval(function() { 
                console.log('Resterated listen');
                let action = new ActivateBots.Action();
                action.run();
            }, 60000);*/
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}