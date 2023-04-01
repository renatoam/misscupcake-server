import { ServerResponse } from "http";

export interface HttpHelperResponse {
  statusCode: number
  body: unknown
}

export interface CookieOptions {
  maxAge?: number | undefined;
  signed?: boolean | undefined;
  expires?: Date | undefined;
  httpOnly?: boolean | undefined;
  path?: string | undefined;
  domain?: string | undefined;
  secure?: boolean | undefined;
  encode?: ((val: string) => string) | undefined;
  sameSite?: boolean | 'lax' | 'strict' | 'none' | undefined;
}

export type Locals = Record<string, any>

export type Send<ResponseBody = any, T extends ServerResponse = ServerResponse> = (body?: ResponseBody) => T;
export type ErrorCallback = (error: Error) => void

export interface HttpResponse<ResponseBody = unknown> extends ServerResponse {
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
