import { ITask } from './ITask';
import { ListenActiveBoxes } from '../../actions/';
import { injectable } from 'inversify';

@injectable()
export class ListenActiveBoxesTask implements ITask {

    public async execute(): Promise<boolean> {
        try {
            console.log('Start listen');
            let action = new ListenActiveBoxes.Action();
            action.run();
            setInterval(function() { 
                console.log('Resterated listen');
                let action = new ListenActiveBoxes.Action();
                action.run();
            }, 30000);
            return true;
        } catch (e) { 
            return false;
        }
    }
}