import { Method } from "../http-client/enums/enums";

type RecordFetch<K extends keyof any, T> = {
  [P in K]: T;
};

export type FetchRequestHeaders = RecordFetch<string, string>;

export interface RequestConfig {
  url?: string;
  method?: Method;
  headers?: Record<string, string>;
  data?: BodyInit | {};
  params?: Record<string, string>; 
}

export interface FetchResponse<T = any> {
  data: T;
}
