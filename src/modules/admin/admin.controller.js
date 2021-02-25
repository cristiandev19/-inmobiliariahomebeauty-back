const { config } = require('../../config/index');
const imagesUtilities = require('../../utilities/images');
const qrUtilities = require('../../utilities/qr');
const awsUtilities = require('../../utilities/aws');

exports.uploadFile = async (req, res, next) => {
  try {
    const { extension, dataFile, fileName } = req.body;

    const bufferObjectImg = await imagesUtilities.convertBase64ToBuffer(dataFile);
    const uploadParams = {
      bufferBody  : bufferObjectImg.buffer,
      contentType : bufferObjectImg.contentType,
      fileName,
      extension,
    };
    const uploadedImg = await awsUtilities.s3UploadPromise(uploadParams);
    const { dataQR } = await qrUtilities.generateQRByUrl(uploadedImg.Location);
    const bufferObjectQR = await imagesUtilities.convertBase64ToBuffer(dataQR);

    const fileNameQR = `qr__${fileName}__`;
    const extensionQR = bufferObjectQR.type;

    const uploaded = await awsUtilities.s3UploadPromise({
      fileName    : fileNameQR,
      extension   : extensionQR,
      bufferBody  : bufferObjectQR.buffer,
      contentType : bufferObjectQR.contentType,
    });

    if (!uploaded) {
      throw new Error('No se pudo subir');
    }

    return res.status(200).send({
      message: 'Funciono',
    });
  } catch (error) {
    next(error);
  }
};

exports.createInmueble = (req, res, next) => {
  try {
    console.log('req', Object.keys(req.body));
    console.log('req.multimedia', req.body.multimedia);
    console.log('req.datosPrincipales', req.body.datosPrincipales);
    console.log('req.caracteristicas', req.body.caracteristicas);
    return res.status(200).send({
      hola: 'has',
    });
  } catch (error) {
    return next(error);
  }
};
