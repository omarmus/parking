'use strict';

const { setTimestampsSeeder } = require('../lib/util');

let items = [
  {
    minutos: 30,
    precio: 7,
    turno: 'DIURNO',
    gestion: 2018
  },
  {
    minutos: 60,
    precio: 12,
    turno: 'DIURNO',
    gestion: 2018
  },
  {
    minutos: 90,
    precio: 14,
    turno: 'DIURNO',
    gestion: 2018
  },
  {
    minutos: 120,
    precio: 16,
    turno: 'DIURNO',
    gestion: 2018
  },
  {
    minutos: 180,
    precio: 18,
    turno: 'DIURNO',
    gestion: 2018
  },
  {
    minutos: 240,
    precio: 20,
    turno: 'DIURNO',
    gestion: 2018
  },
  {
    minutos: 300,
    precio: 21,
    turno: 'DIURNO',
    gestion: 2018
  },
  {
    minutos: 360,
    precio: 22,
    turno: 'DIURNO',
    gestion: 2018
  },
  {
    minutos: 420,
    precio: 24,
    turno: 'DIURNO',
    gestion: 2018
  },
  {
    minutos: 480,
    precio: 26,
    turno: 'DIURNO',
    gestion: 2018
  },
  {
    minutos: 540,
    precio: 28,
    turno: 'DIURNO',
    gestion: 2018
  },
  {
    minutos: 600,
    precio: 29,
    turno: 'DIURNO',
    gestion: 2018
  },
  {
    minutos: 720,
    precio: 30,
    turno: 'DIURNO',
    gestion: 2018
  },
  {
    minutos: 1440,
    precio: 35,
    turno: 'DIURNO',
    gestion: 2018
  },
  {
    minutos: 0,
    precio: 35,
    turno: 'NOCTURNO',
    gestion: 2018
  }
];

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('par_tarifas', items, {});
  },

  down (queryInterface, Sequelize) { }
};
