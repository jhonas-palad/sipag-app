import { ResponseErrDetails } from "@/types/errors";
import { err } from "react-native-svg";
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
    try {
      this._body = JSON.parse(this._body);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
    return this._body;
  }
  toString() {
    return this.constructor.name;
  }
}
