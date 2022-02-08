import { RequestConfig } from '../../fetch-http-client/fetch-http-client-types';
import { ParsedParams } from './url-parser-types';

export class UrlParser {
  public static parseData(url: string): ParsedParams {
    if (!url.length) return {};

    const params = url.slice(url.indexOf('?') + 1).split('&');
    const parsedParams: ParsedParams = {};

    for (let i = 0; i < params.length; i++) {
      const param = params[i].split('=');
      parsedParams[param[0]] = decodeURIComponent(param[1]);
    }

    return parsedParams;
  }

  public static parseUrlWithParams(
    baseURL: string,
    config: RequestConfig
  ): string {
    const url = new URL(`${baseURL}${config.url}`);
    url.search = new URLSearchParams(config.params).toString();
    return url.href;
  }
}
