'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function vehiculosRepository (models, Sequelize) {
  const { vehiculos } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    if (params.placa) {
      query.where.placa = {
        [Op.iLike]: `%${params.placa}%`
      };
    }

    if (params.marca) {
      query.where.marca = {
        [Op.iLike]: `%${params.marca}%`
      };
    }

    if (params.modelo) {
      query.where.modelo = {
        [Op.iLike]: `%${params.modelo}%`
      };
    }

    if (params.tipo) {
      query.where.tipo = params.tipo;
    }

    if (params.id_persona) {
      query.where.id_persona = params.id_persona;
    }

    if (params.gestion) {
      query.where.gestion = params.gestion;
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    return vehiculos.findAndCountAll(query);
  }

  function findById (id) {
    return vehiculos.findById(id);
  }

  async function createOrUpdate (vehiculo) {
    const cond = {
      where: {
        id: vehiculo.id
      }
    };

    const item = await vehiculos.findOne(cond);

    if (item) {
      let updated;
      try {
        updated = await vehiculos.update(vehiculo, cond);
      } catch (e) {
        errorHandler(e);
      }
      return updated ? vehiculos.findOne(cond) : item;
    }

    let result;
    try {
      result = await vehiculos.create(vehiculo);
    } catch (e) {
      errorHandler(e);
    }

    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, vehiculos);
  }

  return {
    findAll,
    findById,
    deleteItem,
    createOrUpdate
  };
};
