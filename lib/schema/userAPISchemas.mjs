import Joi from "joi";
export const POSTUserRegister = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    password: Joi.string().required(),
}).unknown(false);
export const POSTUserLogin = Joi.object({
    identifier: Joi.string().required(),
    password: Joi.string().required(),
}).unknown(false);
export const PATCHUserUpdate = Joi.object({
    email: Joi.string().email(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    active: Joi.boolean(),
}).unknown(false);
