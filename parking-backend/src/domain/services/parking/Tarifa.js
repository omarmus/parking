'use strict';

const debug = require('debug')('app:service:tarifa');

module.exports = function tarifaService (repositories, res) {
  const { tarifas } = repositories;

  async function findAll (params = {}, idRol, idEntidad) {
    debug('Lista de tarifas|filtros');

    let lista;
    try {
      lista = await tarifas.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de tarifas`));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando tarifa por ID');

    let tarifa;
    try {
      tarifa = await tarifas.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!tarifa) {
      return res.error(new Error(`Entidad ${id} not found`));
    }

    return res.success(tarifa);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar tarifa');

    let tarifa;
    try {
      tarifa = await tarifas.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!tarifa) {
      return res.error(new Error(`El tarifa no pudo ser creado`));
    }

    return res.success(tarifa);
  }

  async function deleteItem (id) {
    debug('Eliminando tarifa');

    let deleted;
    try {
      deleted = await tarifas.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe la tarifa`));
    }

    if (deleted === 0) {
      return res.error(new Error(`La tarifa ya fue eliminada`));
    }

    return res.success(deleted > 0);
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem
  };
};
