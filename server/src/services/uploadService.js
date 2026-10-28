import cloudinary from "../config/cloudinary.js";

export const uploadBuffer = (buffer, folder) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: `huella/${folder}`, resource_type: "auto" },
        (error, result) => (error ? reject(error) : resolve(result)),
      )
      .end(buffer);
  });

export const deleteFile = (publicId, resourceType = "image") =>
  cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
