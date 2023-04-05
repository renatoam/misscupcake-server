import { ServerResponse } from "http";

export interface HttpHelperResponse<T = unknown> {
  statusCode: number
  body: T
}

export interface CookieOptions {
  maxAge?: number;
  signed?: boolean;
  expires?: Date;
  httpOnly?: boolean;
  path?: string;
  domain?: string;
  secure?: boolean;
  encode?: ((val: string) => string);
  sameSite?: boolean | 'lax' | 'strict' | 'none';
}

export type Locals = Record<string, any>

export type Send<ResponseBody = any, T extends ServerResponse = ServerResponse> = (body?: ResponseBody) => T;
export type ErrorCallback = (error: Error) => void

export interface HttpResponse<ResponseBody = any> extends ServerResponse {
  status(code: number): this;
  sendStatus(code: number): this;
  send: Send<ResponseBody, this>;
  json: Send<ResponseBody, this>;
  sendFile(path: string, fn?: ErrorCallback): void;
  header(field: string, value?: string | string[]): this;
  clearCookie(name: string, options?: CookieOptions): this;
  cookie(name: string, val: any, options: CookieOptions): this;
  location(url: string): this;
  redirect(status: number, url: string): void;
  locals: Locals;
}

export interface HttpRequest {
  body: unknown,
  cookies: Record<string, unknown>,
  headers: Record<string, unknown>,
  params: Record<string, unknown>,
  query: Record<string, unknown>
}
