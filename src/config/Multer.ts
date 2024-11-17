import multer = require("multer");
import { UPLOAD_PATH } from "../constants/constant";
const fs = require("fs");

const multerStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.promises.mkdir('.'+UPLOAD_PATH, { recursive: true });
    req.body.fileMimeType = file.mimetype;
    req.body.fileName = file.originalname;
    req.body.filePath = `${UPLOAD_PATH}${file.originalname}`;
    req.body.fileSize = file.size;
    req.body.fileType = file.mimetype.split("/")[0];
    req.body.fileExtension = file.mimetype.split("/")[1];
    req.body.fileOriginalName = file.originalname;
    req.body.fileDestination = `${UPLOAD_PATH}`;
    req.body.fileField = file.fieldname;

    req.files = [file];
    cb(null, `.${UPLOAD_PATH}`);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const newFileName = `psm-${file.fieldname}-${Date.now()}.${ext}`;
    req.body.newFileName = newFileName;
    cb(null, `.${newFileName}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] !== "exe") {
    cb(null, true);
  } else {
    cb(new Error("Not an executable file!"), false);
  }
};

export const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});


