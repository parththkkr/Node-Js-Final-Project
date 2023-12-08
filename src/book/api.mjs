import { BookModel } from "./model.mjs";
import {CreateBookSchema} from "../../lib/schema/bookAPISchema.mjs";
import env from "../../lib/env.mjs"

export const getAllBooks = async (request, response) => {
    const searchInput = request.query.searchInput;
    let books = []
    if (!searchInput) {
        books = await BookModel.find({});
    }
    else {
        books = await BookModel.find({
            $or: [
                { title: { $regex: searchInput, $options: "i" } },
                { author: { $regex: searchInput, $options: "i" } },
                { genre: { $regex: searchInput, $options: "i" } },
            ],
        });
    }
    books.map((book)=>{book.image = `${env.MEDIA_URL}/public/${book.image}` })
    return response.status(200).json({ books: books });

};
export const getBookById = async (request, response) => {
    try {
        const book = await BookModel.findById(request.params.id).exec();
        book.image = `${env.MEDIA_URL}/public/${book.image}`
        return response.status(200).json(book);
    }
    catch (err) {
        return response
            .status(400)
            .json({ message: err.message || "BookModel not found" });
    }
};
export const createNewBook = async (request, response) => {
    let payload = request.body;
    const validate = CreateBookSchema.validate(payload);
    if (validate.error) {
        const error = new Error(`Validation Error : ${validate.error.details[0].message}`);
        error.errorCode = "generalError";
        throw error;
    }
    try {
        const newBook = new BookModel(payload);
        await newBook.save();
        return response.status(200).json(payload);
    }
    catch (err) {
        return response.status(400).json({ message: err.message });
    }
};
export const updateBookById = async (request, response) => {
    let payload = request.body;
    const validate = PatchBookValidator.validate(payload);
    if (validate.error) {
        const error = new Error(`Validation Error : ${validate.error.details[0].message}`);
        error.errorCode = "generalError";
        throw error;
    }
    try {
        const updatedBook = await BookModel.findByIdAndUpdate(request.params.id, payload);
        if (updatedBook) {
            await updatedBook.save();
            return response.status(400).json(updatedBook);
        }
        else {
            return response.status(400).json({ message: "No BookModel Found" });
        }
    }
    catch (err) {
        return response.status(400).json({ message: err.message });
    }
};
export const deleteBookById = async (request, response) => {
    try {
        const deleteBook = await BookModel.findByIdAndDelete(request.params.id);
        if (deleteBook === null) {
            return response.status(404).json({ requestmessage: "data not found!" });
        }
        return response.status(204).json();
    }
    catch (err) {
        console.log(err);
        return response.status(400).json({ requestmessage: err.message });
    }
};
