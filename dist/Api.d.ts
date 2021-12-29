declare class UserError extends Error {
    constructor(message: string);
}
interface RedirectInterface {
    url: string;
    ending: string;
}
declare class Redirect implements RedirectInterface {
    url: string;
    ending: string;
    constructor(url: string, ending: string);
    genEnding(length: number): string;
}
declare class Shortie {
    instance: string;
    constructor(instance: string);
    set updateInstance(instance: string);
    createRedirect(redirect: RedirectInterface): Promise<any>;
    getRedirect(ending: string): Promise<Redirect>;
}
export { Shortie, UserError, Redirect, RedirectInterface };
