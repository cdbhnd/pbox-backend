export * from './ValidationException';
export * from './InvalidCredentialsException';
export * from './EntityNotFoundException';
export * from './UsernameNotAvailableException';
export class ExceptionTypes {
    static ValidationException: string = "ValidationException";
    static InvalidCredentialsException: string = "InvalidCredentialsException"
    static EntityNotFoundException: string = "EntityNotFoundException"
    static UsernameNotAvailableException: string = "UsernameNotAvailableException"
}