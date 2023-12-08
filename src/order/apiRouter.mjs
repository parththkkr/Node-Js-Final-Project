import express from "express";
import {createOrder, deleteOrder, getCurrentOrder, getUserOrders, placeOrder, removeBookOrder,} from "./api.mjs";
import {jwtDecoder} from "../../www/custom.middelewares.mjs";

export const orderAPIRouter = express.Router();
orderAPIRouter.use(jwtDecoder);
orderAPIRouter.get("/list", getUserOrders);
orderAPIRouter.post("/create", createOrder);
orderAPIRouter.get("/current", getCurrentOrder);
orderAPIRouter.patch("/remove/book/:bookId", removeBookOrder);
orderAPIRouter.patch("/place", placeOrder);
orderAPIRouter.delete("/delete", deleteOrder);
