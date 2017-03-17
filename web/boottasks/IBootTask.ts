export interface IBootTask {
    execute(): Promise<boolean>;
    getName(): string;
}
