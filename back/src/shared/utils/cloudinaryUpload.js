import streamifier from "streamifier";

import cloudinary from "../../config/cloudinary.js";

/*
|--------------------------------------------------------------------------
| Detectar tipo de recurso
|--------------------------------------------------------------------------
*/

const detectarResourceType = (originalname = "") => {
  const nombre = originalname.toLowerCase();

  if (nombre.endsWith(".mp4") || nombre.endsWith(".webm")) {
    return "video";
  }

  return "image";
};

/*
|--------------------------------------------------------------------------
| Subir archivo a Cloudinary
|--------------------------------------------------------------------------
*/

export const subirArchivoCloudinary = (file, folder = "urbanlog/reportes") => {
  return new Promise((resolve, reject) => {
    const resource_type = detectarResourceType(file.originalname);

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type,
      },

      (error, result) => {
        if (error) {
          console.log("ERROR CLOUDINARY:");
          console.log(error);

          return reject(error);
        }

        console.log("ARCHIVO SUBIDO:");
        console.log(result.secure_url);

        resolve({
          url: result.secure_url,

          public_id: result.public_id,

          resource_type: result.resource_type,
        });
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};
