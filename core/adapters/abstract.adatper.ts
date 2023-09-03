type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export abstract class AbstractAdapter<T> {
    protected baseURL: string;
    protected apiKey: string;

    constructor(baseURL) {
        this.apiKey = process.env.API_KEY ?? "";
        this.baseURL = baseURL;
    }
    protected async _request<T = unknown>(
        method: RequestMethod,
        endpoint: string,
        data?: unknown,
    ) {
        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            "X-API-Key": this.apiKey,
        };
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: method,
            headers: headers,
            body: data ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
            throw new Error(
                `API request failed with status ${response.status} ${response.statusText}`,
            );
        }

        return response.json();
    }

}