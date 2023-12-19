const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("./asyncErrorHandler");
const CustomError = require("./CustomError");

const genToken = async (id) => {
  return await jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 24 * 60 * 60,
  });
};
const signupWrapper = (Model) => {
  return asyncErrorHandler(async (req, res, next) => {
    const newUser = await Model.create(req.body);
    const token = await genToken(newUser._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(303).redirect(`/app/v1/blogs/dashboard`);
  });
};

const loginWrapper = (Model) => {
  return asyncErrorHandler(async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
      let err = new CustomError(400, "please enter credentials");
      return next(err);
    }
    const existingUser = await Model.findOne({ email: req.body.email });
    if (
      !existingUser ||
      !(await existingUser.comparePassword(
        req.body.password,
        existingUser.password
      ))
    ) {
      const err = new CustomError(
        400,
        `${existingUser.role} name and password incorrect`
      );
      return next(err);
    }
    const token = await genToken(existingUser._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // console.log(existingUser.role);
    res.status(303).redirect("/app/v1/blogs/dashboard");
  });
};

module.exports = {
  signupWrapper,
  loginWrapper,
};