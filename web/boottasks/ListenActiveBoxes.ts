import { IBootTask } from './IBootTask';
import * as actions from '../../actions/';
import { injectable } from 'inversify';
import { IBox } from '../../entities/';

@injectable()
export class ListenActiveBoxes implements IBootTask {

    public getName(): string {

        return 'ListenActiveBoxes';
    }

    public async execute(): Promise<boolean> {

        let action = new actions.ListenActiveBoxes.Action();

        let boxes: IBox[] = await action.run();

        for (var i = 0; i < boxes.length; i++) {
            console.log('Box with code ' + boxes[i].code + ' has been listened');
        }

        return true;
    }
}