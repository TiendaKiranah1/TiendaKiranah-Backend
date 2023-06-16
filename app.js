const express = require("express");
const cookieSession = require("cookie-session");
const passport = require("passport");
const dotenv = require("dotenv");
const morgan = require("morgan");

/**Imported Error Handler */
const errorController = require("./controllers/errorController/errorController");

/** Imported route files */
const googleAuth = require("./util/socials/googleAuth");
const authRoute = require("./routes/authRoute");
const googleRoute = require("./routes/googleRoute");
const facebookRoute = require("./routes/facebookRoute");
const profileRoute = require("./routes/profileRoute");

/** Imported .evn file */
dotenv.config({ path: "./config.env" });

/** imported Error Handling file */
const CustomError = require("./util/customError");

/** Instantiating express */
const app = express();

app.use(morgan("dev"));
// app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_SECRET]
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Methods", "*");

  next();
});

/** All routes */
app.use("/profile", profileRoute);
app.use("/api/v1/users", facebookRoute);
app.use("/api/v1/users", googleRoute);
app.use("/api/v1/auth/users", authRoute);

/** Domain Route */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello Souvik"
  });
});

/* Handling unknown route */
app.all("*", (req, res, next) => {
  next(new CustomError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(errorController);

module.exports = app;
