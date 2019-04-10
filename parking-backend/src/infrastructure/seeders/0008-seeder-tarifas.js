'use strict';

const { setTimestampsSeeder } = require('../lib/util');

const gestion = new Date().getFullYear();

let items = [
  {
    minutos: 30,
    precio: 7,
    turno: 'DIURNO',
    gestion
  },
  {
    minutos: 60,
    precio: 12,
    turno: 'DIURNO',
    gestion
  },
  {
    minutos: 90,
    precio: 14,
    turno: 'DIURNO',
    gestion
  },
  {
    minutos: 120,
    precio: 16,
    turno: 'DIURNO',
    gestion
  },
  {
    minutos: 180,
    precio: 18,
    turno: 'DIURNO',
    gestion
  },
  {
    minutos: 240,
    precio: 20,
    turno: 'DIURNO',
    gestion
  },
  {
    minutos: 300,
    precio: 21,
    turno: 'DIURNO',
    gestion
  },
  {
    minutos: 360,
    precio: 22,
    turno: 'DIURNO',
    gestion
  },
  {
    minutos: 420,
    precio: 24,
    turno: 'DIURNO',
    gestion
  },
  {
    minutos: 480,
    precio: 26,
    turno: 'DIURNO',
    gestion
  },
  {
    minutos: 540,
    precio: 28,
    turno: 'DIURNO',
    gestion
  },
  {
    minutos: 600,
    precio: 29,
    turno: 'DIURNO',
    gestion
  },
  {
    minutos: 720,
    precio: 30,
    turno: 'DIURNO',
    gestion
  },
  {
    minutos: 1440,
    precio: 35,
    turno: 'DIURNO',
    gestion
  },
  {
    minutos: 0,
    precio: 35,
    turno: 'NOCTURNO',
    gestion
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
