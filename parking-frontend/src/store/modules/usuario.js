'use strict';

import { getField, updateField } from 'vuex-map-fields';

const form = {
  id: '',
  usuario: '',
  contrasena: '',
  email: '',
  cargo: '',
  estado: '',
  id_entidad: '',
  id_rol: '',
  id_persona: '',
  tipo_documento: '',
  tipo_documento_otro: '',
  nro_documento: '',
  fecha_nacimiento: '',
  nombres: '',
  primer_apellido: '',
  segundo_apellido: '',
  nombre_completo: '',
  telefono: '',
  movil: '',
  nacionalidad: '',
  pais_nacimiento: '',
  genero: '',
  estado_persona: '',
  persona: null
};

const layout = {
  namespaced: true,
  state: {
    form
  },
  getters: {
    getField
  },
  mutations: {
    updateField,
    cleanForm (state) {
      state.form = form;
    },
    setForm (state, data) {
      for (let key in data) {
        state.form[key] = data[key];
      }
    }
  }
};

export default layout;
