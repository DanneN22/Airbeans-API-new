import Joi from 'joi';

const menuSchema = Joi.object({
    id: Joi.number().required(),
    title: Joi.string().required(),
    desc: Joi.string().required(),
    price: Joi.number().required(),
    createdAt: Joi.string(),
    modifiedAt: Joi.string()
});

export default menuSchema;