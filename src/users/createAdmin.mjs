import readline from "readline";
import { UserService } from "@users/models";
import * as console from "console";
import mongoose from "mongoose";
import env from "@lib/env";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
let userDetails = {};
function promptUser(question, property, validationFn) {
    return new Promise((resolve) => {
        const prompt = () => {
            rl.question(question, (answer) => {
                if (validationFn) {
                    if (validationFn(answer.trim())) {
                        userDetails[property] = answer.trim();
                        resolve();
                    }
                    else {
                        console.log("Invalid input. Please enter a valid value.");
                        prompt();
                    }
                }
                else {
                    userDetails[property] = answer.trim();
                    resolve();
                }
            });
        };
        prompt();
    });
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function isValidPassword(password) {
    const passwordRegex = /^[a-zA-Z0-9]{8,16}$/;
    return passwordRegex.test(password);
}
async function gatherUserDetails() {
    await promptUser("Enter username: ", "username");
    await promptUser("Enter email: ", "email", isValidEmail);
    await promptUser("Enter password: ", "password", isValidPassword);
    await promptUser("Enter first name (press enter to skip): ", "firstName");
    await promptUser("Enter last name (press enter to skip): ", "lastName");
    rl.close();
}
mongoose
    .connect(env.DB_URL_LOCAL)
    .then(() => {
    gatherUserDetails()
        .then(() => {
        userDetails["admin"] = true;
        userDetails["active"] = true;
        const userService = new UserService();
        userService
            .createUser(userDetails)
            .then((r) => {
            console.log("Admin Created successfully");
            console.log(JSON.stringify(r));
            rl.close();
        })
            .catch((err) => {
            console.error(err);
            rl.close();
        });
    })
        .catch((err) => {
        console.error("Error:", err);
        rl.close();
    });
})
    .catch((err) => {
    console.log(err);
    rl.close();
});