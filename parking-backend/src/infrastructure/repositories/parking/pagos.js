'use strict';

const { getQuery } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');
const moment = require('moment');

module.exports = function pagosRepository (models, Sequelize) {
  const { pagos } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    if (params.nit) {
      query.where.nit = {
        [Op.iLike]: `%${params.nit}%`
      };
    }

    if (params.razon_social) {
      query.where.razon_social = {
        [Op.iLike]: `%${params.razon_social}%`
      };
    }

    if (params.nro_factura) {
      query.where.nro_factura = {
        [Op.iLike]: `%${params.nro_factura}%`
      };
    }

    if (params.nro_autorizacion) {
      query.where.nro_autorizacion = {
        [Op.iLike]: `%${params.nro_autorizacion}%`
      };
    }

    if (params.id_persona) {
      query.where.id_persona = params.id_persona;
    }

    if (params.gestion) {
      query.where.gestion = params.gestion;
    }

    if (params.id_usuario) {
      query.where.id_usuario = params.id_usuario;
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.fecha) {
      query.where.fecha = moment(params.fecha);
      query.where.fecha = {
        [Op.gte]: moment(params.fecha).format('YYYY-MM-DD HH:ss'),
        [Op.lt]: moment(params.fecha).add(1, 'days').format('YYYY-MM-DD HH:ss')
      };
    }

    return pagos.findAndCountAll(query);
  }

  function findById (id) {
    return pagos.findById(id);
  }

  function findByNit (nit) {
    return pagos.findOne({
      where: {
        nit
      }
    });
  }

  async function createOrUpdate (pago) {
    const cond = {
      where: {
        id: pago.id
      }
    };

    const item = await pagos.findOne(cond);

    if (item) {
      const updated = await pagos.update(pago, cond);
      return updated ? pagos.findOne(cond) : item;
    }

    const result = await pagos.create(pago);
    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, pagos);
  }

  return {
    findAll,
    findById,
    deleteItem,
    createOrUpdate,
    findByNit
  };
};
