const multer = require('multer');
const path = require('path');
const uuid = require('uuid');

const draftsDir = path.join('./tmp');

const storage = multer.diskStorage({
  destination: draftsDir,
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `${uuid.v4()}${extension}`);
  },
});

const uploadMiddleware = multer({ storage });

module.exports = { uploadMiddleware };
