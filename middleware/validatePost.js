const { body} = require('express-validator');

const validatePost = [
  body('title').notEmpty().withMessage('Title is required.'),
  body('content').notEmpty().withMessage('Content is required.'),
  body('imageUri').custom((value, { req }) => {
    if (!req.files || !req.files.imageUri) {
      throw new Error('Main image is required.');
    }
    return true;
  }),
  body('thumbnails').custom((value, { req }) => {
    if (!req.files || !req.files.thumbnails) {
      throw new Error('At least one thumbnail is required.');
    }
    const thumbnails = Array.isArray(req.files.thumbnails) ? req.files.thumbnails : [req.files.thumbnails];
    if (thumbnails.length < 1 || thumbnails.length > 4) {
      throw new Error('Not more than 4 images for thumbnails allowed.');
    }
    return true;
  }),
];

module.exports = validatePost;