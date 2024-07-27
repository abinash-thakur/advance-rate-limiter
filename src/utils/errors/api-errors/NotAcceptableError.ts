import { CustomApiError } from './CustomApiError';

class NotAcceptableError extends CustomApiError {
  statusCode = 406;
  constructor(message: string) {
    super(message);
  }
}

export { NotAcceptableError };
