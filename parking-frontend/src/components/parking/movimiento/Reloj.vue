<template>
  <div class="clock-container">
    <div id="clock">
      <p class="time">{{ time }}</p>
      <p class="date">{{ date }}</p>
    </div>
  </div>
</template>
<script>
var week = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

export default {
  data () {
    return {
      time: '',
      date: '',
      timerID: null
    };
  },
  mounted () {
    this.timerID = window.setInterval(this.updateTime, 1000);
    this.updateTime();
  },
  destroyed () {
    window.clearInterval(this.timerID);
  },
  methods: {
    zeroPadding (num, digit) {
      let zero = '';
      for (var i = 0; i < digit; i++) {
        zero += '0';
      }
      return (zero + num).slice(-digit);
    },
    updateTime () {
      var cd = new Date();
      this.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2);
      this.date = week[cd.getDay()] + ' ' + this.zeroPadding(cd.getDate(), 2) + '/' + this.zeroPadding(cd.getMonth() + 1, 2) + '/' + this.zeroPadding(cd.getFullYear(), 4);
    }
  }
};
</script>

<style lang="scss">
.clock-container {
  background: #0f3854;
  background: radial-gradient(ellipse at center,  #0a2e38  0%, #000000 70%);
  background-size: 100%;
  position: relative;
}

#clock {
  color: #ffffff;
  text-align: center;
  color: #daf6ff;
  text-shadow: 0 0 20px rgba(10, 175, 230, 1),  0 0 20px rgba(10, 175, 230, 0);

  .time {
    letter-spacing: 0.05em;
    font-size: 80px;
    margin: 0;
    line-height: 70px;
    padding: 20px 0 0;
  }

  .date {
    letter-spacing: 0.1em;
    font-size: 24px;
    margin: 0;
    padding: 0 0 20px;
  }
}
</style>
