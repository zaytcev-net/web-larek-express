import { BaseError } from "./base-error";

export class NotFoundError extends BaseError {
  constructor(message = "Ресурс не найден") {
    super(message, 404);
  }
}
