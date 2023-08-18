type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
import { Event } from '../models/event.model';

export class EventServiceAdapter {
    private baseURL: string;
    private apiKey: string;

    constructor(baseURL: string = process.env.EVENT_SERVICE_BASE_URL ?? "", apiKey: string = process.env.API_KEY ?? "") {
        this.baseURL = baseURL;
        this.apiKey = apiKey;

        if (!this.baseURL || !this.apiKey) {
            throw new Error('Both baseURL and apiKey must be provided or set in the environment variables.');
        }
    }

    private async _request(method: RequestMethod, endpoint: string, data?: Partial<Event>) {
        const headers = {
            'Content-Type': 'application/json',
            'X-Api-Key': this.apiKey  // добавляем ключ API в заголовок
        };

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: method,
            headers: headers,
            body: data ? JSON.stringify(data) : undefined
        });

        // if (!response.ok) {
        //     throw new Error(`API request failed with status ${response.status}`);
        // }

        return response.json();
    }

    public async createEvent(data: Event): Promise<Event> {
        return this._request('POST', '/events', data);
    }

    public async getEvent(id: string) {
        return this._request('GET', `/events/${id}`);
    }

    public async listEvents() {
        return this._request('GET', '/events');
    }

    public async updateEvent(id: string, data: Partial<Event>) {
        return this._request('PUT', `/events/${id}`, data);
    }

    public async deleteEvent(id: string) {
        return this._request('DELETE', `/events/${id}`);
    }
}
