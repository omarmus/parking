'use strict';

import store from '@/store';
import pad from '@/common/util/pad';

export default {
  store,
  install: Vue => {
    let instance = new Vue();
    const Util = instance.$util;

    const DatetimeService = {
      formatDate: 'dd/MM/YYYY',
      months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      days: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayslong: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],

      date (date, separator, format) {
        return this.convert(date, separator, format);
      },

      convert (date, separator = '/', format) {
        if (date) {
          format = format || this.formatDate;
          date = date.split(separator);
          if (format === 'dd/MM/YYYY') {
            return new Date(date[2], date[1] - 1, date[0], 0, 0, 0);
          } else if (format === 'MM/dd/YYYY') {
            return new Date(date[2], date[0] - 1, date[1], 0, 0, 0);
          } else {
            return new Date(date[0], date[1] - 1, date[2], 0, 0, 0);
          }
        }
        return date;
      },

      parse (date, separator) {
        return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join(separator || '-');
      },

      dateMonth () {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1);
      },

      getDate (date) {
        date = new Date(date);
        return {
          day: date.getDate(),
          month: date.getMonth() + 1,
          year: date.getFullYear()
        };
      },

      getPrevDateMonth (data) {
        data = data || 1;
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();

        if (day < data) {
          month--;
          if (month < 0) {
            month = 11;
            year--;
          }
        }
        return new Date(year, month, data);
      },

      toString (date) {
        if (Util.toType(date) === 'string') {
          let pos = date.indexOf('T');
          if (pos !== -1 && pos <= 10 && pos >= 8) {
            let fecha = date.substring(0, pos);
            if (!/[a-zA-Z]+/g.test(fecha) && /^-?[0-9.]+-?[0-9]+-?[0-9]*$/g.test(fecha)) {
              fecha = fecha.split('-');
              return this.format(new Date(fecha[0], parseInt(fecha[1]) - 1, fecha[2]));
            }
          }
        } else {
          if (Util.toType(date) === 'date') {
            return this.format(new Date(date));
          }
        }
        return date;
      },

      toDate (string) {
        if (Util.toType(string) === 'string') {
          let pos = string.indexOf('T');
          if (pos !== -1 && pos <= 10 && pos >= 8) {
            let fecha = string.substring(0, pos);
            if (!/[a-zA-Z]+/g.test(fecha) && /^-?[0-9.]+-?[0-9]+-?[0-9]*$/g.test(fecha)) {
              fecha = fecha.split('-');
              return new Date(fecha[0], parseInt(fecha[1]) - 1, fecha[2]);
            }
          }
        }
        return string;
      },

      isDate (date) {
        if (Util.toType(date) === 'string') {
          date = this.convert(date);
        }
        return this.isValid(date);
      },

      isValid (date) {
        if (Util.toType(date) !== 'date') {
          return false;
        }
        return !isNaN(date.getTime());
      },

      isLessThan (date) {
        return this.milliseconds(date) < (new Date()).getTime();
      },

      isLessThanDays (date, data) {
        return this.milliseconds(date) > this.subtractDays(new Date(), data);
      },

      isGreaterThan (date) {
        return this.milliseconds(date) > (new Date()).getTime();
      },

      isGreaterThanDays (date, data) {
        return this.milliseconds(date) < this.addDays(new Date(), data);
      },

      addDays (date, days) {
        if (typeof date === 'number') {
          return date + (days || 0) * 24 * 60 * 60 * 1000;
        } else {
          return this.milliseconds(date) + (days || 0) * 24 * 60 * 60 * 1000;
        }
      },

      subtractDays (date, days) {
        if (typeof date === 'number') {
          return date - (days || 0) * 24 * 60 * 60 * 1000;
        } else {
          return this.milliseconds(date) - (days || 0) * 24 * 60 * 60 * 1000;
        }
      },

      diff (date2, date1) {
        return this.milliseconds(date2) - this.milliseconds(date1);
      },

      diffTime (hourIni, horaEnd) {
        let h1 = hourIni.split(':');
        let h2 = horaEnd.split(':');

        h1 = parseInt(h1[0]) * 60 + parseInt(h1[1]);

        if (h2[1].split('+').length > 1) {
          let add = h2[1].split('+');
          h2 = (parseInt(h2[0]) * 60 + parseInt(add[0])) + 60 * 24 * parseInt(add[1]);
        } else {
          h2 = parseInt(h2[0]) * 60 + parseInt(h2[1]);
        }

        return h2 - h1;
      },

      milliseconds (date) {
        if (Util.toType(date) === 'string') {
          date = this.convert(date);
        }
        return date.getTime();
      },

      setFormatDate (format) {
        this.formatDate = format;
      },

      transform (date) {
        if (date && typeof date === 'string') {
          date = date.split('-');
          if (date.length === 3) {
            return new Date(date[0], date[1] - 1, date[2], 0, 0, 0);
          }
        }
        return date;
      },

      format2 (date) {
        if (this.isDate(date)) {
          return this.sanitizeDateString(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, 'date');
        }
        return date;
      },

      now (typeDate = false, format) {
        const now = new Date();
        let date = this.sanitizeDateString(`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`, 'date');
        if (format && format === 'SIN_FORMATO') {
          return date;
        }
        if (format === 'datetime') {
          date = date.split('-');
          return `${[date[2], date[1], date[0]].join('/')} ${now.getHours()}:${now.getMinutes()}`;
        }
        date = date.split('-');
        date = new Date(date[0], date[1] - 1, date[2], 0, 0, 0);
        if (typeDate) {
          return date;
        }
        return this.replace(date, format || this.formatDate);
      },

      dateLiteral (date) {
        return this.format(date, 'dd de MMM del YYYY');
      },

      time (date) {
        return this.format(date, 'HH:mm');
      },

      timeLiteral (time, txt) {
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
      },

      getSeconds (time) {
        time = time.split(':');
        let hours = time[0];
        let minutes = time[1];
        let total = 0;

        if (parseInt(hours) > 0) {
          total += parseInt(hours) * 3600;
        }
        if (parseInt(minutes) > 0) {
          total += parseInt(minutes) * 60;
        }
        if (time.length === 3 && parseInt(time[2]) > 0) {
          total += parseInt(time[2]);
        }

        return total;
      },

      datetimeLiteral (date) {
        return this.format(date, 'dddd dd de MMM del YYYY a la(s) HH:mm');
      },

      format (date, format) {
        if (date) {
          let d = new Date(date);
          if (this.isDate(d)) {
            return this.replace(d, format || this.formatDate);
          }
          return date;
        }
      },

      standar (date, format) {
        if (date) {
          let type = Util.toType(date);
          if (type === 'date') {
            return date;
          }
          let day, month, year;
          if (type === 'string') {
            format = format || this.formatDate;
            let separator = date.indexOf('/') !== -1 ? '/' : '-';
            date = date.split(separator);

            if (format === 'dd-MM-YYYY' || format === 'dd/MM/YYYY') {
              day = date[0];
              month = date[1] - 1;
              year = date[2];
            }

            if (format === 'MM-dd-YYYY' || format === 'MM/dd/YYYY') {
              day = date[1];
              month = date[0] - 1;
              year = date[2];
            }

            if (format === 'YYYY-MM-dd' || format === 'YYYY/MM/dd') {
              day = date[2];
              month = date[1] - 1;
              year = date[0];
            }

            if (format === 'YYYY-dd-MM' || format === 'YYYY/dd/MM') {
              day = date[1];
              month = date[2] - 1;
              year = date[0];
            }
          }
          return new Date(year, month, day);
        }
        return null;
      },

      replace (date, format) {
        format = format || this.formatDate;
        date = this.standar(date, format);
        let monthLiteral = format.indexOf('MMM') !== -1;
        return Util.replace(format,
          ['dddd', 'ddd', 'dd', monthLiteral ? 'MMM' : 'MM', 'YYYY', 'HH', 'mm', 'ss'],
          [
            this.dayslong[date.getDay()],
            this.days[date.getDay()],
            // (date.getDate() < 10 ? '0' : '') + date.getDate(),
            (date.getUTCDate() < 10 ? '0' : '') + date.getUTCDate(),
            // monthLiteral ? this.months[date.getMonth()] : ((date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1)),
            monthLiteral ? this.months[date.getUTCMonth()] : ((date.getUTCMonth() + 1 < 10 ? '0' : '') + (date.getUTCMonth() + 1)),
            // date.getFullYear(),
            date.getUTCFullYear(),
            (date.getHours() < 10 ? '0' : '') + date.getHours(),
            (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(),
            (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
          ]
        );
      },

      last (date) {
        let now = new Date();
        let days = this.daysBetweenTwoDates(date, now);
        if (days > 31) {
          return this.dateLiteral(date);
        } else {
          if (days > 7) {
            let weeks = parseInt(days / 7);
            return 'Hace ' + weeks + ' semana' + (weeks > 1 ? 's' : '');
          } else {
            if (days >= 1) {
              return this.format(date, 'ddd a la(s) HH:mm');
            } else {
              let hours = this.hoursBetweenTwoDates(date, now);
              if (this.isYesterday(date, hours)) {
                return 'Ayer a la(s) ' + this.time(date);
              } else {
                if (hours >= 1) {
                  return 'Hace ' + hours + ' hora' + (hours > 1 ? 's' : '');
                } else {
                  let minutes = this.minutesBetweenTwoDates(date, now);
                  if (minutes >= 1) {
                    return 'Hace ' + minutes + ' minuto' + (minutes > 1 ? 's' : '');
                  } else {
                    let seconds = this.secondsBetweenTwoDates(date, now);
                    return 'Hace ' + seconds + ' segundo' + (seconds > 1 ? 's' : '');
                  }
                }
              }
            }
          }
        }
      },

      secondsBetweenTwoDates (date1, date2, absolute) {
        return this.betweenTwoDates(date1, date2, 's', absolute);
      },

      minutesBetweenTwoDates (date1, date2, absolute) {
        return this.betweenTwoDates(date1, date2, 'i', absolute);
      },

      hoursBetweenTwoDates (date1, date2, absolute) {
        return this.betweenTwoDates(date1, date2, 'h', absolute);
      },

      daysBetweenTwoDates (date1, date2, absolute) {
        return this.betweenTwoDates(date1, date2, 'd', absolute);
      },

      betweenTwoDates (date1, date2, type, absolute) {
        let types = {s: 1000, i: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000};
        let diff = parseInt((this.standar(date2).getTime() - this.standar(date1).getTime()) / types[type]);

        if (typeof absolute !== 'undefined' && absolute !== false) {
          return Math.abs(diff);
        }
        return diff;
      },

      isYesterday (date, hours) {
        if (this.isDate(date)) {
          date = date.split(' ');
          let time = date[1].split(':');
          return hours >= parseInt(time[0]);
        }
        return false;
      },

      parseDate (date) {
        return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/');
      },

      setDate (key, value) {
        store.commit('setAction', {
          action: 'setDateValue',
          value,
          key
        });
      },

      sanitizeDateString (dateString, type = 'date') {
        const [year, month = 1, date = 1] = dateString.split('-');
        return `${year}-${pad(month)}-${pad(date)}`.substr(0, { date: 10, month: 7, year: 4 }[type]);
      }
    };

    Vue.prototype.$datetime = DatetimeService;
  }
};
