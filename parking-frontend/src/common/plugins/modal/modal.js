'use strict';

import store from '@/store';
import modal from './mixins/modal';

export default {
  store,
  install (Vue) {
    const Modal = {
      alert (text = 'Mensaje...', callback) {
        let alert = store.state.alert;
        alert.show = true;
        alert.text = text;

        document.addEventListener('keydown', modal.methods.bloquear, false);

        if (typeof callback === 'function') {
          alert.callback = callback;
        }
      },

      confirm (text = 'Mensaje...', callbackOk, callbackCancel, textOk = 'Aceptar', textCancel = 'Cancelar') {
        let confirm = store.state.confirm;
        confirm.show = true;
        confirm.text = text;
        confirm.textOk = textOk;
        confirm.textCancel = textCancel;

        document.addEventListener('keydown', modal.methods.bloquear, false);

        if (typeof callbackOk === 'function') {
          confirm.callbackOk = callbackOk;
        }

        if (typeof callbackCancel === 'function') {
          confirm.callbackCancel = callbackCancel;
        }
      }
    };

    Vue.prototype.$alert = Modal.alert;
    Vue.prototype.$confirm = Modal.confirm;
  }
};
