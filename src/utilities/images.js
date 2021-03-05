const crypto = require('crypto');
const awsUtilities = require('./aws');

const convertBase64ToBuffer = (base64) => new Promise((resolve) => {
  try {
    /// Proceso para pasar un base64 a un buffer
    const base64Replaced = base64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Replaced, 'base64');
    const type = base64.split(';')[0].split('/')[1];
    return resolve({
      buffer,
      type,
      contentType: `image/${type}`,
    });
  } catch (error) {
    return resolve({ error });
  }
});
exports.convertBase64ToBuffer = convertBase64ToBuffer;

// eslint-disable-next-line no-async-promise-executor
exports.uploadBase64ToS3 = (imgBase64, fileName = '', folderPath = '') => new Promise(async (resolve) => {
  const bufferObjectImg = await convertBase64ToBuffer(imgBase64);
  // 'imgBase64', 'imgUrl', 'isBase64'
  const randomString = crypto.randomBytes(20).toString('hex');
  const fileNameFormated = fileName ? `${fileName}_${randomString}` : randomString;
  const uploadParams = {
    bufferBody  : bufferObjectImg.buffer,
    contentType : bufferObjectImg.contentType,
    extension   : bufferObjectImg.type,
    fileName    : fileNameFormated,
    folderPath  : folderPath ? `${folderPath}/` : '',
  };
  const responseS3 = await awsUtilities.s3UploadPromise(uploadParams);
  return resolve({
    url       : responseS3.Location,
    fileName  : responseS3.key,
    bucket    : responseS3.Bucket,
    extension : bufferObjectImg.type,
  });
});
