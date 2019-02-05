'use strict';

const debug = require('debug')('app:service:movimiento');
const moment = require('moment');
const { milliseconds } = require('../../lib/time');

module.exports = function movimientoService (repositories, res) {
  const { movimientos, vehiculos, pagos, contratos } = repositories;
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
    let contrato = false;
    try {
      if (!data.id) { // CREANDO EL MOVIMIENTO
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

        // Verificando que el automovil tiene pagos pendientes
        let mov = await movimientos.findAll({ id_vehiculo: data.id_vehiculo, pendientes: true });
        if (mov && mov.count) {
          return res.warning(new Error('El vehículo tiene un pago pendiente'));
        }

        // Asignando usuario que realizó el registro
        data.id_usuario_llegada = data._user_created;

        // Asignando fecha y hora de llegada
        data.fecha_llegada = moment().format('YYYY-MM-DD');
        data.hora_llegada = moment().format('HH:mm');

        // Comprobando que exista un contrato
        let contratoItem = await contratos.findAll({ id_vehiculo: data.id_vehiculo });
        if (contratoItem && contratoItem.count) {
          let now = milliseconds(moment().format('YYYY-MM-DD'));
          let inicio = milliseconds(moment(contratoItem.fecha_inicio).format('YYYY-MM-DD'));
          let fin = milliseconds(moment(contratoItem.fecha_fin).format('YYYY-MM-DD'));

          if (now >= inicio && now <= fin) {
            contrato = true;
          }
        }
        console.log('DATA CREATE', data);
      } else { // CREANDO PAGO DEL MOVIMIENTO
        let item = await movimientos.findById(data.id);
        if (item) {
          if (item.estado === 'INGRESO' || item.estado === 'POR_PAGAR') {
            if (item.estado === 'INGRESO') {
              data.estado = 'POR_PAGAR';
            }

            // Asignando usuario que realizó el registro
            data.id_usuario_salida = data._user_updated;

            // Asignando fecha y hora de salida
            data.fecha_salida = moment().format('YYYY-MM-DD');
            data.hora_salida = moment().format('HH:mm');

            // Creando/Actualizando pago
            let costo = await Pago.calcularTotal(moment(data.fecha_llegada).format('YYYY-MM-DD'), item.hora_llegada, data.fecha_salida, data.hora_salida);
            console.log('COSTO TOTAL =========', costo);
            if (costo.code === -1) {
              return res.error(new Error(costo.data.message || costo.data));
            }
            let pago = await pagos.createOrUpdate({
              id: item.id_pago,
              id_usuario: data._user_updated,
              _user_created: data._user_updated,
              total: costo.data.total
            });
            data.id_pago = pago.id;
            data.total = costo.data.total;
            data.placa = item['vehiculo.placa'];

            // Comprobando que exista un contrato
            let contratoItem = await contratos.findAll({ id_vehiculo: item.id_vehiculo });
            if (contratoItem && contratoItem.count) {
              contrato = true;
            }

            console.log('DATA UPDATE', data);
          }
          if (item.estado === 'PAGADO') {
            return res.warning(new Error('El ticket ya fue pagado'));
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
    movimiento.contrato = contrato;

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
