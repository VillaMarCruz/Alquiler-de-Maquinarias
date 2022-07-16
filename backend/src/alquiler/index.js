const express = require('express');
const router = express.Router();

const { AlquilerController } = require('./controller')

module.exports.AlquilerAPI = (app) => {
    router
        .get('/', AlquilerController.getAlquileres)
        .get('/:id', AlquilerController.getAlquiler)
        .post('/', AlquilerController.create)
        .put('/:id', AlquilerController.update);
    app.use('/api/alquiler', router);
}