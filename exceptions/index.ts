export * from './ValidationException';
export * from './InvalidCredentialsException';
export * from './EntityNotFoundException';
export * from './UsernameNotAvailableException';
export * from './ArgumentNullException';
export * from './ServiceLayerException';
export class ExceptionTypes {
    static ValidationException: string = 'ValidationException';
    static InvalidCredentialsException: string = 'InvalidCredentialsException';
    static EntityNotFoundException: string = 'EntityNotFoundException';
    static UsernameNotAvailableException: string = 'UsernameNotAvailableException';
    static UserNotAuthorizedException: string = 'UserNotAuthorizedException';
    static ArgumentNullException: string = 'ArgumentNullException';
    static ServiceLayerException: string = 'ServiceLayerException';
}