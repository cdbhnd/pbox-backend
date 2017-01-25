import 'reflect-metadata';
import {DB} from './database/DB';
import { Process } from './background/Process';
import { ListenActiveBoxes } from './actions/';

DB.init()
    .then(function () {
        let backgroundPorcess = new Process();
        backgroundPorcess.run();
        //let action = new ListenActiveBoxes.Action();
        //action.run();
    });

