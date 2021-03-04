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
    console.log('req.body.datosPrincipales', req.body.datosPrincipales)
    const multimediaToUpload = [...req.body.multimedia]
      .filter((m) => m.isBase64);
    const multimediaPromises = await Promise.all(
      [...multimediaToUpload]
        .map(async (multi) => imagesUtilities.uploadBase64ToS3(multi.imgBase64)),
    );
    const multimediaUploaded = multimediaPromises.map((m) => ({
      urlMultimedia       : m.url,
      extensionMultimedia : m.extension,
    }));

    const {
      success, error, message, inmueble,
    } = await inmuebleService.createInmueble({
      datosPrincipales : req.body.datosPrincipales,
      caracteristicas  : req.body.caracteristicas,
      registerUser     : req.user._id,
      multimedia       : multimediaUploaded,
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

exports.updateInmueble = async (req, res, next) => {
  try {
    const {
      datosPrincipales,
      caracteristicas,
      inmuebleID,
      multimedia: multimediaRaw,
    } = req.body;
    const { _id: registerUser } = req.user;

    const multimediaToUpload = [...multimediaRaw]
      .filter((m) => m.isBase64);
    const multimediaToDelete = [...multimediaRaw]
      .filter((m) => m.isDeleted)
      .map((m) => ({
        Key: m.imgUrl.split('/').slice(-1).pop(),
      }));
    const multimediaAlreadyUploaded = [...multimediaRaw]
      .filter((m) => !m.isDeleted && !m.isBase64)
      .map((m) => ({
        urlMultimedia       : m.imgUrl,
        extensionMultimedia : m.imgUrl.split('.').slice(-1).pop(),
      }));

    const multimediaPromises = await Promise.all(
      [...multimediaToUpload]
        .map(async (multi) => imagesUtilities.uploadBase64ToS3(multi.imgBase64)),
    );
    console.log('multimediaPromises', multimediaPromises);
    const multimediaUploaded = multimediaPromises.map((m) => ({
      urlMultimedia       : m.url,
      extensionMultimedia : m.extension,
    }));
    console.log('multimediaToDelete', multimediaToDelete);
    if (multimediaToDelete.length > 0) {
      const multimediaDeleted = await awsUtilities.s3DeleteObjectsPromise({
        arrayKeys: multimediaToDelete,
      });
      console.log('multimediaDeleted', multimediaDeleted);
    }

    const multimediaOnCloud = [...multimediaAlreadyUploaded, ...multimediaUploaded];
    console.log('multimediaOnCloud', multimediaOnCloud);

    const {
      success, error, message, inmueble,
    } = await inmuebleService.updateInmueble({
      multimedia : multimediaOnCloud,
      idInmueble : inmuebleID,
      datosPrincipales,
      caracteristicas,
      registerUser,
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

exports.testing = async (req, res, next) => {
  try {
    // const multimediaDeleted = await awsUtilities.s3DeleteObjectPromise({
    //   key: '0b6074a3db3544303451dc49442f624501815685.png',
    // });
    // console.log('multimediaDeleted', multimediaDeleted);
    // const multimediaDeleted = await awsUtilities.s3DeleteObjectsPromise({
    //   arrayKeys: [
    //     { Key: '389602e3dff2e4f0b86f872fc763b67b6f522373.png' },
    //     { Key: '3309ea7881166d257c885e3f04a16ad8ee925806.png' },
    //     { Key: '2945da4b7eedd72fbafefae258e9bc8a66ec1f1d.png' },
    //   ],
    // });
    // console.log('multimediaDeleted', multimediaDeleted);
    return res.status(200).send({
      success: true,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
    });
  }
}