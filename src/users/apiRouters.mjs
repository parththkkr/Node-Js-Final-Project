import { createUser, deleteUser, getUser, loginUser, updateUser } from "./api.mjs";
import express from "express";
import {jwtDecoder} from "../../www/custom.middelewares.mjs";
export const userAPIRouter = express.Router();
userAPIRouter.route("/register").post(createUser);
userAPIRouter.route("/login").post(loginUser);
userAPIRouter.use(jwtDecoder);
userAPIRouter.route("/").get(getUser).patch(updateUser).delete(deleteUser);
