import Joi from 'joi';

const bundleSchema = Joi.object({
    titles: Joi.array().items().required(),
    bundlePrice: Joi.number().required(),
});

export default bundleSchema;