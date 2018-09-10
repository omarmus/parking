'use strict';

const { getQuery } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function contratosRepository (models, Sequelize) {
  const { contratos, vehiculos } = models;
  // const Op = Sequelize.Op;

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
      }
    ];

    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.id_vehiculo) {
      query.where.id_vehiculo = params.id_vehiculo;
    }

    return contratos.findAndCountAll(query);
  }

  function findById (id) {
    return contratos.findById(id, {
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

  async function createOrUpdate (contrato) {
    const cond = {
      where: {
        id: contrato.id
      }
    };

    const item = await contratos.findOne(cond);

    if (item) {
      const updated = await contratos.update(contrato, cond);
      return updated ? contratos.findOne(cond) : item;
    }

    const result = await contratos.create(contrato);
    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, contratos);
  }

  return {
    findAll,
    findById,
    deleteItem,
    createOrUpdate
  };
};
