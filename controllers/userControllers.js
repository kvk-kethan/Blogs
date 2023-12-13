const { loginWrapper, signupWrapper } = require("../utils/auth");
const User = require("../models/User");

const login = loginWrapper(User);
const signup = signupWrapper(User);
const getSignup = (req, res) => {
  res.render("User/userSignup");
};
const getLogin = (req, res) => {
  res.render("User/userLogin");
};

const logout = (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/app/v1/user/login");
};

module.exports = {
  login,
  signup,
  getSignup,
  getLogin,
  logout
};
