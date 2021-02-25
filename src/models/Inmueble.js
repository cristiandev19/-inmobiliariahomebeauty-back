const { Schema, model } = require('mongoose');

const CaracteristicasSchema = new Schema({
  servicios       : [Number],
  caracteristicas : [Number],
  exteriores      : [Number],
  areasComunes    : [Number],
});

const MultimediaSchema = new Schema({
  urlMultimedia  : { type: String, unique: true },
  tipoMultimedia : String,
});
const DatosPrincipalesSchema = new Schema({
  titulo             : { type: String },
  descripcion        : { type: String },
  tipo_inmueble      : { type: Number },
  antiguedad         : { type: String },
  dormitorios        : { type: Number },
  estacionamientos   : { type: Number },
  bathrooms          : { type: Number },
  precio_soles       : { type: Number },
  precio_dolares     : { type: Number },
  metros_construidos : { type: Number },
  metros_totales     : { type: Number },
  direccion          : { type: String },
  codigo_postal      : { type: String },
  latitud            : { type: Number },
  longitud           : { type: Number },
});

const inmuebleSchema = new Schema({
  datosPrincipales : DatosPrincipalesSchema,
  caracteristicas  : CaracteristicasSchema,
  multimedia       : [MultimediaSchema],
}, { timestamps: true });

const inmueble = model('Inmueble', inmuebleSchema);

module.exports = inmueble;
