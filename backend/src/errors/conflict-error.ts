import { BaseError } from "./base-error";

export class ConflictError extends BaseError {
  constructor(message = "Конфликт данных") {
    super(message, 409);
  }
}
