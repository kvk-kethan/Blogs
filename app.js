const express = require("express");
const authRouter = require("./routes/userRoutes");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const adminRouter = require("./routes/adminRoutes");
const authorRouter = require("./routes/authorRoutes");
const blogRouter = require("./routes/BlogRoutes");
const CustomError = require("./utils/CustomError");
const globalErrorControllers = require("./controllers/globalErrorControllers");
const app = express();
//register template engine
app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "session",
    keys: ["your-secret-key"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success")[0];
  res.locals.error = req.flash("error")[0];
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cookieParser());
app.get("/app/v1/welcome", (req, res) => {
  res.render("welcome");
});

app.use("/app/v1/user", authRouter);
app.use("/app/v1/admin", adminRouter);
app.use("/app/v1/author", authorRouter);
app.use("/app/v1/blogs", blogRouter);

app.all("*", (req, res, next) => {
  let err = new CustomError(404, "page not found");
  next(err);
});



//global error handler
app.use(globalErrorControllers);
module.exports = app;
