'use strict';

const debug = require('debug')('app:service:vehiculo');

module.exports = function vehiculoService (repositories, res) {
  const { vehiculos } = repositories;

  async function findAll (params = {}, idRol, idEntidad) {
    debug('Lista de vehiculos|filtros');

    let lista;
    try {
      lista = await vehiculos.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de vehiculos`));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando vehiculo por ID');

    let vehiculo;
    try {
      vehiculo = await vehiculos.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!vehiculo) {
      return res.error(new Error(`Entidad ${id} not found`));
    }

    return res.success(vehiculo);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar vehiculo');

    let vehiculo;
    try {
      vehiculo = await vehiculos.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!vehiculo) {
      return res.error(new Error(`El vehiculo no pudo ser creado`));
    }

    return res.success(vehiculo);
  }

  async function deleteItem (id) {
    debug('Eliminando vehiculo');

    let deleted;
    try {
      deleted = await vehiculos.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe la vehiculo`));
    }

    if (deleted === 0) {
      return res.error(new Error(`La vehiculo ya fue eliminada`));
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
