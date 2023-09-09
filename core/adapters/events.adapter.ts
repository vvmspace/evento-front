type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
import { Event } from "../models/event.model";
import { Search } from "../interfaces/search.interface";
export class EventServiceAdapter {
  private baseURL: string;
  private apiKey: string;

  constructor(
    baseURL: string = process.env.EVENT_SERVICE_BASE_URL ?? "",
    apiKey: string = process.env.API_KEY ?? "",
  ) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;

    if (!this.baseURL || !this.apiKey) {
      throw new Error(
        "Both baseURL and apiKey must be provided or set in the environment variables.",
      );
    }
  }

  private async _request(
    method: RequestMethod,
    endpoint: string,
    data?: Partial<Event>,
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

  public async createEvent(data: Event): Promise<Event> {
    return this._request("PUT", "/events", data);
  }

  public async upsertEvent(data: Partial<Event>): Promise<Event> {
    return this._request("POST", "/events/upsert", data);
  }

  public async getEvent(id: string) {
    return this._request("GET", `/events/${id}`);
  }

  public async updateEvent(id: string, data: Partial<Event>) {
    if (!id) {
      throw new Error("id is required");
    }
    return this._request("PATCH", `/events/${id}`, data).catch((err) => {
      console.log(err);
      console.log(id, data);
      return null;
    });
  }

  public async deleteEvent(id: string) {
    return this._request("DELETE", `/events/${id}`);
  }

  public async listEvents(searchParams: Search<Event> = {}) {
    const queryString = this.createQueryString(searchParams);
    return this._request("GET", `/events?${queryString}`);
  }

  private createQueryString(searchParams: Search<Event>): string {
    const queryString = [];

    // Параметры запроса
    if (searchParams.query) {
      for (const [key, value] of Object.entries(searchParams.query)) {
        if (typeof value === "object" && !Array.isArray(value)) {
          for (const [subKey, subValue] of Object.entries(value)) {
            queryString.push(`${key}.${subKey}=${subValue}`);
          }
        } else {
          queryString.push(`${key}=${value}`);
        }
      }
    }

    // Сортировка
    if (searchParams.sort) {
      queryString.push(`sort=${searchParams.sort}`);
    }

    // Пагинация
    if (searchParams.from !== undefined) {
      queryString.push(`from=${searchParams.from}`);
    }
    if (searchParams.size !== undefined) {
      queryString.push(`size=${searchParams.size}`);
    }
    if (searchParams.select) {
      queryString.push(`select=${searchParams.select.join(",")}`);
    }
    return queryString.join("&");
  }
}
