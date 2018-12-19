export interface ITask {
    execute(): Promise<boolean>;
}