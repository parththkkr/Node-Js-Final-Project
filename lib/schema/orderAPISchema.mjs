import Joi from "joi";
export const CreateOrderValidator = Joi.object({
    bookId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
}).unknown(false);
