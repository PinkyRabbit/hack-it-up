const multer = require('multer');
const path = require('path');
const { promisify } = require('util');

/**
 * Settings for article image uploading.
 */
const articleImageFolderPath = path.join(__dirname, '../../public/images/a');
const imageLocalStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, articleImageFolderPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

async function uploadArticleImage(req, res, next) {
  const upload = multer({ storage: imageLocalStorage }).single('image-file');
  const uploadInPromise = promisify(upload);
  try {
    await uploadInPromise(req, res);
  } catch (error) {
    return next(error);
  }
  return next();
}

module.exports = {
  uploadArticleImage,
};
