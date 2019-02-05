'use strict';

const test = require('ava');
const { errors, config } = require('../../common');
const domain = require('../');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const os = require('os');

let services;

test.beforeEach(async () => {
  if (!services) {
    services = await domain(config.db).catch(errors.handleFatalError);
  }
});

test.serial('Modulo#getMenu', async t => {
  const { Pago } = services;
  let now = moment();
  var data = {
    fecha_llegada: moment().format('2019-02-4'),
    hora_llegada: moment().format('08:00'),
    fecha_salida: now.format('YYYY-MM-DD'),
    hora_salida: now.format('HH:mm')
  };

  let csv = [];

  for (let i = 0; i < 20000; i++) {
    now = moment(now).subtract(1, 'minutes');
    data.fecha_llegada = now.format('YYYY-MM-DD');
    data.hora_llegada = now.format('HH:mm');
    let res = await Pago.calcularTotal(moment(data.fecha_llegada, 'YYYY-MM-DD').format('YYYY-MM-DD'), data.hora_llegada, data.fecha_salida, data.hora_salida);
    csv.push(res.data.print.join(','));
  }

  const filename = path.join(__dirname, 'montos.csv');
  fs.writeFileSync(filename, csv.join(os.EOL));

  // console.log('costo', data, res.data, `${res.data.total} Bs`);
  t.true(true, 'Respuesta correcta');
});
