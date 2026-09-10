import { BaseError } from "./base-error";

export class UnauthorizedError extends BaseError {
  constructor(message = "Необходима авторизация") {
    super(message, 401);
  }
}
