const Post = require("../model/postModel");
const cloudinary = require("../config/CloudinaryConfig");
const { validationResult } = require("express-validator");

// Get All Posts
exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().lean();

    if (posts.length === 0) {
      return res.status(400).json({
        status: "failed",
        code: 400,
        message: "No posts found",
        data: [],
      });
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Posts retrieved successfully",
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      code: 500,
      message: error.message || "An error occurred while retrieving posts",
      errors: error.array(),
    });
  }
};

// Create a New Post
exports.createPost = async (req, res , next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({
      status: "failed",
      code: 400,
      message: error.array().map((err) => err.msg),
      errors: error.array(),
    });
  }
  try {
    const { title, content } = req.body;
    const { imageUri, thumbnails } = req.files;

    // Upload main image to Cloudinary in the 'posts' folder with transformations
    const imageResult = await cloudinary.uploader.upload(
      imageUri.tempFilePath,
      {
        folder: "posts",
        transformation: [
          { width: 1000, crop: "scale" },
          { quality: "auto:best" },
          { fetch_format: "auto" },
        ],
      }
    );

    // Upload thumbnails to Cloudinary in the 'posts' folder with transformations
    const thumbnailPromises = Array.isArray(thumbnails)
      ? thumbnails.map((file) =>
          cloudinary.uploader.upload(file.tempFilePath, {
            folder: "posts",
            transformation: [
              { width: 1000, crop: "scale" },
              { quality: "auto:best" },
              { fetch_format: "auto" },
            ],
          })
        )
      : [
          cloudinary.uploader.upload(thumbnails.tempFilePath, {
            folder: "posts",
            transformation: [
              { width: 1000, crop: "scale" },
              { quality: "auto:best" },
              { fetch_format: "auto" },
            ],
          }),
        ];

    const thumbnailResults = await Promise.all(thumbnailPromises);

    // Save to MongoDB
    const newPost = new Post({
      title,
      content,
      imageUri: imageResult.secure_url,
      imagePublicId: imageResult.public_id,
      thumbnails: thumbnailResults.map((result) => result.secure_url),
      thumbnailPublicIds: thumbnailResults.map((result) => result.public_id),
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Post By ID
exports.updatePost = async (req, res , next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const { imageUri, thumbnails } = req.files || {};

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Update title and content
    if (title) post.title = title;
    if (content) post.content = content;

    // Update main image if provided
    if (imageUri) {
      // Delete old image from Cloudinary
      if (post.imagePublicId) {
        await cloudinary.uploader.destroy(post.imagePublicId);
      }

      // Upload new image to Cloudinary
      const imageResult = await cloudinary.uploader.upload(
        imageUri.tempFilePath,
        {
          folder: "posts",
          transformation: [
            { width: 1000, crop: "scale" },
            { quality: "auto:best" },
            { fetch_format: "auto" },
          ],
        }
      );
      post.imageUri = imageResult.secure_url;
      post.imagePublicId = imageResult.public_id;
    }

    // Update thumbnails if provided
    if (thumbnails) {
      // Delete old thumbnails from Cloudinary
      if (post.thumbnailPublicIds && post.thumbnailPublicIds.length > 0) {
        const deletePromises = post.thumbnailPublicIds.map((publicId) =>
          cloudinary.uploader.destroy(publicId)
        );
        await Promise.all(deletePromises);
      }

      // Upload new thumbnails to Cloudinary
      const thumbnailPromises = Array.isArray(thumbnails)
        ? thumbnails.map((file) =>
            cloudinary.uploader.upload(file.tempFilePath, {
              folder: "posts",
              transformation: [
                { width: 1000, crop: "scale" },
                { quality: "auto:best" },
                { fetch_format: "auto" },
              ],
            })
          )
        : [
            cloudinary.uploader.upload(thumbnails.tempFilePath, {
              folder: "posts",
              transformation: [
                { width: 1000, crop: "scale" },
                { quality: "auto:best" },
                { fetch_format: "auto" },
              ],
            }),
          ];

      const thumbnailResults = await Promise.all(thumbnailPromises);
      post.thumbnails = thumbnailResults.map((result) => result.secure_url);
      post.thumbnailPublicIds = thumbnailResults.map(
        (result) => result.public_id
      );
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Post By ID
exports.deletePost = async (req, res , next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Delete main image from Cloudinary
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }

    // Delete thumbnails from Cloudinary
    if (post.thumbnailPublicIds && post.thumbnailPublicIds.length > 0) {
      const deletePromises = post.thumbnailPublicIds.map((publicId) =>
        cloudinary.uploader.destroy(publicId)
      );
      await Promise.all(deletePromises);
    }

    // Delete post from MongoDB
    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
