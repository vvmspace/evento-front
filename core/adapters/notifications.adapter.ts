import {AbstractAdapter} from "./abstract.adatper";

export class NotifyServiceAdapter extends AbstractAdapter<{message: string, from?: string}> {
    constructor(baseURL = process.env.NOTIFY_SERVICE_BASE_URL ?? "") {
        super(baseURL);
    }

    async sendNotification({message, from}: {message: string, from?: string})  {
        return this._request("POST", "/notify", {message, from});
    }
}