import jwt from "jsonwebtoken";
const userService = new UserService();
import env from "../lib/env.mjs";
import {UserService} from "../src/users/models.mjs";
function convertKeysToCamelCase(obj) {
    const newObj = {};
    for (let key in obj) {
        if (Object.keys(obj).includes(key)) {
            const camelCaseKey = key.replace(/[-_]+(.)?/g, (match, chr) => {
                console.log(match, "match>>>>>");
                return chr ? chr.toUpperCase() : "";
            });
            newObj[camelCaseKey] = obj[key];
        }
    }
    return newObj;
}
export const camelCaseParser = (request, response, next) => {
    if (request.body) {
        request.body = convertKeysToCamelCase(request.body);
    }
    if (response.statusCode) {
        console.log("response");
    }
    next();
};
const verifyLastLogin = async (userId, lastLogin) => {
    const user = await userService.findById(userId);
    if (user && user.lastLogin) {
        const date = new Date(user.lastLogin);
        const epochTimeInMilliseconds = date.getTime();
        const epochTimeInSeconds = Math.floor(epochTimeInMilliseconds / 1000);
        return epochTimeInSeconds === lastLogin;
    }
    else {
        return false;
    }
};
export const jwtDecoder = async (request, response, next) => {
    let token = request.body.token || request.query.token || request.headers.authorization;
    if (!token || !token.startsWith("JWT")) {
        return response.status(403).json({ message: "Login for authentication" });
    }
    try {
        token = token.replace("JWT ", "");
        const decoded = jwt.verify(token, env.TOKEN_KEY);
        if (!(await verifyLastLogin(decoded.user_id, decoded.lastLogin))) {
            return response.status(401).json({ message: "Login for authentication" });
        }
        request.user = await userService.findById(decoded.user_id);
    }
    catch (err) {
        return response.status(401).json({ message: "Login for authentication" });
    }
    next();
};