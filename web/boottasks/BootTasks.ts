import { Types, kernel } from '../../dependency-injection/';
import { IBootTask } from './IBootTask';

export class BootTasks {

    public static async run() {

        let bootTasks: IBootTask[] = [];
        
        try {
            bootTasks = kernel.getAll<IBootTask>(Types.BootTask);
        } catch(e) {}
        
        for (var i = 0; i < bootTasks.length; i++) {
            try {
                console.log('Boot task ' + bootTasks[i].getName() + ' started......');
                await bootTasks[i].execute();
                console.log('Boot task ' + bootTasks[i].getName() + ' completed!');
            } catch (e) {
                console.log('Boot task ' + bootTasks[i].getName() + ' failed! Check below for error log =>');
                console.log(e);
            }
        }
    }
}