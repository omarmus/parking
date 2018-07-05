'use strict';

const { setTimestampsSeeder } = require('../lib/util');

let items = [
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': true,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 1,
    'id_rol': 1
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': true,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 2,
    'id_rol': 1
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': true,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 3,
    'id_rol': 1
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': true,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 4,
    'id_rol': 1
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': true,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 5,
    'id_rol': 1
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': true,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 6,
    'id_rol': 1
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': true,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 7,
    'id_rol': 1
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': true,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 8,
    'id_rol': 1
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': true,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 9,
    'id_rol': 1
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': true,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 10,
    'id_rol': 1
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': true,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 11,
    'id_rol': 1
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': true,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 12,
    'id_rol': 1
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': true,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 13,
    'id_rol': 1
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': true,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 14,
    'id_rol': 1
  },
  {
    'create': false,
    'read': true,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 1,
    'id_rol': 2
  },
  {
    'create': false,
    'read': false,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 2,
    'id_rol': 2
  },
  {
    'create': false,
    'read': false,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 3,
    'id_rol': 2
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': true,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 4,
    'id_rol': 2
  },
  {
    'create': false,
    'read': false,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 5,
    'id_rol': 2
  },
  {
    'create': false,
    'read': false,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 6,
    'id_rol': 2
  },
  {
    'create': false,
    'read': false,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 7,
    'id_rol': 2
  },
  {
    'create': false,
    'read': false,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 8,
    'id_rol': 2
  },
  {
    'create': false,
    'read': false,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 9,
    'id_rol': 2
  },
  {
    'create': false,
    'read': true,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 10,
    'id_rol': 2
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': true,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 11,
    'id_rol': 2
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 12,
    'id_rol': 2
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': true,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 13,
    'id_rol': 2
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 14,
    'id_rol': 2
  },
  {
    'create': false,
    'read': false,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 1,
    'id_rol': 3
  },
  {
    'create': false,
    'read': false,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 2,
    'id_rol': 3
  },
  {
    'create': false,
    'read': false,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 3,
    'id_rol': 3
  },
  {
    'create': false,
    'read': false,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 4,
    'id_rol': 3
  },
  {
    'create': false,
    'read': false,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 5,
    'id_rol': 3
  },
  {
    'create': false,
    'read': false,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 6,
    'id_rol': 3
  },
  {
    'create': false,
    'read': false,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 7,
    'id_rol': 3
  },
  {
    'create': false,
    'read': false,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 8,
    'id_rol': 3
  },
  {
    'create': false,
    'read': false,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 9,
    'id_rol': 3
  },
  {
    'create': false,
    'read': true,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 10,
    'id_rol': 3
  },
  {
    'create': false,
    'read': true,
    'update': false,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 11,
    'id_rol': 3
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 12,
    'id_rol': 3
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': true,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 13,
    'id_rol': 3
  },
  {
    'create': true,
    'read': true,
    'update': true,
    'delete': false,
    'firma': false,
    'csv': false,
    'activo': true,
    'id_modulo': 14,
    'id_rol': 3
  }
];

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_permisos', items, {});
  },

  down (queryInterface, Sequelize) { }
};
