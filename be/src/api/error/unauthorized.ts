import { HttpError } from './http';

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(401, message || 'Unauthorized');
  }
}
