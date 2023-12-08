import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../../lib/env.mjs";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "A user must have username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "A user must have email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "A user must have password"],
    },
    fistName: {
        type: String,
        default: "",
    },
    lastName: {
        type: String,
        default: "",
    },
    active: {
        type: Boolean,
        default: false,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Number,
        default: Date.now(),
        immutable: true,
    },
    lastLogin: {
        type: Number,
        default: null,
    },
});
const UserModel = mongoose.model("User", userSchema);
export class UserService {
    filterableFields = ["name", "email", "first_name", "last_name", "createdAt"];
    createUser = async (data) => {
        data.email = data.email.toLowerCase();
        data.username = data.username.toLowerCase();
        const oldUserEmail = await UserModel.findOne({ email: data.email });
        const oldUserUserName = await UserModel.findOne({
            username: data.username,
        });
        if (oldUserEmail) {
            throw { message: "User with this Email Already Exist. Please Login" };
        }
        if (oldUserUserName) {
            throw {
                message: "User with this Username Already Exist. Please Login",
            };
        }
        data.password = this.createPassword(data.password);
        data.active = true;
        return UserModel.create(data);
    };
    createJWTToken = (data) => {
        let date = new Date();
        if (data.lastLogin) {
            date = new Date(data.lastLogin);
        }
        const epochTimeInMilliseconds = date.getTime();
        const epochTimeInSeconds = Math.floor(epochTimeInMilliseconds / 1000);
        return jwt.sign({ user_id: data._id, email: data.email, lastLogin: epochTimeInSeconds }, env.TOKEN_KEY, {
            expiresIn: "24h",
        });
    };
    loginUser = async (data) => {
        let user = undefined;
        if (data.identifier) {
            data.identifier = data.identifier.toLowerCase();
            user = await UserModel.findOne({ email: data.identifier });
        }
        if (!user) {
            user = await UserModel.findOne({ username: data.identifier });
        }
        if (!user) {
            throw {
                message: "User not found, make sure Email or Username is correct",
            };
        }
        else {
            const checkValid = this.checkPassword(data.password, user.password);
            if (checkValid) {
                user.lastLogin = new Date().getTime();
                await user.save();
                user.jwtToken = this.createJWTToken(user);
            }
            else {
                throw {
                    message: "User not valid, make sure Email or Username and Password is correct",
                };
            }
        }
        return user;
    };
    createPassword = (password) => {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(password, salt);
    };
    checkPassword = (password, hash) => {
        return bcrypt.compareSync(password, hash);
    };
    getById = (id) => {
        return UserModel.findById(id);
    };
    findById = async (id) => {
        return UserModel.findById(id);
    };
    findByEmail = async (email) => {
        return UserModel.findOne({ email: email });
    };
    findAndUpdatePassword = async (id, password) => {
        password = this.createPassword(password);
        return UserModel.findByIdAndUpdate(id, { password: password }, { new: true, runValidators: true });
    };
    findAndUpdateUserData = async (id, data) => {
        if (data.password) {
            delete data.password;
        }
        if (data.email) {
            data.email = data.email.toLowerCase();
            const oldUserEmail = await UserModel.findOne({ email: data.email });
            if (oldUserEmail && !oldUserEmail._id.equals(id)) {
                throw { message: "User with this Email Already Exist. Please Login" };
            }
        }
        if (data.username) {
            const oldUserUserName = await UserModel.findOne({
                username: data.username,
            });
            if (oldUserUserName && !oldUserUserName._id.equals(id)) {
                throw {
                    message: "User with this Username Already Exist. Please Login",
                };
            }
        }
        return UserModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    };
    findAndDelete = (id) => {
        return UserModel.findByIdAndDelete(id);
    };
    sortData = (query, key = "createdAt") => {
        return query.sort(key);
    };
    limitFields = (query, fields = this.filterableFields) => {
        return query.select(fields);
    };
    paginateData(query, page, limit) {
        const skip = (page - 1) * limit;
        return query.skip(skip).limit(limit);
    }
}