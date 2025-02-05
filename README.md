# CRUD with Image Upload Using `Cloudinary` and `express-fileupload`

This is a simple CRUD application where you can create, read, update, and delete posts with image uploads to `Cloudinary`. The project uses `express-fileupload` for handling file uploads, which creates a `tmp` folder for temporary files.

## Features

- Create a new post with an image and thumbnails
- Retrieve all posts
- Update an existing post with a new image and thumbnails
- Delete a post along with its images from Cloudinary

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Cloudinary for image storage
- express-fileupload for handling file uploads
- express-validator for request validation

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Santosh-Baliarsingh/CRUD-File-Upload-to-Cloudinary-Without-Streamifier.git
    cd CRUD-File-Upload-to-Cloudinary-Without-Streamifier
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your MongoDB URI and Cloudinary credentials:
    ```env
    MONGODB_URI=your_mongodb_uri
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

4. Start the application:
    ```sh
    npm start
    ```

## API Endpoints

- `GET /posts` - Retrieve all posts
- `POST /posts/add` - Create a new post
- `PUT /posts/update/:id` - Update an existing post
- `DELETE /posts/delete/:id` - Delete a post

## Middleware

- `validatePost` - Validates the request body for creating and updating posts

## Temporary Files

The `express-fileupload` middleware creates a `tmp` folder for temporary files during the upload process.

## License

This project is licensed under the MIT License.
