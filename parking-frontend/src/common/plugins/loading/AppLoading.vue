<template>
  <div id="app-loading" class="app-loading">
    <v-progress-circular indeterminate :size="50" color="warning"></v-progress-circular>
    <span class="app-loading-message"></span>
  </div>
</template>

<script>
export default {
  methods: {
    show (message = 'Cargando') {
      let loading = document.getElementById('app-loading');
      if (loading) {
        loading.style.display = 'flex';
        loading.querySelector('span').innerHTML = message;
      }
    },
    hide () {
      let loading = document.getElementById('app-loading');
      if (loading) {
        loading.style.display = 'none';
        loading.querySelector('span').innerHTML = '';
      }
    }
  }
};
</script>

<style lang="scss">
@import '../../../assets/scss/_variables.scss';
.app-loading {
  background-color: rgba(darken($primary, 20%), 0.8);
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10000;
  justify-content: center;
  align-items: center;

  .progress-circular {
    margin: 0 10px 0 0;
  }

  .app-loading-message {
    color: #eee;
    font-size: 2rem;
  }
}
</style>
