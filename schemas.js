const BaseJoi = require("joi")
const sanitizeHtml = require('sanitize-html'); // this will sanitize HTML and check if there is any error or any tags written in input text field and if there is any tags or script is written then it will just return empty string

const extension = (joi) =>({   // this iss preventing against any sort of attack on web_site this will not allow to addd any xxs and have access or destroy any thing of web
    type:'string',             // here we have attach an functionality to joi as joi does not allow any sorf of prevention of writing xxs or script tags in  input fields
    base:joi.string(),
    messages:{
        'string.escapeHTML': '{{#lable}} must not include HTML'
    },
    rules:{
        escapeHTML : {
            validate(value,helpers){
                const clean = sanitizeHtml(value,{
                    allowedTags:[],
                    allowedAttributes:{},
                });
                if(clean !== value) return helpers.error('string.escapeHTML',{value});
                return clean;
            }
        }
    }
})
const Joi = BaseJoi.extend(extension);

module.exports.campgroundschema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // image:Joi.string().required(),
        location : Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages:Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body:Joi.string().required().escapeHTML(),
        rating: Joi.string().min(1).max(5).required()
    }).required()
})