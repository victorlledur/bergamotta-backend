import {validate, Joi} from 'express-validation';

export default validate({
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(20).required(),
    })
})