import multer = require("multer");
const fs = require("fs")

const multerStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    
    await fs.promises.mkdir('./photo_eganeet/profile_images_student', { recursive: true })
    cb(null, "./photo_eganeet/profile_images_student");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `/rd_ad-${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] != "pdf") {
    cb(null, true);
  } else {
    cb(new Error("Not a PDF File!!"), false);
  }
};

export const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});






