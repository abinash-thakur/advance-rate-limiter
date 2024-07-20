import { CustomApiError } from './CustomApiError';

class AccessForbiddenError extends CustomApiError {
    statusCode = 403;
    constructor(message: string) {
        super(message);
    }
}
export { AccessForbiddenError };
