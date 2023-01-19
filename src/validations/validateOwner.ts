import {validate, Joi} from 'express-validation';

export default validate({
    body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(20).required(),
        image_link: Joi.string().required(),
        cnpj: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required()
    })
})
