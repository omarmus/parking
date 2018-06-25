'use strict';

const { getQuery } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function tarifasRepository (models, Sequelize) {
  const { tarifas } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    if (params.precio) {
      query.where.precio = {
        [Op.iLike]: `%${params.precio}%`
      };
    }

    if (params.minutos) {
      query.where.minutos = {
        [Op.iLike]: `%${params.minutos}%`
      };
    }

    if (params.turno) {
      query.where.turno = params.turno;
    }

    if (params.gestion) {
      query.where.gestion = params.gestion;
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    return tarifas.findAndCountAll(query);
  }

  function findById (id) {
    return tarifas.findById(id);
  }

  async function createOrUpdate (tarifa) {
    const cond = {
      where: {
        id: tarifa.id
      }
    };

    const item = await tarifas.findOne(cond);

    if (item) {
      const updated = await tarifas.update(tarifa, cond);
      return updated ? tarifas.findOne(cond) : item;
    }

    const result = await tarifas.create(tarifa);
    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, tarifas);
  }

  return {
    findAll,
    findById,
    deleteItem,
    createOrUpdate
  };
};
