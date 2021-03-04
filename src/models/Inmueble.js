const { Schema, model, ObjectId } = require('mongoose');

const CaracteristicasSchema = new Schema({
  servicios       : [Number],
  caracteristicas : [Number],
  exteriores      : [Number],
  areasComunes    : [Number],
});

const MultimediaSchema = new Schema({
  urlMultimedia       : { type: String, unique: true, required: true },
  extensionMultimedia : { type: String, required: true },
});
const DatosPrincipalesSchema = new Schema({
  titulo             : { type: String, required: true },
  descripcion        : { type: String, required: true },
  tipo_inmueble      : { type: Number, required: true },
  antiguedad         : { type: String, required: true },
  dormitorios        : { type: Number, required: true },
  estacionamientos   : { type: Number, required: true },
  bathrooms          : { type: Number, required: true },
  precio_soles       : { type: Number, required: true },
  precio_dolares     : { type: Number, required: true },
  tipo_anuncio       : { type: Number, required: true },
  metros_construidos : { type: Number, required: true },
  metros_totales     : { type: Number, required: true },
  direccion          : { type: String, required: true },
  codigo_postal      : { type: String, required: true },
  latitud            : { type: Number, required: true },
  longitud           : { type: Number, required: true },
});

const inmuebleSchema = new Schema({
  datosPrincipales : DatosPrincipalesSchema,
  caracteristicas  : CaracteristicasSchema,
  multimedia       : [MultimediaSchema],
  registerUser     : { type: ObjectId, required: true },
}, { timestamps: true });

const Inmueble         = model('Inmueble', inmuebleSchema);
const Caracteristicas  = model('Caracteristicas', CaracteristicasSchema);
const Multimedia       = model('Multimedia', MultimediaSchema);
const DatosPrincipales = model('DatosPrincipales', DatosPrincipalesSchema);

exports.Caracteristicas = Caracteristicas;
exports.Multimedia = Multimedia;
exports.DatosPrincipales = DatosPrincipales;
exports.Inmueble = Inmueble;
