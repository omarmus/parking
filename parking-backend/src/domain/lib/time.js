'use strict';

const moment = require('moment');

function diff (fechaIni, horaIni, fechaFin, horaFin) {
  let ini = `${fechaIni} ${horaIni}`;
  let fin = `${fechaFin} ${horaFin}`;

  // console.log('Fecha Ingreso: ', ini);
  // console.log('Fecha Salida: ', fin);

  var ms = moment(fin, 'YYYY-MM-DD HH:mm:ss').diff(moment(ini, 'YYYY-MM-DD HH:mm:ss'));
  var d = moment.duration(ms);

  return d.asMinutes();
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

function timeLiteral (time, txt) {
  let text = '';
  if (typeof time === 'number') {
    if (time === 0) {
      return '';
    }
    if (time < 60) {
      text = time + 's';
    } else if (time < 3600) {
      text = Math.floor(time / 60) + 'm ' + (time % 60 > 0 ? (time % 60 + 's') : '');
    } else {
      text = Math.floor(time / 3600) + 'h ' + (time % 3600 > 0 ? (Math.floor((time - (3600 * Math.floor(time / 3600))) / 60) + 'm ') : '') + (time % 60 > 0 ? (time % 60 + 's') : '');
    }
    return (txt || '') + text;
  } else {
    if (time.length === 0) {
      return '';
    }
    time = time.split(':');
    let hours = time[0];
    let minutes = time[1];

    if (parseInt(hours) > 0) {
      text += parseInt(hours) + 'h ';
    }
    if (parseInt(minutes) > 0) {
      text += parseInt(minutes) + 'm ';
    }
    if (time.length === 3 && parseInt(time[2]) > 0) {
      text += parseInt(time[2]) + 's';
    }

    return (txt || '') + text;
  }
}

module.exports = {
  diff,
  transformDate,
  transform,
  addDays,
  formatTime,
  formatDate,
  milliseconds,
  timeLiteral
};
