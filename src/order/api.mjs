import { OrderServices } from "./model.mjs";
import { BookModel } from "../book/model.mjs";
import {CreateOrderValidator} from "../../lib/schema/orderAPISchema.mjs";
export const createOrder = async (request, response) => {
    try {
        const userId = request.user._id;
        const validate = CreateOrderValidator.validate(request.body);
        if (validate.error) {
            const error = new Error(`Validation Error : ${validate.error.details[0].message}`);
            error.errorCode = "generalError";
            throw error;
        }
        const book = await BookModel.findById(request.body.bookId);
        if (book) {
            const order = await OrderServices.createOrUpdateOrder(userId, {
                bookId: request.body.bookId,
                quantity: request.body.quantity,
                title: book.title,
                price: book.price,
            });
            return response.status(201).json(order);
        }
        return response.status(404).json({ message: "Book not found" });
    }
    catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
};
export const getUserOrders = async (request, response) => {
    try {
        const userId = request.user._id;
        const orders = await OrderServices.getUserOrder(userId);
        response.status(200).json({ orders: orders });
    }
    catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
};
export const getCurrentOrder = async (request, response) => {
    try {
        const userId = request.user._id;
        const currentOrder = await OrderServices.getActiveOrder(userId);
        if (!currentOrder) {
            return response.status(404).json({ message: "No data found" });
        }
        return response.status(200).json(currentOrder);
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
    }
};

export const removeBookOrder = async (request, response) => {
    try {
        const bookIdToRemove = request.params.bookId;
        const order = await OrderServices.getActiveOrder(request.user._id);
        console.log(order, "order>>>>>>>>>>>")
        if(order){
            await order.removeBook(bookIdToRemove);
            response.status(200).json(order.bookData);
        } else {
            response.status(404).json({message: "Order not found!!"});
        }
    }
    catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
};
export const deleteOrder = async (request, response) => {
    try {
        await OrderServices.removeOrder(request.user._id);
        response.status(204).end();
    }
    catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
};
export const placeOrder = async (request, response) => {
    try {
        await OrderServices.placeOrder(request.user._id);
        response.status(200).end();
    }
    catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
};
