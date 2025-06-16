const joi = require('joi');

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().trim().required(),
        description: joi.string().trim().required(),
        image: joi.object({
            url: joi.string().uri().allow('', null)
        }).optional(),
        price: joi.number().required().min(0),
        country: joi.string().trim().required(),
        location: joi.string().trim().required(),
    }).required()
});

