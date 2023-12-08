import { UserService } from "./models.mjs";
import { PATCHUserUpdate, POSTUserLogin, POSTUserRegister, } from "../../lib/schema/userAPISchemas.mjs";
const userService = new UserService();
export const createUser = async (request, response) => {
    try {
        let payload = request.body;
        const validate = POSTUserRegister.validate(payload);
        if (validate.error) {
            const error = new Error(`Validation Error : ${validate.error.details[0].message}`);
            error.errorCode = "generalError";
            throw error;
        }
        const newUser = await userService.createUser(payload);
        const { email, username, firstName: firstName, lastName: lastName, createdAt, active, _id, } = newUser;
        const data = {
            email,
            username,
            firstName,
            lastName,
            createdAt,
            active,
            _id,
        };
        return response.status(201).json(data);
    }
    catch (err) {
        return response
            .status(400)
            .json({ status: "Failed", message: err.message });
    }
};
export const loginUser = async (request, response) => {
    try {
        let payload;
        if (typeof request.body === "string") {
            payload = JSON.parse(request.body);
        }
        else {
            payload = request.body;
        }
        const validate = POSTUserLogin.validate(payload);
        if (validate.error) {
            const error = new Error(`Validation Error : ${validate.error.details[0].message}`);
            error.errorCode = "generalError";
            throw error;
        }
        const user = await userService.loginUser(payload);
        const { email, username, firstName, lastName, createdAt, active, _id, jwtToken, } = user;
        const data = {
            email,
            username,
            firstName,
            lastName,
            createdAt,
            active,
            _id,
            jwtToken,
        };
        return response.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        return response
            .status(400)
            .json({ status: "Failed", message: err.message });
    }
};
export const getUser = async (request, response) => {
    try {
        const user = await userService.getById(request.user._id);
        if (user === null) {
            return response
                .status(404)
                .json({ status: "Failed", message: "data not found!" });
        }
        const { email, username, fistName: firstName, lastName: lastName, createdAt, active, _id, } = user;
        const data = {
            email,
            username,
            firstName,
            lastName,
            createdAt,
            active,
            _id,
        };
        return response.status(200).json(data);
    }
    catch (err) {
        return response
            .status(400)
            .json({ status: "Failed", message: err.message });
    }
};
export const updateUser = async (request, response) => {
    try {
        let payload;
        if (typeof request.body === "string") {
            payload = JSON.parse(request.body);
        }
        else {
            payload = request.body;
        }
        const validate = PATCHUserUpdate.validate(payload);
        if (validate.error) {
            const error = new Error(`Validation Error : ${validate.error.details[0].message}`);
            error.errorCode = "generalError";
            throw error;
        }
        const updatedUser = await userService.findAndUpdateUserData(request.user._id, payload);
        if (updatedUser === null) {
            return response
                .status(404)
                .json({ status: "Failed", message: "data not found!" });
        }
        const { email, username, fistName: firstName, lastName: lastName, createdAt, active, _id, } = updatedUser;
        const data = {
            email,
            username,
            firstName,
            lastName,
            createdAt,
            active,
            _id,
        };
        return response.status(200).json(data);
    }
    catch (err) {
        return response
            .status(400)
            .json({ status: "Failed", message: err.message });
    }
};
export const deleteUser = async (request, response) => {
    try {
        const user = await userService.findAndDelete(request.user._id);
        if (user === null) {
            return response
                .status(404)
                .json({ status: "Failed", message: "data not found!" });
        }
        return response.status(204).json();
    }
    catch (err) {
        return response
            .status(400)
            .json({ status: "Failed", message: err.message });
    }
};
