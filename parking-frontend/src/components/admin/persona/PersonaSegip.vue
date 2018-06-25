<template>
  <div>
    <v-layout row wrap>
      <v-flex xs4>
        <v-select
          :items="tiposDoc"
          v-model="tipo_documento"
          label="Tipo de documento"
          item-text="text"
          item-value="value"
          :rules="$validate(['required'])"
          required
          :disabled="!!persona"
          ></v-select>
      </v-flex>
      <v-flex xs3>
        <v-text-field
          label="Número de documento"
          v-model="nro_documento"
          maxlength="20"
          @keydown.native="$filter.numeric($event)"
          :rules="$validate(['required'])"
          required
          :disabled="!!persona"
          ></v-text-field>
      </v-flex>
      <v-flex :class="enabledFecha ? 'xs5' : 'xs3'">
        <select-date
          label="Fecha de nacimiento"
          model="form.fecha_nacimiento"
          :store="store"
          :required="!enabledFecha"
          :disabled="enabledFecha ? false: !!persona"
          :max-year="parseInt(this.$datetime.now('YYYY'))"
        >
        </select-date>
      </v-flex>
      <v-flex xs2 v-if="!enabledFecha">
        <v-btn
          v-if="persona"
          @click="cambiar"><v-icon>compare_arrows</v-icon> Cambiar</v-btn>
        <v-btn
          color="info"
          v-if="!persona"
          :disabled="$filter.empty(tipo_documento) || $filter.empty(nro_documento) || $filter.empty(fecha_nacimiento) || loading"
          @click="buscarPersona"><v-icon>search</v-icon> Buscar</v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import SelectDate from '@/common/util/SelectDate';
import validate from '@/common/mixins/validate';
import { mapFields } from 'vuex-map-fields';

export default {
  mixins: [ validate ],
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
  data () {
    return {
      tiposDoc: [
        { value: 'CI', text: 'CÉDULA DE IDENTIDAD' },
        { value: 'PASAPORTE', text: 'PASAPORTE' }
      ],
      loading: false
    };
  },
  beforeCreate () {
    // Creando campos del formulario en el store definido en props
    let store = this.$options.propsData.store || '';
    this.$options.computed = {
      ...mapFields([
        'form.tipo_documento',
        'form.tipo_documento_otro',
        'form.nro_documento',
        'form.persona',
        'form.fecha_nacimiento'
      ], `${store}getField`, `${store}updateField`)
    };
  },
  methods: {
    buscarPersona () {
      this.$loading.show('Buscando persona');
      this.loading = true;
      let url = `system/persona-segip/${this.nro_documento}?fechaNacimiento=${this.$datetime.format(this.fecha_nacimiento)}`;
      if (this.db) {
        url += `&tipoDoc=${this.tipo_documento}`;
        url += '&db=true';
      }
      this.$service.get(url)
      .then(response => {
        this.loading = false;
        if (response && response.persona) {
          const persona = response.persona;
          this.$store.commit(`${this.store}setForm`, {
            primer_apellido: persona.paterno,
            segundo_apellido: persona.materno,
            nombres: persona.nombres,
            nacionalidad: persona.nacionalidad,
            telefono: persona.telefono,
            movil: persona.movil,
            genero: persona.genero,
            id_persona: persona.id_persona,
            persona: persona
          });
        }
      });
    },
    cambiar () {
      this.$store.commit(`${this.store}setForm`, {
        primer_apellido: '',
        segundo_apellido: '',
        nombres: '',
        nacionalidad: '',
        tipo_documento: '',
        tipo_documento_otro: '',
        nro_documento: '',
        fecha_nacimiento: '',
        telefono: '',
        movil: '',
        genero: '',
        persona: null
      });
      this.$store.commit('cleanDate', 'form.fecha_nacimiento');
    }
  },
  components: {
    SelectDate
  }
};
</script>
