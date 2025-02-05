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

## File Upload and Temporary Files

The `express-fileupload` middleware is used to handle file uploads in this application. When a file is uploaded, `express-fileupload` temporarily stores the file in memory or on disk. By default, it creates a `tmp` folder in the root directory of the project to store these temporary files. This folder is used to hold the uploaded files before they are processed and uploaded to Cloudinary.

### How it works:
1. A file is uploaded via a POST request.
2. `express-fileupload` stores the file in the `tmp` folder when `{ useTempFiles: true }` is set.
3. The file is then processed (e.g., uploaded to Cloudinary).
4. After processing, the temporary file can be deleted.

**Note:** The `tmp` folder will accumulate files over time as new images are uploaded. It is important to periodically clean up this folder to prevent it from consuming too much disk space. You may need to manually delete the `tmp` folder if it is no longer needed.

## License

This project is licensed under the MIT License.
