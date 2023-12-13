const { signup, login, getSignup, getLogin, logout } = require("../controllers/authorControllers");

const router = require("express").Router();

router.post("/signup", signup);
router.get("/signup", getSignup);
router.post("/login", login);
router.get("/login", getLogin);
router.get("/logout", logout);

module.exports = router;
