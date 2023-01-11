const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync('public/images')) {
      if (!fs.existsSync('public')) fs.mkdirSync('public');
      fs.mkdirSync('public/images');
      cb(null, 'public/images');
    } else {
      cb(null, 'public/images');
    }
  },
  filename: function (req, file, cb) {
    console.log('upload file', file);
    cb(null, file.originalname.replace(/\s/g, ''));
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only jpg, jpeg and png image files are allowed.'
      )
    );
  }
};

const uploadLogo = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

module.exports = uploadLogo;
