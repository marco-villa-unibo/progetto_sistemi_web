import { HttpError } from './http';

export class Forbidden extends HttpError {
  constructor(message: string) {
    super(403, message || 'Forbidden');
  }
}
