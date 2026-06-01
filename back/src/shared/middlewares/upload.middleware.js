import multer from "multer";

const storage = multer.memoryStorage();

const extensionesPermitidas = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".mp4",
  ".webm",
];

export const upload = multer({

  storage,

  limits: {
    fileSize: 25 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {

    console.log("============== FILE ==============");
    console.log("ORIGINAL:", file.originalname);
    console.log("MIMETYPE:", file.mimetype);
    console.log("==================================");

    const nombre = file.originalname.toLowerCase();

    const permitido = extensionesPermitidas.some(ext =>
      nombre.endsWith(ext)
    );

    if (!permitido) {
      return cb(
        new Error("Formato de archivo no permitido")
      );
    }

    cb(null, true);
  },
});