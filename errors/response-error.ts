import { ResponseErrDetails } from "@/types/errors";
import { logger } from "@/utils/logger";
import { string } from "zod";
export class ResponseError extends Error {
  _body: any;
  status: Response["status"];
  err_data: ResponseErrDetails | null;

  constructor(
    message: string,
    options: ErrorOptions | null = null,
    body: any,
    status: Response["status"]
  ) {
    super(message, options ?? {});
    this._body = body;
    this.status = status || 400;
    this.err_data = null;
  }
  get errors() {
    if (this._body instanceof string) {
      this._body = {
        details: "An error occured. <ResponseErrror>",
      };
    }
    return this._body;
  }
  toString() {
    return this.constructor.name;
  }
}
