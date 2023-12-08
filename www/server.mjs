import mongoose from "mongoose";
import { app } from "./app.mjs";
import env from "../lib/env.mjs";

mongoose
    .connect(env.DB_URL_LOCAL)
    .then(() => {
    console.log("connected");
})
    .catch((err) => {
    console.log(err);
});
app.listen(env.PORT || 3000, "0.0.0.0", () => {
    console.log("App running on port 3000");
});
