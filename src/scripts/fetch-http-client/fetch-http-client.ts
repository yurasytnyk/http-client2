import { FetchResponse, RequestConfig } from "./fetch-http-client-types";

export class FetchHttpClient {
  private config: RequestConfig;

  constructor(config?: RequestConfig) { // <-- change URL type
    this.config = config;
  }

  parseUrlWithParams(config: RequestConfig): string {
    const url = new URL(config.url);
    url.search = new URLSearchParams(config.params).toString();
    return url.href;
  }

  async request(config: RequestConfig): Promise<FetchResponse> {
    const url = this.parseUrlWithParams(config);

    const res = await fetch(url, {
      method: config.method,
      headers: this.config.headers,
      body: JSON.stringify(config.data)
    });
    const data = await res.json();

    return {
      data
    };
  }
}
