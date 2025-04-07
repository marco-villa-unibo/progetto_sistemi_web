import { HttpError } from './http';

export class UnprocessableEntityError extends HttpError {
  constructor(message: string) {
    super(422, message);
  }
}
