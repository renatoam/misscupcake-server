export interface Controller<Request, Response> {
  handle(request: Request, response: Response): Promise<Response>
}