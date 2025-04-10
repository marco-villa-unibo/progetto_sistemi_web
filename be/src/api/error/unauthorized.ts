import { HttpError } from './http';

export class Unauthorized extends HttpError {
  constructor(message: string) {
    super(401, message || 'Unauthorized');
  }
}
