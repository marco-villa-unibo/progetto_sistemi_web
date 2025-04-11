import { HttpError } from './http';

export class ServiceUnavailableError extends HttpError {
  constructor(message: string) {
    super(503, message || 'Service Unavailable');
  }
}
