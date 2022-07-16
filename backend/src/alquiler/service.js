const { Database } = require('../database/index');
const { ObjectId } = require('mongodb')

const COLLECTION = 'alquiler';

const getAll = async() => {
    const collection = await Database(COLLECTION);
    return await collection.find({}).toArray();
};

const getById = async(id) => {
    const collection = await Database(COLLECTION);
    return await collection.findOne({ _id: ObjectId(id) });
};

const create = async(alquiler) => {
    const collection = await Database(COLLECTION);
    let result = await collection.insertOne(alquiler);
    return result.insertedId;
};

const update = async(id, alquiler) => {
    const collection = await Database(COLLECTION);
    let result = await collection.replaceOne({ _id: ObjectId(id) }, alquiler);
    return result;
}

module.exports.AlquilerService = {
    getAll,
    getById,
    create,
    update
};