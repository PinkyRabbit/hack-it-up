const multer = require('multer');
const { promisify } = require('util');

const multerMemoryStorage = multer.memoryStorage();

async function uploadArticleImage(req, res, next) {
  const upload = multer({ storage: multerMemoryStorage }).single('image-file');
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
