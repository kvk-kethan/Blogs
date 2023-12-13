const CustomError = require("../utils/CustomError");

const devError = (req, res, err) => {
  req.flash("error", err.message);
  const referringPage = req.header("Referer") || "/app/v1/welcome";
  res.redirect(referringPage);
  // res.status(err.statusCode).json({
  //   status: err.status,
  //   message: err.message,
  //   error: err,
  //   errorStack: err.stack,
  // });
};

const prodError = (req, res, err) => {
  if (err.isOperational === true) {
    req.flash("error", err.message);
    const referringPage = req.header("Referer") || "/app/v1/welcome";
    res.redirect(referringPage);
    // res.locals.error = err.message;
    // res.status(err.statusCode).json({
    //   status: err.status,
    //   message: err.message,
    // });
  } else {
    req.flash("error", "Something went wrong. Please try again later.");
    // res.status(err.statusCode).json({
    //   status: "fail",
    //   message: "something went wrong,Please try again later",
    // });
  }
};

const ValidationErrorHandler = (err) => {
  let errArray = Object.values(err.errors);
  let msgs = errArray.map((doc) => doc.message);
  let msg = msgs.join(" .");
  let error = new CustomError(400, msg);
  return error;
};

const duplicateErrorHandler = (err) => {
  let email = err.keyValue.email;
  let msg = `this email ${email} already exists`;
  let error = new CustomError(400, msg);
  return error;
};
const handleCastError = (err) => {
  let msg = `the value ${err.value} is not a proper ID`;
  const error = new CustomError(400, msg);
  return error;
};
const handleTokenExpiredError = () => {
  let error = new CustomError(403, `Your session expired,Login in once again`);
  return error;
};
const handleTokenError = () => {
  let error = new CustomError(
    403,
    "Something went wrong,Please login once again"
  );
  return error;
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    devError(req, res, err);
  }

  if (process.env.NODE_ENV === "production") {
    if (err.name === "ValidationError") {
      err = ValidationErrorHandler(err);
    }
    if (err.code === 11000) {
      err = duplicateErrorHandler(err);
    }
    if (err.name === "CastError") {
      err = handleCastError(err);
    }
    if (err.name === "TokenExpiredError") {
      err = handleTokenExpiredError(err);
    }
    if (err.name === "JsonWebTokenError") {
      err = handleTokenError();
    }
    prodError(req, res, err);
  }
};
