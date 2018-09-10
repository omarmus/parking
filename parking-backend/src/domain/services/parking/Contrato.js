'use strict';

const debug = require('debug')('app:service:contrato');

module.exports = function contratoService (repositories, res) {
  const { contratos, vehiculos } = repositories;

  async function findAll (params = {}, idRol, idEntidad) {
    debug('Lista de contratos|filtros');

    let lista;
    try {
      lista = await contratos.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de contratos`));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando contrato por ID');

    let contrato;
    try {
      contrato = await contratos.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!contrato) {
      return res.error(new Error(`Entidad ${id} not found`));
    }

    return res.success(contrato);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar contrato');

    let contrato;
    try {
      if (!data.id) {
        let vehiculo = await vehiculos.findByPlaca(data.placa);
        if (!vehiculo) {
          vehiculo = await vehiculos.createOrUpdate({
            placa: data.placa,
            _user_created: data._user_created
          });
        }
        data.id_vehiculo = vehiculo.id;
      }
      contrato = await contratos.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!contrato) {
      return res.error(new Error(`El contrato no pudo ser creado`));
    }

    return res.success(contrato);
  }

  async function deleteItem (id) {
    debug('Eliminando contrato');

    let deleted;
    try {
      deleted = await contratos.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe la contrato`));
    }

    if (deleted === 0) {
      return res.error(new Error(`La contrato ya fue eliminada`));
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
