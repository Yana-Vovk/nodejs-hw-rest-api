const multer = require('multer');
const path = require('path');
require('dotenv').config();
const UPLOAD_DIR = path.join(process.cwd(), process.env.UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now().toString()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true);
      return;
    }

    if (!file.mimetype.includes('image')) {
      cb(null, false);
    }
    const error = new Error('Wrong face-format');
    error.status = 400;
    cb(error);
  },
});

module.exports = upload;
