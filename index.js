const express          = require('express');

const app              = express();
const cors             = require('cors');
const bodyParser       = require('body-parser');

// Passport stuff
const passport     = require('passport');
const jwtStrategy  = require('./src/strategies/jwt');

passport.use(jwtStrategy);

// Extra
const { dbConnection } = require('./src/databases/mongo');
const { config }       = require('./src/config/index');

// Hacemos la conexion a mongodb
dbConnection();

// Importamos los middlewares para manejar los errores
const { logErrors, errorHandler } = require('./src/middlewares/errorHandler');

// Aqui configuraciones
app
  .use(cors({ origin: '*' }))
  .use(bodyParser.urlencoded({ parameterLimit: 100000, limit: '20mb', extended: true }))
  .use(bodyParser.json({ limit: '20mb' }));

// Importamos modulos
const adminRouter = require('./src/modules/admin/admin.router');
const authRouter  = require('./src/modules/auth/auth.router');
const utilityRouter  = require('./src/modules/utility/utility.router');
const generalRouter  = require('./src/modules/general/general.router');

// Establecemos las rutas
app
  .use('/admin', adminRouter)
  .use('/general', generalRouter)
  .use('/utility', utilityRouter)
  .use('/auth', authRouter);

// Middleware para manejo de errores
app
  .use(logErrors)
  .use(errorHandler);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening at http://localhost:${config.port}`);
});
