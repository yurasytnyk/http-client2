import { FetchResponse, RequestConfig } from "./fetch-http-client-types";

export class FetchHttpClient {
  private config: RequestConfig;
  private url: URL;

  constructor(url: URL, config?: RequestConfig) { // <-- change URL type
    this.config = config;
    this.url = url;
  }

  async request(config: RequestConfig): Promise<FetchResponse> {
    if (Object.keys(config.params).length) {
      this.url = new URL(config.url);
      this.url.search = new URLSearchParams(config.params).toString();
    } else {
      this.url.href = config.url;
    }
    
    const res = await fetch(this.url.href, {
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
