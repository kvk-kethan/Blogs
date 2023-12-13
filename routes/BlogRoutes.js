const router = require("express").Router();
const {
  postBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  postRating,
  getRatings,
  dashboard,
} = require("../controllers/blogControllers");
const { auth, verifyRole } = require("../middlewares/authMiddleware");

router.get(
  "/dashboard",
  auth,
  verifyRole(["user", "admin", "author"]),
  dashboard
);
router.post("/", auth, verifyRole(["author"]), postBlog);
router.get("/", auth, getBlogs);
router.get("/:id", auth, getBlog);
router.patch("/:id", auth, verifyRole(["author"]), updateBlog);
router.post("/ratings/:id", auth, verifyRole(["user"]), postRating);
router.get(
  "/ratings/:id",
  auth,
  verifyRole(["user", "author", "admin"]),
  getRatings
);
router.delete("/:id", auth, verifyRole(["admin", "author"]), deleteBlog);

module.exports = router;
