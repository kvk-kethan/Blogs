const { loginWrapper, signupWrapper } = require("../utils/auth");
const Author = require("../models/Author");

const login = loginWrapper(Author);
const signup = signupWrapper(Author);
const getSignup = (req, res) => {
  res.render("Author/authorSignup");
};
const getLogin = (req, res) => {
  res.render("Author/authorLogin");
};

const logout = (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/app/v1/author/login");
};
module.exports = {
  login,
  signup,
  getSignup,
  getLogin,
  logout
};
