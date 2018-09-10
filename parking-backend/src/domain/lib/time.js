'use strict';

const moment = require('moment');

function diff (fechaInicio, hourIni, fechaSalida, horaEnd) {
  console.log('DATOS', fechaInicio, hourIni, fechaSalida, horaEnd);
  let fechaIni = moment(`${fechaInicio} ${hourIni}`, 'YYYY-MM-DD HH:ss').add(1, 'days').valueOf();
  let fechaFin = moment(`${fechaSalida} ${horaEnd}`, 'YYYY-MM-DD HH:ss').valueOf();
  console.log(fechaIni, fechaFin);

  return Math.ceil((fechaFin - fechaIni) / 60000);
}

function transform (time) {
  let t = time.split(':');

  if (t[1].split('+').length > 1) {
    let add = t[1].split('+');
    t = (parseInt(t[0]) * 60 + parseInt(add[0])) + 60 * 24 * parseInt(add[1]);
  } else {
    t = parseInt(t[0]) * 60 + parseInt(t[1]);
  }

  return t;
}

function transformDate (date) {
  if (typeof date === 'string') {
    let fecha = date.split('/');
    if (fecha.length === 3) {
      if (fecha[2].length === 4) {
        return new Date(fecha[2], parseInt(fecha[1]) - 1, fecha[0]);
      }
    }
  }
  return date;
}

function addDays (date, days) {
  if (typeof date === 'number') {
    return date + (days || 0) * 24 * 60 * 60 * 1000;
  } else {
    return date.getTime() + (days || 0) * 24 * 60 * 60 * 1000;
  }
}

function formatTime (date) {
  return [date.getHours(), date.getMinutes()].join(':');
}

function formatDate (date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
}

function milliseconds (date) {
  date = date.split('-');
  return new Date(date[0], date[1] - 1, date[2], 0, 0, 0).getTime();
}

module.exports = {
  diff,
  transformDate,
  transform,
  addDays,
  formatTime,
  formatDate,
  milliseconds
};
