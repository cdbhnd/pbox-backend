import { ITask } from "./ITask";
import { ListenActiveBoxes } from "../../actions/";
import { injectable } from "inversify";

@injectable()
export class ListenActiveBoxesTask implements ITask {

    public async execute(): Promise<boolean> {
        try {
            console.log("Start listen");
            let action = new ListenActiveBoxes.Action();
            action.run();
            setInterval(() => {
                console.log("Resterated listen");
                let intervalAction = new ListenActiveBoxes.Action();
                intervalAction.run();
            }, 30000);
            return true;
        } catch (e) {
            return false;
        }
    }
}
