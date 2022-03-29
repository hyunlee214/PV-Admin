require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const cors = require("cors");
const { sequelize } = require("./models");

const adminAPI = require("./routes/admin");
const mainAPI = require("./routes/main");

const app = express();
sequelize.sync();

app.use(cors({ origin: true, credentials: true } ));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/upload", express.static(path.join(__dirname, "upload")));


app.use(
  session({
    secret: process.env.COOKIE,
    key: "sid",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24000 * 60 * 60,
    },
  })
);

app.use("/api/admin", adminAPI);
app.use("/api/main", mainAPI);

// error handler
app.use(
  (err, req, res) => res.status(200).json({ message: "에러" })
  // next(createError(404));
);

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500).send("error");
});

module.exports = app;
