import { IErrorClassObj } from '../interface/error.interface';
import { AccessForbiddenError } from './api-errors/AccessForbiddenError';
import { InternalServerError } from './api-errors/InternalServerError';

export { AccessForbiddenError, InternalServerError };

export const errorClassObj: IErrorClassObj = {
    403: AccessForbiddenError,
};
