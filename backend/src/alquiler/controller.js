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
                const days = AlquilerUtils.daysCalculate(body.fechaAlquiler, body.fechaEntrega);
                const importe = AlquilerUtils.importeCalculate(body.maquinaria, days);
                const descuento = AlquilerUtils.descuentoCalculate(importe, days);
                const garantia = AlquilerUtils.garantiaCalculate(importe);
                const total = AlquilerUtils.totalCalculate(importe, descuento);
                const newAlquiler = {
                    ...body,
                    days,
                    importe,
                    descuento,
                    garantia,
                    total
                }
                const insertedId = await AlquilerService.create(newAlquiler);
                Response.success(res, 201, 'Alquiler creado', insertedId);
            }
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    },
    update: async(req, res) => {
        try {
            const { params: { id }, body } = req;

            const days = AlquilerUtils.daysCalculate(body.fechaEntrega, body.fechaDevolucionReal);
            const importeExtra = AlquilerUtils.importeCalculate(body.maquinaria, days);
            const multa = AlquilerUtils.multaCalculate(importeExtra);
            const newTotal = AlquilerUtils.totalCalculate(body.total, 0, multa)
            delete body.total;
            const updateAlquiler = {
                ...body,
                multa,
                total: newTotal
            }

            const insertedId = await AlquilerService.update(id, updateAlquiler);
            Response.success(res, 201, 'Alquiler creado', insertedId);
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    }
}