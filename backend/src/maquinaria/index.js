const express = require('express');

const router = express.Router();

const { MaquinariaController } = require('./controller')

module.exports.MaquinariaAPI = (app) => {
    router
        .get('/', MaquinariaController.getMaquinarias)
        .get('/:id', MaquinariaController.getMaquinaria)
        .post('/', MaquinariaController.createMaquinaria);
    app.use('/api/maquinaria', router);
};