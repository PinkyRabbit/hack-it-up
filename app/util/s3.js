const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const { extname } = require('path');

const bucketName = process.env.AWS_S3_BUCKET;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET,
  },
});

/**
 * Method to upload image to S3 bucket.
 * @param {*} newFile - file object from multer
 * @param {*} oldImage - old image name
 */
async function uploadImageToBucket(newFile, oldImage = null) {
  const fileName = `${Date.now()}${extname(newFile.originalname)}`;
  try {
    const putObject = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: newFile.buffer,
      ACL: 'public-read',
    });
    await s3.send(putObject);

    if (oldImage) {
      const deleteObjectParams = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: oldImage,
      });
      await s3.send(deleteObjectParams);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Error', err);
  }

  return fileName;
}

module.exports = { uploadImageToBucket };
