'use strict';

const { setTimestampsSeeder } = require('../lib/util');

let items = [
  // USUARIOS
  {
    label: 'Configuraciones',
    ruta: 'config',
    icono: 'settings',
    orden: 1,
    estado: 'ACTIVO',
    visible: true
  },
  {
    label: 'Entidades',
    ruta: 'entidades',
    orden: 2,
    estado: 'ACTIVO',
    visible: true,
    id_modulo: 1
  },
  {
    label: 'Personas',
    ruta: 'personas',
    orden: 3,
    estado: 'ACTIVO',
    visible: false,
    id_modulo: 1
  },
  {
    label: 'Usuarios',
    ruta: 'usuarios',
    orden: 4,
    estado: 'ACTIVO',
    visible: true,
    id_modulo: 1
  },
  {
    label: 'Módulos y permisos',
    ruta: 'modulos',
    orden: 5,
    estado: 'ACTIVO',
    visible: true,
    id_modulo: 1
  },
  {
    label: 'Preferencias',
    ruta: 'parametros',
    orden: 6,
    estado: 'ACTIVO',
    visible: true,
    id_modulo: 1
  },
  {
    label: 'Permisos',
    ruta: 'permisos',
    orden: 7,
    estado: 'ACTIVO',
    visible: false,
    id_modulo: 1
  },
  {
    label: 'Roles',
    ruta: 'roles',
    orden: 8,
    estado: 'ACTIVO',
    visible: false,
    id_modulo: 1
  },
  {
    label: 'Logs del sistema',
    ruta: 'logs',
    orden: 9,
    estado: 'ACTIVO',
    visible: true,
    id_modulo: 1
  },
  {
    label: 'Parking',
    ruta: 'parking',
    icono: 'directions_car',
    orden: 10,
    estado: 'ACTIVO',
    visible: true
  },
  {
    label: 'Tarifas',
    ruta: 'tarifas',
    orden: 11,
    estado: 'ACTIVO',
    visible: true,
    id_modulo: 10
  },
  {
    label: 'Vehículos',
    ruta: 'vehiculos',
    orden: 12,
    estado: 'ACTIVO',
    visible: false,
    id_modulo: 10
  },
  {
    label: 'Ingreso/Salida',
    ruta: 'movimientos',
    orden: 13,
    estado: 'ACTIVO',
    visible: true,
    id_modulo: 10
  },
  {
    label: 'Pagos',
    ruta: 'pagos',
    orden: 14,
    estado: 'ACTIVO',
    visible: true,
    id_modulo: 10
  },
  {
    label: 'Contratos',
    ruta: 'contratos',
    orden: 15,
    estado: 'ACTIVO',
    visible: true,
    id_modulo: 10
  }
];

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_modulos', items, {});
  },

  down (queryInterface, Sequelize) { }
};
