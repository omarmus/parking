<template>
  <div class="select-date" :class="{ 'select-date-label': label.length }">
    <label v-if="label.length" class="select-date-title">{{ label }}</label>
    <v-layout row wrap>
      <v-flex xs4>
        <v-text-field
        label="Día"
        v-model="form.day"
        maxlength="2"
        @keydown.native="$filter.numeric($event)"
        :rules="required ? $validate(['required']) : []"
        :required="required"
        :disabled="disabled"
        ></v-text-field>
      </v-flex>
      <v-flex xs4>
        <v-text-field
        label="Mes"
        v-model="form.month"
        maxlength="2"
        @keydown.native="$filter.numeric($event)"
        :rules="required ? $validate(['required']) : []"
        :required="required"
        :disabled="disabled"
        ></v-text-field>
      </v-flex>
      <v-flex xs4>
        <v-text-field
        label="Año"
        v-model="form.year"
        maxlength="4"
        @keydown.native="$filter.numeric($event)"
        :rules="required ? $validate(['required']) : []"
        :required="required"
        :disabled="disabled"
        ></v-text-field>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import validate from '@/common/mixins/validate';

export default {
  mixins: [ validate ],
  props: {
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    model: {
      type: String,
      default: ''
    },
    store: {
      type: String,
      default: ''
    },
    maxYear: {
      type: Number,
      default: 2100
    },
    value: {
      type: Date,
      default: null
    }
  },
  mounted () {
    if (this.$datetime.isDate(this.value)) {
      this.setValueDefault(this.value);
    }
  },
  data () {
    return {
      form: {
        day: '',
        month: '',
        year: ''
      },
      meses: this.$datetime.months
    };
  },
  methods: {
    setDate () {
      if (this.form.year && this.form.year.length === 4 && this.form.month && this.form.day) {
        let date = new Date(this.form.year, this.form.month - 1, this.form.day);
        this.$store.commit('setDate', this.model.length ? { [this.model]: date } : date);
        this.setValue(date);
      } else {
        this.$store.commit('setDate', this.model.length ? { [this.model]: null } : null);
        this.setValue();
      }
    },
    setValue (value = null, key) {
      if (this.model.length && this.store.length) {
        this.$store.commit(`${this.store}updateField`, { path: this.model, value });
      }
      if (key) {
        this.$store.commit('setDate', { [key]: value });
      }
    },
    setValueDefault (value) {
      const { day, month, year } = this.$datetime.getDate(value);
      this.form.day = day;
      this.form.month = month;
      this.form.year = year;
      setTimeout(() => {
        this.$store.commit('setDate', this.model.length ? { [this.model]: value } : value);
      });
    }
  },
  watch: {
    'form.day': function (val) {
      if (val) {
        if (val > 31 || (val.length === 2 && val <= 0)) {
          this.form.day = '';
        }
        this.setDate();
      }
    },
    'form.month': function (val) {
      if (val) {
        if (val > 12 || (val.length === 2 && val <= 0)) {
          this.form.month = '';
        }
        this.setDate();
      }
    },
    'form.year': function (val) {
      if (val) {
        if (val.length === 4 && (val > this.maxYear || val < 1900)) {
          this.form.year = '';
        }
        this.setDate();
      }
    },
    '$store.state.clean': function (val) {
      if (val === this.model) {
        this.form.year = '';
        this.form.month = '';
        this.form.day = '';
        this.$store.commit('setDate', this.model.length ? { [this.model]: null } : null);
      }
      this.$store.commit('cleanDate', false);
    },
    '$store.state.action': function (val) {
      if (val.action === 'setDateValue') {
        const { day, month, year } = this.$datetime.getDate(val.value);
        this.form.day = day;
        this.form.month = month;
        this.form.year = year;
        setTimeout(() => {
          this.setValue(val.value, val.key);
        }, 500);
      }
    }
  }
};
</script>

<style lang="scss">
  .select-date.select-date-label {
    position: relative;
    margin-top: -4px;

    .select-date-title {
      position: absolute;
      color: rgba(0,0,0,0.5);
      font-size: 0.9rem;
      top: -8px;
    }
  }
</style>
