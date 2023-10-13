import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";

export interface Controller {
  handle(request: HttpRequest, response: HttpResponse): Promise<HttpResponse>
}
