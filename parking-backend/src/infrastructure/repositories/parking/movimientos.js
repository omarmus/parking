'use strict';

const { getQuery } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function movimientosRepository (models, Sequelize) {
  const { movimientos } = models;
  // const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    if (params.tipo) {
      query.where.tipo = params.tipo;
    }

    if (params.fecha_llegada) {
      query.where.fecha_llegada = params.fecha_llegada;
    }

    if (params.hora_llegada) {
      query.where.hora_llegada = params.hora_llegada;
    }

    if (params.fecha_salida) {
      query.where.fecha_salida = params.fecha_salida;
    }

    if (params.hora_salida) {
      query.where.hora_salida = params.hora_salida;
    }

    if (params.id_usuario_llegada) {
      query.where.id_usuario_llegada = params.id_usuario_llegada;
    }

    if (params.id_usuario_salida) {
      query.where.id_usuario_salida = params.id_usuario_salida;
    }

    if (params.id_pago) {
      query.where.id_pago = params.id_pago;
    }

    if (params.id_vehiculo) {
      query.where.id_vehiculo = params.id_vehiculo;
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    return movimientos.findAndCountAll(query);
  }

  function findById (id) {
    return movimientos.findById(id);
  }

  async function createOrUpdate (movimiento) {
    const cond = {
      where: {
        id: movimiento.id
      }
    };

    const item = await movimientos.findOne(cond);

    if (item) {
      const updated = await movimientos.update(movimiento, cond);
      return updated ? movimientos.findOne(cond) : item;
    }

    const result = await movimientos.create(movimiento);
    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, movimientos);
  }

  return {
    findAll,
    findById,
    deleteItem,
    createOrUpdate
  };
};
