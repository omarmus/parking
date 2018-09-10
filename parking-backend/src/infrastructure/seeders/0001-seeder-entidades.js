'use strict';

// const casual = require('casual');
const { setTimestampsSeeder } = require('../lib/util');

// Datos de producción
let items = [
  {
    nombre: 'Parking 1',
    descripcion: 'Parking',
    sigla: 'PARKING',
    email: 'contacto@mail.com',
    telefonos: '',
    direccion: '',
    web: 'parking',
    estado: 'ACTIVO'
  },
  {
    nombre: 'Parking 2',
    descripcion: 'Parking',
    sigla: 'PARKING',
    email: 'contacto@mail.com',
    telefonos: '',
    direccion: '',
    web: 'parking',
    estado: 'ACTIVO'
  }
];

// // Agregando datos aleatorios para desarrollo
// if (typeof process.env.NODE_ENV === 'undefined' || process.env.NODE_ENV !== 'production') {
//   let personas = Array(9).fill().map((_, i) => {
//     let item = {
//       nombre: casual.company_name,
//       descripcion: casual.text,
//       sigla: casual.company_suffix,
//       email: casual.email,
//       telefonos: `${casual.phone},${casual.phone}`,
//       direccion: casual.address,
//       web: casual.url,
//       estado: 'ACTIVO',
//       subdomain: casual.domain
//     };

//     return item;
//   });

//   items = items.concat(personas);
// }

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_entidades', items, {});
  },

  down (queryInterface, Sequelize) { }
};
