<template>
  <section>
    <v-layout row wrap>
      <persona-segip :store="store" :enabled-fecha="enabledFecha" :db="db"></persona-segip>
      <v-flex xs4>
        <v-text-field
          label="Nombre(s)"
          v-model="nombres"
          maxlength="100"
          :rules="$validate(['required'])"
          required
          :disabled="tipo_documento == 'CI' || enabledFecha"
          ></v-text-field>
      </v-flex>

      <v-flex xs4>
        <v-text-field
          label="Primer apellido"
          v-model="primer_apellido"
          maxlength="100"
          :disabled="tipo_documento == 'CI' || enabledFecha"
          ></v-text-field>
      </v-flex>

      <v-flex xs4>
        <v-text-field
          label="Segundo apellido"
          v-model="segundo_apellido"
          maxlength="100"
          :disabled="tipo_documento == 'CI' || enabledFecha"
          ></v-text-field>
      </v-flex>

      <v-flex xs4>
        <v-select
          :items="nacionalidades"
          v-model="nacionalidad"
          label="Nacionalidad"
          item-text="text"
          item-value="value"
          :rules="$validate(['required'])"
          required
          autocomplete
          ></v-select>
      </v-flex>

      <!-- <v-flex xs4>
        <v-select
          :items="paises"
          v-model="pais_nacimiento"
          label="País de nacimiento"
          item-text="text"
          item-value="id"
          :rules="$validate(['required'])"
          required
          autocomplete
          ></v-select>
      </v-flex> -->

      <v-flex xs4>
        <v-text-field
          label="Móvil"
          prepend-icon="smartphone"
          v-model="movil"
          maxlength="30"
          ></v-text-field>
      </v-flex>

      <v-flex xs4>
        <v-text-field
          label="Teléfono"
          prepend-icon="phone"
          v-model="telefono"
          maxlength="30"
          ></v-text-field>
      </v-flex>

      <v-flex xs4>
        <v-radio-group
          v-model="genero"
          row
          :rules="$validate(['required'])"
          required
        >
          <v-radio
            label="Mujer"
            value="F"
          ></v-radio>
          <v-radio
            label="Hombre"
            value="M"
          ></v-radio>
        </v-radio-group>
      </v-flex>
    </v-layout>
  </section>
</template>

<script>
import PersonaSegip from '@/components/admin/persona/PersonaSegip';
import validate from '@/common/mixins/validate';
import paises from '@/common/mixins/paises';
import { mapFields } from 'vuex-map-fields';

export default {
  mixins: [ validate, paises ],
  props: {
    store: {
      type: String,
      default: ''
    },
    enabledFecha: {
      type: Boolean,
      default: false
    },
    db: {
      type: Boolean,
      default: false
    }
  },
  created () {
    let items = this.getPaises();
    let paises = [];
    let nacionalidades = [];
    items.map(item => {
      paises.push({ value: item.pais, text: item.pais });
      nacionalidades.push({ value: item.nacionalidad, text: item.nacionalidad });
    });
    this.paises = paises;
    this.nacionalidades = nacionalidades;
  },
  data () {
    return {
      paises: [],
      nacionalidades: []
    };
  },
  beforeCreate () {
    // Creando campos del formulario en el store definido
    let store = this.$options.propsData.store || '';
    this.$options.computed = {
      ...mapFields([
        'form.nombres',
        'form.primer_apellido',
        'form.segundo_apellido',
        'form.telefono',
        'form.movil',
        'form.nacionalidad',
        'form.pais_nacimiento',
        'form.tipo_documento',
        'form.genero'
      ], `${store}getField`, `${store}updateField`)
    };
  },
  components: {
    PersonaSegip
  }
};
</script>
