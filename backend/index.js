const express = require('express');
const debug = require('debug')('app:main');
const cors = require('cors');

const { Config } = require('./src/config/index')
const { MaquinariaAPI } = require('./src/maquinaria/index');
const { AlquilerAPI } = require('./src/alquiler/index')

const app = express();

app.use(express.json());
app.use(cors());
// Modulos
MaquinariaAPI(app);
AlquilerAPI(app);
app.listen(Config.port, () => {
    debug(`Servidor ejecutandose en el puerto ${Config.port}`)
});