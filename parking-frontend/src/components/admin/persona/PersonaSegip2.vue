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
      <v-flex xs3>
        <select-date
          label="Fecha de nacimiento"
          model="fecha_nacimiento"
          v-if="fecha_nacimiento"
          :required="true"
          :value="fecha_nacimiento"
          :disabled="!!persona"
          :max-year="parseInt(this.$datetime.now('YYYY'))"
        >
        </select-date>
      </v-flex>
      <v-flex xs2>
        <v-btn
          v-if="persona"
          @click="cambiar"><v-icon>compare_arrows</v-icon> Cambiar</v-btn>
        <v-btn
          :disabled="$filter.empty(tipo_documento) || $filter.empty(nro_documento) || $filter.empty($store.state.date.fecha_eleccion)"
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
    persona: {
      type: Object,
      default: null
    }
  },
  mounted () {
    if (this.persona) {
      this.tipo_documento = this.persona.tipo_documento;
      this.nro_documento = this.persona.nro_documento;
      this.fecha_nacimiento = null;
      this.$nextTick(() => {
        this.fecha_nacimiento = this.persona.fecha_nacimiento;
      });
    }
  },
  data () {
    return {
      tiposDoc: [
        { value: 'CI', text: 'CÉDULA DE IDENTIDAD' },
        { value: 'PASAPORTE', text: 'PASAPORTE' }
      ],
      primer_apellido: '',
      segundo_apellido: '',
      nombres: '',
      nacionalidad: '',
      tipo_documento: '',
      tipo_documento_otro: '',
      nro_documento: '',
      fecha_nacimiento: null,
      persona: null
    };
  },

  methods: {
    buscarPersona () {
      this.$service.get(`system/persona-segip/${this.nro_documento}?fechaNacimiento=${this.$datetime.format(this.$store.state.date.fecha_nacimiento)}`)
      .then(response => {
        if (response && response.persona) {
          const persona = response.persona;

          this.$bus.$emit('setPersona', {
            primer_apellido: persona.paterno,
            segundo_apellido: persona.materno,
            nombres: persona.nombres,
            nacionalidad: persona.nacionalidad,
            persona: persona
          });
        }
      });
    },
    cambiar () {
      this.primer_apellido = '';
      this.segundo_apellido = '';
      this.nombres = '';
      this.nacionalidad = '';
      this.tipo_documento = '';
      this.tipo_documento_otro = '';
      this.nro_documento = '';
      this.fecha_nacimiento = '';
      this.persona = '';
      this.$store.commit('cleanDate', 'fecha_nacimiento');
    }
  },
  components: {
    SelectDate
  }
};
</script>
