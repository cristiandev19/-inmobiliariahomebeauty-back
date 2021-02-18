const { config } = require('../../config/index');
const imagesUtilities = require('../../utilities/images');
const qrUtilities = require('../../utilities/qr');
const awsUtilities = require('../../utilities/aws');

exports.uploadFile = async (req, res, next) => {
  try {
    const { extension, dataFile, fileName } = req.body;

    const bufferObjectImg = await imagesUtilities.convertBase64ToBuffer({
      fileName,
      extension,
      bufferBody: bufferObjectImg.buffer,
      contentType: bufferObjectImg.contentType
    });

    const uploadedImg = await awsUtilities.s3UploadPromise(uploadParams);
    console.log('uploaded', uploaded);

    // const file = '../q.png';
    const { dataQR } = await qrUtilities.generateQRByUrl(uploadedImg.Location);
    const bufferObjectQR = await imagesUtilities.convertBase64ToBuffer(dataQR);

    const fileNameQR = `qr__${fileName}__`;
    const extensionQR = bufferObjectQR.type;

    const uploaded = await awsUtilities.s3UploadPromise({
      fileName: fileNameQR,
      extension: extensionQR,
      bufferBody: bufferObjectQR.buffer,
      contentType: bufferObjectQR.contentType
    });

    console.log('hola', req.body.extension);
    return res.status(200).send({
      message: 'Funciono'
    })
  } catch (error) {
    next(error);
  }
};

