export class Alert {
    id: string ="";
    type: AlertType | undefined;
    message: string ="";
    autoClose: boolean =true;
    keepAfterRouteChange: boolean =false;
    fade: boolean =false;

    constructor(init?:Partial<Alert>) {
        Object.assign(this, init);
    }
}

export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}
