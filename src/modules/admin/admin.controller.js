const { config } = require('../../config/index');
const imagesUtilities = require('../../utilities/images');
const qrUtilities = require('../../utilities/qr');
const awsUtilities = require('../../utilities/aws');
const inmuebleService = require('../../services/inmueble');

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

exports.createInmueble = async (req, res, next) => {
  try {
    const multimediaPromises = await Promise.all(
      [...req.body.multimedia]
        .map(async (multi) => imagesUtilities.uploadBase64ToS3(multi.imgBase64)),
    );
    const multimedia = multimediaPromises.map((m) => ({
      urlMultimedia       : m.url,
      extensionMultimedia : m.extension,
    }));

    const {
      success, error, message, inmueble,
    } = await inmuebleService.createInmueble({
      datosPrincipales : req.body.datosPrincipales,
      caracteristicas  : req.body.caracteristicas,
      registerUser     : req.user._id,
      multimedia,
    });

    if (error) {
      throw new Error(message);
    }

    return res.status(200).send({
      success,
      inmueble,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getInmuebles = async (req, res, next) => {
  try {
    const {
      success, inmuebles, error, message,
    } = await inmuebleService.readInmuebles();
    if (error) {
      throw new Error(message);
    }

    return res.status(200).send({
      success,
      inmuebles,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getInmueble = async (req, res, next) => {
  try {
    const { _id } = req.query;
    const {
      success, inmuebles, error, message,
    } = await inmuebleService.readInmueble(_id);
    if (error) {
      throw new Error(message);
    }

    return res.status(200).send({
      success,
      inmueble: inmuebles[0],
    });
  } catch (error) {
    return next(error);
  }
};