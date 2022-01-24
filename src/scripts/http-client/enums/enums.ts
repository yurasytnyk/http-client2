export enum HTTP_METHODS {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export type Method =
  | 'get' | 'GET' | HTTP_METHODS.GET
  | 'delete' | 'DELETE' | HTTP_METHODS.DELETE
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST' | HTTP_METHODS.POST
  | 'put' | 'PUT' | HTTP_METHODS.PUT
  | 'patch' | 'PATCH'
  | 'purge' | 'PURGE'
  | 'link' | 'LINK'
  | 'unlink' | 'UNLINK';
  