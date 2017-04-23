import { IBootTask } from "./IBootTask";
import * as actions from "../../actions/";
import { injectable } from "inversify";
import { Bot } from "../../entities/";

@injectable()
export class ActivateBots implements IBootTask {

    public getName(): string {

        return "ActivateBots";
    }

    public async execute(): Promise<boolean> {

        let action = new actions.ActivateBots.Action();

        let bots: Bot[] = await action.run();

        for (let i = 0; i < bots.length; i++) {
            console.log("Bot with code " + bots[i].id + " has been activated");
        }

        return true;
    }
}
