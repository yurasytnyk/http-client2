import { Method } from "../http-client/enums/enums";

type RecordFetch<K extends keyof any, T> = {
  [P in K]: T;
};

export type FetchRequestHeaders = RecordFetch<string, string | number | boolean>;

export interface RequestConfig {
  url?: string;
  method?: Method;
  headers?: FetchRequestHeaders;
  data?: BodyInit | {};
  params?: BodyInit | {}; 
}

export interface FetchResponse<T = any> {
  data: T;
}
