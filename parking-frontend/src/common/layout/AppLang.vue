<template>
  <v-menu bottom left>
    <v-btn flat slot="activator" dark class="btn-lang">
      <span class="icon-flag" :class="{ 'es': lang.icon == 'es', 'en': lang.icon == 'en', 'ay': lang.icon == 'ay' }"></span> {{ lang.text }}
    </v-btn>
    <v-list>
      <v-list-tile v-for="item in languages" :key="item.title">
        <v-list-tile-title @click="selectLang(item)">
          <span class="icon-flag" :class="{ 'es': item.icon == 'es', 'en': item.icon == 'en', 'ay': item.icon == 'ay' }"></span> {{ item.text }}
        </v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
import Auth from '@/components/admin/auth/mixins/auth';
export default {
  mixins: [ Auth ],
  created () {
    let lang = this.$storage.get('lang') || process.env.LANG || 'es';

    this.$i18n.locale = lang;

    for (let i in this.languages) {
      if (this.languages[i].value === lang) {
        this.lang = this.languages[i];
        break;
      }
    }
  },
  data () {
    return {
      languages: [
        { value: 'es', text: 'Español', icon: 'es' },
        { value: 'ay', text: 'Aymara', icon: 'ay' },
        { value: 'en', text: 'English', icon: 'en' }
      ],
      lang: {}
    };
  },
  methods: {
    selectLang (item) {
      this.lang = item;
      this.$i18n.locale = item.value;
      this.$storage.set('lang', item.value);

      this.reload();
    }
  }
};
</script>

<style lang="scss">
.icon-flag {
  width: 16px;
  height: 16px;
  display: inline-block;
  margin-right: 5px;
  vertical-align: middle;
  background-size: cover;
  background-repeat: no-repeat;

  &.es {
    background-image: url(../../assets/images/es.png);
  }

  &.en {
    background-image: url(../../assets/images/en.png);
  }

  &.ay {
    background-image: url(../../assets/images/ay.png);
  }
}
.application .toolbar .btn-lang {
  color: rgba(0,0,0,0.87);
}
</style>
