const { json, urlencoded } = require("body-parser");
const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();

const db = require("./config/mongoose-conection");
const ownersRouter = require("./routes/ownersRouter");
const usersRouter = require("./routes/usersRouter");
const productsRouter = require("./routes/productsRouter");
const indexRouter = require("./routes/indexRouter");
const expressSession = require("express-session");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
}));
app.use(flash());

app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/", indexRouter);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
