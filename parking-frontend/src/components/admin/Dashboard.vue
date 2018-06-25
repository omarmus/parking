<template>
  <section>
    <h3 class="primary--text"><v-icon color="primary">home</v-icon> Inicio</h3>
    <v-card>
      <v-card-text>
        <v-container>
          <v-layout>
            <v-flex md6>
              <v-btn large block color="success"><v-icon>keyboard_arrow_right</v-icon> Ingreso</v-btn>
            </v-flex>
            <v-flex md6>
              <v-btn large block color="warning"><v-icon>chevron_left</v-icon> Salida</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
        <input v-model="barcodeValue" /><br>
        <barcode :value="barcodeValue">
          No se pudo generar el código de barras.
        </barcode>
      </v-card-text>
    </v-card>
  </section>
</template>

<script>
import VueBarcode from 'vue-barcode';

export default {
  data () {
    return {
      barcodeValue: 'test'
    };
  },
  components: {
    'barcode': VueBarcode
  }
};
</script>
