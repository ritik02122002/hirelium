import { v2 as cloudinary } from "cloudinary";

export const uploadImage = (stream) => {
  console.log("hii");
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: "uploads" }, // Optional Cloudinary folder
    (error, result) => {
      if (error) {
        throw new Error(error.message);
      }

      return result;
    }
  );

  // Pipe the file's buffer to Cloudinary
  uploadStream.end(stream);
  // // Optimize delivery by resizing and applying auto-format and auto-quality
  // const optimizeUrl = cloudinary.url(uploadResult.public_id, {
  //   fetch_format: "auto",
  //   quality: "auto",
  // });

  // console.log(optimizeUrl);

  // // Transform the image: auto-crop to square aspect_ratio
  // const autoCropUrl = cloudinary.url(uploadResult.public_id, {
  //   crop: "auto",
  //   gravity: "auto",
  //   width: 500,
  //   height: 500,
  // });

  // console.log(autoCropUrl);
};
