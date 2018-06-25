'use strict';

import axios from 'axios';
import errorsLangEs from '@/common/lang/es/errors';
import errorsLangEn from '@/common/lang/en/errors';
import errorsLangAy from '@/common/lang/ay/errors';
import Auth from '@/components/admin/auth/mixins/auth';
import store from '@/store';
import router from '@/router';

const protocol = location.protocol.replace(':', '');
const PATERN_HOST = protocol === 'https' ? /(https:\/\/|www\.)\S+/i : /(http:\/\/|www\.)\S+/i;

export default {
  store,
  router,
  install: (Vue, config) => {
    // config
    const apiUrl = config && config.apiUrl ? config.apiUrl : '';
    const graphqlUrl = config && config.graphqlUrl ? config.graphqlUrl : '';
    const authUrl = config && config.authUrl ? config.authUrl : '';
    const authToken = config && config.authToken ? config.authToken : 'Bearer';

    // Plugins
    let instance = new Vue({
      mixins: [ Auth ]
    });
    const Util = instance.$util;
    const Message = instance.$message;
    const Storage = instance.$storage;
    const Loading = instance.$loading;

    const languages = {
      'es': errorsLangEs,
      'en': errorsLangEn,
      'ay': errorsLangAy
    };

    function t (key) {
      let lang = Storage.get('lang') || process.env.LANG;
      return languages[lang][key];
    }

    const Services = {
      options (url) {
        return _http('get', url + '/fields');
      },

      get (url, id) {
        return _http('get', url, id);
      },

      post (url, data) {
        return _http('post', url, data);
      },

      put (url, data) {
        return _http('put', url, data);
      },

      patch (url, data) {
        return _http('patch', url, data);
      },

      delete (url, id) {
        return _http('delete', url, id);
      },

      remove (url, id) {
        return this.delete(url, id);
      },

      list (url, query) {
        query = query ? '?' + Util.serialize(query) : '';
        return _http('get', url + query);
      },

      save (url, data) {
        return _http(data.id ? 'put' : 'post', url, data);
      },

      file (url, type, data = {}) {
        url = getUrl(url);
        return axios.post(url, data, { responseType: 'arraybuffer' })
        .then(response => {
          if (response.data) {
            let file = new window.Blob([response.data], { type: type });
            let fileURL = window.URL.createObjectURL(file);
            // return $sce.trustAsResourceUrl(fileURL);
            return fileURL;
          }
          return null;
        }).catch(error => handlingErrors(error));
      },

      pdf (url, data = {}, onlyUrl) {
        url = getUrl(url, data);
        return axios.post(url, data, { responseType: 'arraybuffer' })
        .then(response => {
          if (response.data) {
            let file = new window.Blob([response.data], { type: 'application/pdf' });
            let fileURL = window.URL.createObjectURL(file);
            // return onlyUrl ? fileURL : $sce.trustAsResourceUrl(fileURL);
            return fileURL;
          }
          return null;
        }).catch(error => handlingErrors(error));
      },

      graphql (data) {
        let setting = {
          method: 'post',
          url: graphqlUrl,
          data
        };

        // Set token in headers
        if (Storage.exist('token')) {
          setting.headers = {'Authorization': `${authToken} ${Storage.get('token')}`};
        }
        instance.$Progress.start();
        return axios(setting)
        .then(response => {
          instance.$Progress.finish();
          Loading.hide();
          console.log('Respuesta Graphql', response.data);
          if (response.data.errors) {
            parseErrorGraphql(response.data);
          } else {
            return response.data.data;
          }
        })
        .catch(error => {
          instance.$Progress.finish();
          Loading.hide();
          if (error.response && error.response.data) {
            let data = error.response.data;
            parseErrorGraphql(data);
          }
        });
      }
    };

    function parseErrorGraphql (data) {
      if (Util.toType(data.errors) === 'array') {
        let msg = [];
        data.errors.map(el => {
          if (el.message.indexOf('NOT_AUTHORIZED') !== -1) {
            if (el.message === 'NOT_AUTHORIZED:READ') {
              store.state.state403 = true;
              router.push('403');
            } else {
              Message.error('No tiene permisos para realizar esta operación.');
            }
          } else {
            let message = '<p>';
            if (el.name) {
              message += `<strong>Error: </strong>${el.name} <br />`;
            }
            message += `<strong>Mensaje: </strong> ${el.message}</p>`;
            msg.push(message);
          }
        });
        Message.error(msg.join(''));
      }
    }

    function _http (method, url, data) {
      instance.$Progress.start();
      url = getUrl(url, data);
      if (process.env.DEBUG_MODE) {
        console.group('Petición con DataService:');
        console.info('URL:', method.toUpperCase(), url);
        if (data) {
          console.info('Params:', data);
        }
      }

      let setting = {
        method,
        url
      };

      if (typeof data === 'object' && Object.keys(data).length) {
        delete data.id;
        setting.data = data;
      }

      // Set token in headers
      if (Storage.exist('token')) {
        setting.headers = {'Authorization': `${authToken} ${Storage.get('token')}`};
      }

      return axios(setting)
      .then(response => filterResponse(response.data))
      .catch(error => handlingErrors(error));
    }

    function getUrl (url, id) {
      id = (typeof id === 'string' || typeof id === 'number') ? `${id}` : typeof id === 'object' && id.id ? `${id.id}` : '';
      if (url[url.length - 1] !== '/' && id.length > 1) {
        id = `/${id}`;
      }
      return PATERN_HOST.test(url) ? (url + id) : apiUrl + url + id;
    }

    function filterResponse (response) {
      instance.$Progress.finish();
      Loading.hide();
      let data = response.data || response.datos || response;
      if (process.env.DEBUG_MODE) {
        console.info('Respuesta:');
        if (Util.toType(data) === 'array') {
          if (window.navigator.appName === 'Netscape') {
            console.log('firefox');
            console.table(data);
          } else {
            console.table(data.map(item => [item]));
          }
        } else {
          console.dir(data);
        }
        console.groupEnd();
      }
      if (config && typeof config.filterResponse === 'function') {
        return config.filterResponse(response, Message);
      }
      if (data.error) {
        Message.error(data.error);
        return null;
      } else if (data.warning) {
        Message.warning(data.warning);
        return null;
      } else {
        return data;
      }
    }

    function handlingErrors (error) {
      instance.$Progress.fail();
      if (error.response) {
        let status = error.response.status;
        let data = error.response.data;
        let states = [401, 403, 500]; // Estados que no mostrarán mensajes

        if (states.indexOf(status) === -1) {
          if (status === 408 || status === 504) {
            return data;
          } else if (errorsLangEs[status]) {
            Message.error(parseError(data) || t('status') || t('unknown'));
          } else {
            Message.error(parseError(data) || t('unknown'));
          }
        }
      } else if (error.message) {
        if (error.message === 'Network Error') {
          Message.error(t('connection'));
        } else {
          Message.error(error.message);
        }
      } else {
        Message.error(t('unknown'));
      }
    }

    function parseError (data) {
      let message = 'mensaje';
      if (config && config.errorFormat) {
        message = config.errorFormat;
      }
      if (data[message]) {
        console.log('Error', data[message], Util.toType(data[message]));
        if (Util.toType(data[message]) === 'array') {
          let errors = [];
          data[message].map(el => {
            errors.push(el.error);
          });
          return errors.join('<br>');
        }
        return data[message];
      }
      return null;
    }

    // INTERCEPTORS CONFIG
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
      // Actualizando el tiempo de sesión de inactividad
      if (store.state.time) {
        store.commit('SET_TIME', process.env.TIME_SESSION_EXPIRED * 60);
      }
      return config;
    }, function (error) {
      return Promise.reject(error);
    });

    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
      return response;
    }, function (error) {
      Loading.hide();
      if (error.response) {
        if (error.response.status === 401) {
          if (window.location.hash !== '#/login') {
            Message.error(t('sessionExpired'));
            instance.logout(store, router, Loading);
          }
        }
        if (error.response.status === 403) {
          store.commit('setState403', true);
          router.push('/403');
        }
        if (error.response.status === 500) {
          let data = error.response.data;
          let message = null;
          if (process.env.DEBUG_MODE) {
            if (data.mensaje || data.message) {
              message = data.mensaje || data.message;
            } else if (typeof data === 'object') {
              let text = [];
              for (let key in data) {
                text.push(`${key}: ${data[key]}`);
              }
              message = text.join('<br />');
            }
          }
          store.state.message = message;
          router.push('/500');
        }
      }
      return Promise.reject(error);
    });

    Vue.prototype.$service = Services;
    Vue.prototype.$http = axios;
    Vue.prototype.$apiUrl = apiUrl;
    Vue.prototype.$authUrl = authUrl;
    Vue.prototype.$authToken = authToken;
  }
};
