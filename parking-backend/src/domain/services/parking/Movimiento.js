'use strict';

const debug = require('debug')('app:service:movimiento');

module.exports = function movimientoService (repositories, res) {
  const { movimientos } = repositories;

  async function findAll (params = {}, idRol, idEntidad) {
    debug('Lista de movimientos|filtros');

    let lista;
    try {
      lista = await movimientos.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de movimientos`));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando movimiento por ID');

    let movimiento;
    try {
      movimiento = await movimientos.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!movimiento) {
      return res.error(new Error(`Entidad ${id} not found`));
    }

    return res.success(movimiento);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar movimiento');

    let movimiento;
    try {
      movimiento = await movimientos.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!movimiento) {
      return res.error(new Error(`El movimiento no pudo ser creado`));
    }

    return res.success(movimiento);
  }

  async function deleteItem (id) {
    debug('Eliminando movimiento');

    let deleted;
    try {
      deleted = await movimientos.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe la movimiento`));
    }

    if (deleted === 0) {
      return res.error(new Error(`La movimiento ya fue eliminada`));
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
