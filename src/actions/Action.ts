export class Action<T> {
    constructor(public readonly apply: (domainObject: T) => T) {
    }
}
