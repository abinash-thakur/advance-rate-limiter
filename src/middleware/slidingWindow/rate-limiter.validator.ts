import Joi from 'joi';

const rateLimitConfigSchema = Joi.object({
    limit: Joi.number().integer().positive().required(),
    windowTime: Joi.number().integer().positive().required(),
}).required();

export default rateLimitConfigSchema;
