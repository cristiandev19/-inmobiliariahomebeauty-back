const AWS = require('aws-sdk');
const { config } = require('../config/index');

exports.s3UploadPromise = async ({
  folderPath = '', fileName, extension, bufferBody, contentType,
}) => new Promise((resolve) => {
  // call S3 to retrieve upload file to specified bucket
  const uploadParams = {
    Bucket          : config.awsS3BucketName,
    ACL             : 'public-read', // para poder ser leido publicamente,
    Key             : `${folderPath}${fileName}.${extension}`,
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
});

exports.s3DeleteObjectPromise = async ({ key }) => new Promise((resolve) => {
  // call S3 to retrieve upload file to specified bucket
  const deleteParams = {
    Bucket : config.awsS3BucketName,
    Key    : key,
  };

  // Set the region
  AWS.config.update({ region: config.awsS3Region });

  const s3 = new AWS.S3();
  // call S3 to retrieve upload file to specified bucket
  // eslint-disable-next-line consistent-return
  s3.deleteObject(deleteParams, (err, data) => {
    if (err) {
      return resolve({ error: err });
    }
    if (data) {
      return resolve({ ...data });
      /**
       * Devuelve un objeto vacio {}
      */
    }
  });
});

exports.s3DeleteObjectsPromise = async ({ arrayKeys }) => new Promise((resolve) => {
  /** arrayKeys model
  [
    {Key: 'a.txt'},
    {Key: 'b.txt'},
    {Key: 'c.txt'}
  ]
  * */
  // call S3 to retrieve upload file to specified bucket
  const deleteParams = {
    Bucket : config.awsS3BucketName,
    Delete : {
      Objects: [...arrayKeys],
    },
  };

  // Set the region
  AWS.config.update({ region: config.awsS3Region });

  const s3 = new AWS.S3();
  // call S3 to retrieve upload file to specified bucket
  // eslint-disable-next-line consistent-return
  s3.deleteObjects(deleteParams, (err, data) => {
    if (err) {
      return resolve({ error: err });
    }
    if (data) {
      return resolve({ ...data });
      /** *
      {
        Deleted: [
          { Key: '389602e3dff2e4f0b86f872fc763b67b6f522373.png' },
          { Key: '2945da4b7eedd72fbafefae258e9bc8a66ec1f1d.png' },
          { Key: '3309ea7881166d257c885e3f04a16ad8ee925806.png' }
        ],
        Errors: []
      }
      */
    }
  });
});
