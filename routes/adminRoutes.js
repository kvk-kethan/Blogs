const { signup, login, getSignup, getLogin, logout } = require("../controllers/adminControllers");

const router = require("express").Router();

router.get("/signup",getSignup)
router.post("/signup", signup);
router.post("/login", login);
router.get("/login", getLogin);
router.get("/logout", logout);

module.exports = router;
