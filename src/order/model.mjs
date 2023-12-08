import mongoose from "mongoose";
import { BookModel } from "../book/model.mjs";
const bookSchema = new mongoose.Schema({
    bookId: { type: String, required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});
const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    bookData: [bookSchema],
    totalPrice: { type: Number, default: 0 },
    orderPlaced: { type: Boolean, default: false },
    orderConfirmed: { type: Boolean, default: false },
    orderDate: { type: Number, default: 0 },
});

orderSchema.methods.removeBook = async function (bookId) {
    console.log(bookId, "removeBook>>>>>>>>>>>>>>>>>")
    this.bookData = this.bookData.filter(book => book.bookId !== bookId);
    await this.save()
    let totalPrice = 0
    this.bookData.forEach(book=>{
        totalPrice += (book.price * book.quantity)
    })
    this.totalPrice = totalPrice
    await this.save()
    return
};
export const OrderModel = mongoose.model("Order", orderSchema);
export class OrderServices {
    static async getActiveOrder(userId) {
        try {
            return await OrderModel.findOne({
                userId: userId,
                orderPlaced: false,
            });
        }
        catch (error) {
            throw new Error(`Failed to fetch current order: ${error.message}`);
        }
    }
    static async getUserOrder(userId) {
        try {
            return await OrderModel.find({
                userId: userId,
            });
        }
        catch (error) {
            throw new Error(`Failed to fetch current order: ${error.message}`);
        }
    }
    static async removeOrder(userId) {
        try {
            const removedOrder = await OrderModel.findOneAndDelete({
                userId: userId,
                orderPlaced: false,
            });
            if (!removedOrder) {
                throw new Error("Order not found");
            }
        }
        catch (error) {
            throw new Error(`Failed to remove order: ${error.message}`);
        }
    }
    static async placeOrder(userId) {
        try {
            const placedOrder = await OrderModel.findOneAndUpdate({
                userId: userId,
                orderPlaced: false,
            }, {
                orderPlaced: true,
            });
            if (!placedOrder) {
                throw new Error("Order not found");
            }
            const orderedBooks = placedOrder.bookData;
            for (const orderedBook of orderedBooks) {
                const book = await BookModel.findById(orderedBook.bookId);
                if (!book) {
                    return;
                }
                book.stock = book.stock - orderedBook.quantity;
                await book.save();
            }
            return placedOrder;
        }
        catch (error) {
            throw new Error(`Failed to place order: ${error.message}`);
        }
    }
    static async createOrUpdateOrder(userId, bookData) {
        try {
            const existingOrder = await this.getActiveOrder(userId);
            if (existingOrder) {
                const existingBook = existingOrder.bookData.find((book) => book.bookId === bookData.bookId);
                if (existingBook) {
                    const reducePrice = existingBook.quantity * existingBook.price;
                    const addPrice = bookData.quantity * existingBook.price;
                    existingOrder.totalPrice = parseFloat((existingOrder.totalPrice - reducePrice + addPrice).toFixed(2));
                    existingBook.quantity = bookData.quantity;
                }
                else {
                    existingOrder.totalPrice =
                        existingOrder.totalPrice +
                            parseFloat((bookData.price * bookData.quantity).toFixed(2));
                    existingOrder.bookData.push(bookData);
                }
                await existingOrder.save();
                return existingOrder;
            }
            const newOrder = new OrderModel({
                userId,
                bookData: [bookData],
                totalPrice: parseFloat((bookData.price * bookData.quantity).toFixed(2)),
            });
            await newOrder.save();
            return newOrder;
        }
        catch (error) {
            throw new Error(`Failed to create a new order: ${error.message}`);
        }
    }
}
