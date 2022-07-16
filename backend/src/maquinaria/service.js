const { Database } = require('../database/index');
const debug = require('debug')('app:module-maquinaria-service');

const COLLECTION = 'maquinarias';

const getAll = async() => {
    const collection = await Database(COLLECTION);
    return await collection.find({}).toArray();
};

const getById = async(id) => {
    const collection = await Database(COLLECTION);
    return collection.findOne({ _id: id })
};

const create = async(maquinaria) => {
    const collection = await Database(COLLECTION);
    let result = await collection.insertOne(maquinaria);
    return await result.insertedId;
};

module.exports.MaquinariaService = {
    getAll,
    getById,
    create
};