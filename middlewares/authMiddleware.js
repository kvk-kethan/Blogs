const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const Admin = require("../models/Admin");
const Author = require("../models/Author");

const auth = asyncErrorHandler(async (req, res, next) => {
  let token = req.cookies.jwt;
  // console.log(token);
  if (!token) {
    const err = new CustomError(401, "Try logging in,to access");
    return next(err);
  }
  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
  let Models = [User, Admin, Author];
  let users = Models.map(async (Model) => {
    let users = await Model.findById(decodedToken.id);
    return users;
  });
  users = await Promise.all(users);
  let authorizedUser = users.filter((doc) => doc !== null);
  if (!authorizedUser[0]) {
    const err = new CustomError(401, "user no longer exists");
    return next(err);
  }
  // console.log(authorizedUser[0]);
  req.user = authorizedUser[0];
  next();
});

const verifyRole = (role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      const err = new CustomError(400, "you're not authorized");
      return next(err);
    }
    // console.log(req.user.role);
    next();
  };
};
module.exports = { auth, verifyRole };
