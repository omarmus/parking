'use strict';

const { getQuery } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');
const moment = require('moment');

module.exports = function movimientosRepository (models, Sequelize) {
  const { movimientos, vehiculos, pagos } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    query.include = [
      {
        attributes: [
          'placa'
        ],
        model: vehiculos,
        as: 'vehiculo'
      },
      {
        attributes: [
          'fecha',
          'total',
          'gestion',
          'estado'
        ],
        model: pagos,
        as: 'pago'
      }
    ];

    if (params.tipo) {
      query.where.tipo = params.tipo;
    }

    if (params.fecha_llegada) {
      query.where.fecha_llegada = moment(params.fecha_llegada);
    }

    if (params.fecha_pago) {
      query.where['$pago.fecha$'] = {
        [Op.gte]: moment(params.fecha_pago).format('YYYY-MM-DD HH:ss'),
        [Op.lt]: moment(params.fecha_pago).add(1, 'days').format('YYYY-MM-DD HH:ss')
      };
    }

    if (params.fecha_inicio && params.fecha_fin) {
      query.where['$pago.fecha$'] = {
        [Op.gte]: moment(params.fecha_inicio).format('YYYY-MM-DD HH:ss'),
        [Op.lte]: moment(params.fecha_fin).format('YYYY-MM-DD HH:ss')
      };
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

    if (params.pendientes) {
      query.where.estado = {
        [Op.or]: ['INGRESO', 'POR_PAGAR']
      };
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    return movimientos.findAndCountAll(query);
  }

  function findById (id) {
    return movimientos.findOne({
      where: {
        id
      },
      include: [
        {
          attributes: [
            'placa'
          ],
          model: vehiculos,
          as: 'vehiculo'
        }
      ],
      raw: true
    });
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
