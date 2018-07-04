'use strict';

const { setTimestampsSeeder } = require('../lib/util');
const { text } = require('../../common');
const contrasena = text.encrypt('123456');

// Datos de producción
let items = [
  {
    usuario: 'superadmin',
    contrasena,
    email: 'omargc.mus@gmail.com',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 1,
    id_entidad: 1
  },
  {
    usuario: 'admin',
    contrasena,
    email: null,
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 2,
    id_entidad: 1
  },
  {
    usuario: 'operador',
    contrasena,
    email: null,
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 3,
    id_entidad: 1
  }
];

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_usuarios', items, {});
  },

  down (queryInterface, Sequelize) { }
};
