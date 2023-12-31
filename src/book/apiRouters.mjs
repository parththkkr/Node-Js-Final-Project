import express from "express";
import { jwtDecoder } from "../../www/custom.middelewares.mjs";
import { createNewBook, deleteBookById, getAllBooks, getBookById, updateBookById, } from "./api.mjs";
export const bookAPIRouter = express.Router();
bookAPIRouter.use(jwtDecoder);
bookAPIRouter.get("/list", getAllBooks);
bookAPIRouter.get("/detail/:id", getBookById);
bookAPIRouter.post("/create", createNewBook);
bookAPIRouter.put("/edit/:id", updateBookById);
bookAPIRouter.delete("/delete/:id", deleteBookById);
