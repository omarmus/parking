'use strict';

const debug = require('debug')('app:service:movimiento');
const { formatTime, formatDate } = require('../../lib/time');

module.exports = function movimientoService (repositories, res) {
  const { movimientos, vehiculos, pagos } = repositories;
  const Pago = require('./Pago')(repositories, res);

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
    let nuevo = false;
    try {
      if (!data.id) {
        // Creando vehículo si no existe
        let vehiculo = await vehiculos.findByPlaca(data.placa);
        if (!vehiculo) {
          vehiculo = await vehiculos.createOrUpdate({
            placa: data.placa,
            _user_created: data._user_created
          });
          nuevo = true;
        }
        data.id_vehiculo = vehiculo.id;

        // Asignando usuario que realizó el registro
        data.id_usuario_llegada = data._user_created;

        // Asignando fecha y hora de llegada
        let now = new Date();
        data.fecha_llegada = formatDate(now);
        data.hora_llegada = formatTime(now);
        console.log('DATA CREATE', data);
      } else {
        let item = await movimientos.findById(data.id);
        if (item) {
          if (item.estado === 'INGRESO') {
            // Asignando usuario que realizó el registro
            data.id_usuario_salida = data._user_updated;
            data.estado = 'SALIDA';

            // Asignando fecha y hora de llegada
            let now = new Date();
            data.fecha_salida = formatDate(now);
            data.hora_salida = formatTime(now);

            // Creando pago
            let costo = await Pago.calcularTotal(item.hora_llegada, data.hora_salida);
            let pago = await pagos.createOrUpdate({
              id_usuario: data._user_updated,
              _user_created: data._user_updated,
              total: costo.data.total
            });
            data.id_pago = pago.id;
            data.total = costo.data.total;
            console.log('DATA UPDATE', data);
          }
        } else {
          return res.error(new Error('No existe el registro'));
        }
      }
      movimiento = await movimientos.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!movimiento) {
      return res.error(new Error(`El movimiento no pudo ser creado`));
    }

    movimiento['vehiculo.placa'] = data.placa;
    movimiento.nuevo = nuevo;
    movimiento.id_pago = data.id_pago;
    movimiento.total = data.total;

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
