import { HttpError } from './http';

export class ForbiddenError extends HttpError {
  constructor(message: string) {
    super(403, message || 'Forbidden');
  }
}
