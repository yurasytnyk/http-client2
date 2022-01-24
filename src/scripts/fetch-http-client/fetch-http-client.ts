import { FetchResponse, RequestConfig } from "./fetch-http-client-types";

export class FetchHttpClient {
  async request(config: RequestConfig): Promise<FetchResponse> {
    const res = await fetch(config.url, {
      method: config.method,
      body: JSON.stringify(config.data)
    });
    const data = await res.json();

    return {
      data
    };
  }
}
