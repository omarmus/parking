/* eslint no-useless-escape: "error" */

'use strict';

const Util = {

  toType (obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  },

  isJson (text) {
    // return /^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@')
    return /^[\],:{}\s]*$/.test(text.replace(/\\["\\/bfnrtu]/g, '@')
      // .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
      .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g, ']')
      .replace(/(?:^|:|,)(?:\s*\[)+/g, ''));
  },

  stripHTML (texto) {
    return texto.replace(/(<([^>]+)>)/ig, '');
  },

  /**
   * Función para crear una pausa para ejecutar una instrucción:
   *  Ejemplo:
   *
   *  let funcionConDelay = this.Util.debounce(function() {
   *      // ... lo que se quiere ejecutar con el retraso
   *  }, 1000);
   *
   *  funcionConDelay(); // Ejecutando el retraso
   */
  debounce (func, wait, immediate) {
    let timeout;
    return function () {
      let context = this;
      let args = arguments;
      let later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },

  fullscreen () {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(window.Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  },

  size (obj) {
    return Object.keys(obj).length;
  },

  serialize (json) {
    var string = [];
    for (var i in json) {
      string.push(i + '=' + json[i]);
    }
    return string.join('&');
  },

  getMenuOption (menu, url) {
    let items = [{ text: 'Inicio' }];
    for (var i in menu) {
      if (menu[i].submenu !== undefined) {
        var pages = menu[i].submenu;
        for (var j in pages) {
          if (pages[j].url === url) {
            items.push({ text: menu[i].label, disabled: false });
            items.push({ text: pages[j].label, disabled: false });
            return items;
          }
        }
      }
    }
    for (var k in menu) {
      if (menu[k].url === url) {
        items.push({ text: menu[k].label, disabled: false });
        return items;
      }
    }
    return items;
  },

  trimUrl (url) {
    if (url) {
      if (url[0] === '/') {
        url = url.substring(1);
      }
    }
    return url;
  },

  getKeys (data) {
    var types = {};

    data.map((el) => {
      types[el.key] = el;
    });

    return types;
  },

  /**
   * Public: funcion que retrasa la ejecucion de una funcion, y que al volverse a activar reinicia el timeout
   * @param {Object} obj  objeto que guardara la referencia del intervalo
   * @param {Integer} ms  tiempo en miliesgundos
   * @param {Function} func funcion callback
   * *
   * Ejemplo
    this.timer = {};
    this.Util.funcDelay(this.timer, 1000, ()=> {
      this.personalSave(form, per);
    })
   */
  funcDelay (obj, ms, func) {
    if (obj.timer_delay) {
      clearTimeout(obj.timer_delay);
    }

    obj.timer_delay = setTimeout(() => {
      obj.timer_delay = null;
      func();
    }, ms);
  },

  id (length = 5) {
    let zero = '';
    for (let i = 0, l = length; i < l; i++) {
      zero += '0';
    }
    return (zero + (Math.random() * Math.pow(36, length) << 0).toString(36)).slice(-1 * length);
  },

  replace (text, find, replace) {
    for (var i = 0, l = find.length, regex; i < l; i++) {
      regex = new RegExp(find[i], 'g');
      text = text.replace(regex, replace[i]);
    }
    return text;
  },

  insert (arr, index, item) {
    return arr.splice(index, 0, item);
  },

  removeItem (arr, item) {
    var i = arr.indexOf(item);
    i !== -1 && arr.splice(i, 1);
  },

  events () {
    // Fullscreen event and hack mozilla
    document.addEventListener('onkeyup', function (e) {
      if (e.keyCode === 27) {
        document.querySelector('body').classList.remove('fullscreen');
      }
    });

    document.addEventListener('mozfullscreenchange', function () {
      if (!document.mozFullScreen) {
        document.querySelector('body').classList.remove('fullscreen');
      }
    }, false);

    if (process.env.ONBEFOREUNLOAD) {
      window.onbeforeunload = function () {
        return '¿Está seguro de abandonar la página?.';
      };
    }
  }
};

export default {
  install: Vue => {
    Vue.prototype.$util = Util;
  }
};
