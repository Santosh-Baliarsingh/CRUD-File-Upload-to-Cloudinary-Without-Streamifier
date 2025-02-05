const express = require("express");
const router = express.Router();
const postController = require("../controller/postController");
const validatePost = require("../middleware/validatePost");

router.get("/posts", validatePost, postController.getAllPosts);
router.post("/posts/add", validatePost, postController.createPost);
router.put("/posts/update/:id", validatePost, postController.updatePost);
router.delete("/posts/delete/:id", postController.deletePost);

module.exports = router;
