const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUri: {
      type: String,
      required: false,
    },
    imagePublicId: {
      type: String,
      required: false,
    },
    thumbnails: {
      type: [String],
      required: false,
    },
    thumbnailPublicIds: {
      type: [String],
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);