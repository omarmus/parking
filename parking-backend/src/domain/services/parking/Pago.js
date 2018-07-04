'use strict';

const debug = require('debug')('app:service:pago');
const { diff } = require('../../lib/time');

module.exports = function pagoService (repositories, res) {
  const { pagos, tarifas } = repositories;

  async function findAll (params = {}, idRol, idEntidad) {
    debug('Lista de pagos|filtros');

    let lista;
    try {
      lista = await pagos.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de pagos`));
    }

    return res.success(lista);
  }

  async function calcularTotal (horaInicio, horaSalida) {
    debug('Calculando total', horaInicio, horaSalida);
    let total = 0;
    let minutos = diff(horaInicio, horaSalida);
    console.log('MINUTOS TOTAL', minutos);
    let gestion = new Date().getFullYear();
    let items = await tarifas.findAll({ gestion, order: 'minutos', estado: 'ACTIVO', turno: 'DIURNO' });
    items = items.rows;
    console.log('items', items);
    for (let i in items) {
      console.log('ITEM', items[i]);
      console.log('MINUTOS', items[i].minutos, 'PRECIO', items[i].precio);
      if (minutos <= items[i].minutos) {
        total = parseFloat(items[i].precio);
        console.log('TOTAL!!!', total);
        break;
      }
    }

    return res.success({ total });
  }

  async function findById (id) {
    debug('Buscando pago por ID');

    let pago;
    try {
      pago = await pagos.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!pago) {
      return res.error(new Error(`Entidad ${id} not found`));
    }

    return res.success(pago);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar pago');

    let pago;
    try {
      if (data.id) {
        // Realizando el pago
        data.fecha = new Date();
        data.estado = 'PAGADO';
        data.gestion = new Date().getFullYear();
      }
      pago = await pagos.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!pago) {
      return res.error(new Error(`El pago no pudo ser creado`));
    }

    return res.success(pago);
  }

  async function deleteItem (id) {
    debug('Eliminando pago');

    let deleted;
    try {
      deleted = await pagos.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe la pago`));
    }

    if (deleted === 0) {
      return res.error(new Error(`La pago ya fue eliminada`));
    }

    return res.success(deleted > 0);
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem,
    calcularTotal
  };
};
