const CreateError = require('http-errors');
const debug = require('debug')('app:module-alquiler-controller');
const { Response } = require('../common/response');
const { AlquilerService } = require('./service');
const { AlquilerUtils } = require('./utils')

module.exports.AlquilerController = {
    getAlquileres: async(req, res) => {
        try {
            let alquileres = await AlquilerService.getAll();
            Response.success(res, 200, 'Lista de alquileres', alquileres);
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    },
    getAlquiler: async(req, res) => {
        try {
            const { params: { id } } = req;
            let alquiler = await AlquilerService.getById(id);
            if (!alquiler) {
                Response.error(res, new CreateError.NotFound());
            } else {
                Response.success(res, 200, `Alquiler ${id}`, alquiler);
            }
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    },
    create: async(req, res) => {
        try {
            const { body } = req;
            if (!body || Object.keys(body).length === 0) {
                Response.error(res, new CreateError.BadRequest());
            } else {
                let days = AlquilerUtils.daysCalculate(body.fechaAlquiler, body.fechaEntrega);
                let importe = AlquilerUtils.importeCalculate(body.maquinaria, days);
                let descuento = AlquilerUtils.descuentoCalculate(importe, days);
                let garantia = AlquilerUtils.garantiaCalculate(importe);
                let total = AlquilerUtils.totalCalculate(importe, descuento);
                let newAlquiler = {
                    ...body,
                    days,
                    importe,
                    descuento,
                    garantia,
                    total
                }
                const insertedId = await AlquilerService.create(newAlquiler);
                Response.success(res, 201, 'Alquiler creado', newAlquiler);
            }
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    },
    update: async(req, res) => {
        try {
            let { params: { id }, body } = req;
            let days = AlquilerUtils.daysCalculate(body.fechaEntrega, body.fechaDevolucionReal);
            let importeExtra = AlquilerUtils.importeCalculate(body.maquinaria, days);
            let multa = 0;
            debug(importeExtra);
            if (days > 0) {
                multa = AlquilerUtils.multaCalculate(importeExtra);
            }
            let newTotal = AlquilerUtils.totalCalculate(body.total, 0, multa);
            delete body.total;
            let updateAlquiler = {
                ...body,
                multa,
                total: newTotal
            }

            let updateId = await AlquilerService.update(id, updateAlquiler);
            Response.success(res, 201, 'Alquiler actualizado', updateAlquiler);
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    }
}