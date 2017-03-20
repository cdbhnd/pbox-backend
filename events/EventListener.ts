export function EventListener(event: string) {

    return function eventListenerHandler(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {

        // subscribe decorator.value function to the provided event (string) param

        return descriptor;
    }
}