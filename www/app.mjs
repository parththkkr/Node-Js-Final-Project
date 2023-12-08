import express from "express";
import morgan from "morgan";
import { camelCaseParser } from "./custom.middelewares.mjs";
import { userAPIRouter } from "../src/users/apiRouters.mjs";
import * as path from "path";
import { bookAPIRouter } from "../src/book/apiRouters.mjs";
import { loginView, registerView } from "../src/users/app.mjs";
import { bookDetailView, bookListView } from "../src/book/app.mjs";
import { orderAPIRouter } from "../src/order/apiRouter.mjs";
import { currentOrderView, customerOrdersView } from "../src/order/app.mjs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const app = express();
app.use("/public", express.static(__dirname.replace("www", "public")));
app.set("views", path.join(__dirname.replace("www", "src"), "template"));
app.set("view engine", "ejs");
app.get("/", (request, response) => {
    response.redirect("/register");
});
app.get("/login", loginView);
app.get("/register", registerView);
app.get("/book/list", bookListView);
app.get("/book/detail/:bookId", bookDetailView);
app.get("/order/active", currentOrderView);
app.get("/orders/user", customerOrdersView);
app.use(express.json());
app.use(camelCaseParser);
app.use(morgan("dev"));
app.use("/api/v1/user", userAPIRouter);
app.use("/api/v1/book", bookAPIRouter);
app.use("/api/v1/order", orderAPIRouter);
