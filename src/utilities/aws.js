const AWS = require('aws-sdk');
const { config } = require('../config/index');

exports.s3UploadPromise = async ({
  fileName, extension, bufferBody, contentType,
}) => new Promise((resolve) => {
  // call S3 to retrieve upload file to specified bucket
  const uploadParams = {
    Bucket          : config.awsS3BucketName,
    ACL             : 'public-read', // para poder ser leido publicamente,
    Key             : `${fileName}.${extension}`,
    Body            : bufferBody,
    StorageClass    : 'REDUCED_REDUNDANCY', // para poder ser leido publicamente
    ContentType     : contentType,
    ContentEncoding : 'base64',
  };

  // Set the region
  AWS.config.update({ region: config.awsS3Region });

  const s3 = new AWS.S3();
  // call S3 to retrieve upload file to specified bucket
  // eslint-disable-next-line consistent-return
  s3.upload(uploadParams, (err, data) => {
    if (err) {
      return resolve({ error: err });
    }
    if (data) {
      return resolve({ ...data });
      /** *
      Resultado para generar el QR
      {
        ETag: '"51b3ca5a617effc353e9a8a84ef95d1c"',
        ServerSideEncryption: 'AES256',
        Location: 'https://myqr.s3.us-east-2.amazonaws.com/eeewqewe.png',
        key: 'eeewqewe.png',
        Key: 'eeewqewe.png',
        Bucket: 'myqr'
      }
        */
    }
  });
})