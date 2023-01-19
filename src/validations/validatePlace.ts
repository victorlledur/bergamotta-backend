import {validate, Joi} from 'express-validation';

export default validate({
    body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        zipcode: Joi.string().required(),
        district: Joi.string().required(),
        street: Joi.string().required(),
        place_number: Joi.string().required(),
        complement: Joi.string(),
        image_link: Joi.string().required(),
        capacity: Joi.number().required(),
        description: Joi.string().required(),
        phone: Joi.string().required(),
        average_ticket_price: Joi.string().required(),
        social_link: Joi.string().required(),
        opening_hours: Joi.number().required(),
        payment: Joi.string().required(),
        latitude: Joi.string(),
        longitude: Joi.string()    
    })
})