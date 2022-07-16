const CreateError = require('http-errors');
const debug = require('debug')('app:module-maquinaria-controller');
const { Response } = require('../common/response');

const { MaquinariaService } = require('./service')

module.exports.MaquinariaController = {
    getMaquinarias: async(req, res) => {
        try {
            let maquinarias = await MaquinariaService.getAll();
            Response.success(res, 200, 'Lista de maquinarias', maquinarias);
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    },
    getMaquinaria: async(req, res) => {
        try {
            const { params: { id } } = req;
            let maquinaria = await MaquinariaService.getById(id);
            if (!maquinaria) {
                Response.error(res, new CreateError.NotFound);
            } else {
                Response.success(res, 200, `Maquinaria ${id}`, maquinaria)
            }
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    },
    createMaquinaria: async(req, res) => {
        try {
            const { body } = req;
            if (!body || Object.keys(body).length === 0) {
                Response.error(res, new CreateError.BadRequest());
                debug(body);
            } else {
                const insertedId = await MaquinariaService.create(body);
                Response.success(res, 201, 'Maquinaria agregada', insertedId);
            }
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    }
};