<template>
  <section>
    <h3 class="primary--text"><v-icon color="primary">home</v-icon> Entrada/Salida de Vehículos</h3>
    <v-card>
      <reloj></reloj>
      <v-form
        ref="form"
        lazy-validation
        v-model="valid"
        @submit="registrar">
        <v-card-text class="in-out" :class="{ 'success': tipo === 'ENTRADA', 'warning': tipo === 'SALIDA' }">
          <v-container grid-list-xl fluid class="pt-0 pb-0">
            <v-flex xs12>
              <v-radio-group v-model="tipo" row>
                <v-radio
                  color="warning"
                  label="ENTRADA VEHÍCULO"
                  class="white--text"
                  value="ENTRADA"></v-radio>
                <v-radio
                  color="red"
                  label="SALIDA VEHÍCULO"
                  class="white--text"
                  value="SALIDA"></v-radio>
              </v-radio-group>
            </v-flex>
          </v-container>
        </v-card-text>
        <v-card-text>
          <v-container grid-list-xl fluid class="pt-0">
            <v-layout wrap v-if="tipo === 'ENTRADA'">
              <v-flex xs4>
                <v-select
                  :loading="loading"
                  :items="items"
                  :rules="$validate(['required'])"
                  :search-input.sync="search"
                  v-model="form.placa"
                  label="Placa"
                  autocomplete
                  cache-items
                  :multiple="false"
                  combobox
                  required
                  class="uppercase"
                >
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      class="uppercase"
                      :selected="data.selected"
                      close
                      @input="remove(data.item)"
                    >
                      <strong>{{ data.item }}</strong>
                    </v-chip>
                  </template>
                </v-select>
              </v-flex>
              <v-flex xs2 class="checkbox-space">
                <v-checkbox
                  label="Dejó llave"
                  v-model="form.llave"
                ></v-checkbox>
              </v-flex>
              <v-flex xs4>
                <v-btn
                  type="submit"
                  large
                  color="primary">
                  <v-icon>keyboard_arrow_right</v-icon> Registrar
                </v-btn>
              </v-flex>
            </v-layout>
            <v-layout wrap v-else>
              <v-flex xs4>
                <v-text-field
                  label="Número de registro"
                  v-model="form.registro"
                  :autofocus="focusR"
                  :rules="$validate(['required'])"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-btn
                  type="submit"
                  large
                  color="primary">
                  <v-icon>check</v-icon> Terminar
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-form>
    </v-card>
    <v-dialog v-model="dialog" max-width="480" persistent>
      <v-card>
        <v-card-title class="headline">
          <v-icon>print</v-icon> Boletas
          <v-spacer></v-spacer>
          <v-btn @click.native="dialog = false"><v-icon>close</v-icon> Cerrar</v-btn>
          <v-btn @click.native="print" color="primary"><v-icon>print</v-icon> Imprimir</v-btn>
        </v-card-title>
        <v-card-text class="pt-0">
          <div id="boleta" v-if="barcode">
            <div class="boleta elevation-1">
              <h3>ORIGINAL</h3>
              <div class="boleta-barcode">
                <barcode :value="barcode">
                  No se pudo generar el código de barras.
                </barcode>
              </div>
              <p><strong>Fecha:</strong> {{ $datetime.format(data.fecha_llegada) }} <strong>Hora:</strong> {{ data.hora_llegada }}</p>
              <p><strong>Dejó llave:</strong> {{ data.llave ? 'SI' : 'NO' }}</p>
              <p><strong>PLACA:</strong> {{ data.vehiculo_placa }}</p>
            </div>
            <div class="boleta elevation-1">
              <h3>COPIA</h3>
              <div class="boleta-barcode">
                <barcode :value="barcode">
                  No se pudo generar el código de barras.
                </barcode>
              </div>
              <p><strong>Fecha:</strong> {{ $datetime.format(data.fecha_llegada) }} <strong>Hora:</strong> {{ data.hora_llegada }}</p>
              <p><strong>Dejó llave:</strong> {{ data.llave ? 'SI' : 'NO' }}</p>
              <p><strong>PLACA:</strong> {{ data.vehiculo_placa }}</p>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog2" max-width="480" persistent>
      <v-card>
        <v-card-title class="headline">
          <v-icon>attach_money</v-icon> Pagar
          <v-spacer></v-spacer>
        </v-card-title>
        <v-form
          ref="form2"
          lazy-validation
          v-model="valid2">
          <v-card-text class="pt-0">
            <h3><strong>TOTAL:</strong> Bs. {{ form2.total }}</h3>
            <v-select
              :loading="loading2"
              :items="items2"
              :rules="$validate(['required'])"
              :search-input.sync="search2"
              v-model="form2.nit"
              label="NIT"
              autocomplete
              cache-items
              :multiple="false"
              combobox
              required
              class="uppercase"
            >
              <template slot="selection" slot-scope="data">
                <v-chip
                  class="uppercase"
                  :selected="data.selected"
                  close
                  @input="remove2(data.item)"
                >
                  <strong>{{ data.item }}</strong>
                </v-chip>
              </template>
            </v-select>
            <v-text-field
              class="uppercase"
              label="Razón social"
              v-model="form2.razon_social"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" @click="pagar" color="primary"><v-icon>attach_money</v-icon> Pagar</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import VueBarcode from 'vue-barcode';
import Reloj from '@/components/parking/movimiento/Reloj';
import validate from '@/common/mixins/validate';

const css = `
@media print {
  .boleta {
    font-family: Arial, Helvetica, sans-serif;
    padding: 20px 20px 15px;
    width: 100%;
    max-width: 300px;
    margin: 0 auto 10px;
  }
  .boleta h3 {
    font-size: 1rem;
    margin: 0;
    text-align: center;
    line-height: 1rem;
  }
  .boleta p {
    margin: 0 0 5px;
  }
  .boleta-barcode {
    text-align: center;
    margin-bottom: 5px;
  }
}
`;

export default {
  mixins: [ validate ],
  data () {
    return {
      dialog: false,
      dialog2: false,
      barcode: null,
      tipo: 'ENTRADA',
      form: {
        registro: '',
        placa: null,
        llave: false
      },
      form2: {
        nit: null,
        razon_social: '',
        id_pago: null,
        total: 0
      },
      focusP: false,
      focusR: false,
      loading: false,
      loading2: false,
      items: [],
      items2: [],
      search: null,
      search2: null,
      valid: false,
      valid2: false,
      data: null
    };
  },
  methods: {
    getPlacas (placa) {
      this.loading = true;
      this.$service.graphql({
        query: `
          query ($placa: String) {
            vehiculos (placa: $placa, limit: 10) {
              count
              rows {
                id
                placa
              }
            }
          }
        `,
        variables: {
          placa: placa.toUpperCase()
        }
      }).then(response => {
        if (response && response.vehiculos) {
          let items = [];
          response.vehiculos.rows.map(item => {
            items.push(item.placa);
          });
          this.items = items;
          this.loading = false;
        }
      });
    },
    getNits (nit) {
      this.loading2 = true;
      this.$service.graphql({
        query: `
          query ($nit: String) {
            pagos (nit: $nit, limit: 10) {
              count
              rows {
                id
                nit
                razon_social
              }
            }
          }
        `,
        variables: {
          nit: nit.toUpperCase()
        }
      }).then(response => {
        if (response && response.pagos) {
          console.log(response.pagos);
          let items = [];
          response.pagos.rows.map(item => {
            items.push({
              value: item.nit,
              text: item.nit,
              title: item.razon_social
            });
          });
          this.items2 = items;
          this.loading2 = false;
        }
      });
    },
    remove (item) {
      this.form.placa = null;
    },
    remove2 (item) {
      this.form2.nit = null;
    },
    registrar () {
      if (this.$refs.form.validate()) {
        if (this.tipo === 'ENTRADA') {
          let data = Object.assign({}, this.form);
          delete data.registro;
          if (Array.isArray(data.placa) && data.placa[0]) {
            data.placa = data.placa[0];
          }
          data.placa = data.placa.toUpperCase();
          this.$service.graphql({
            query: `
              mutation add($movimiento: NewMovimiento!) {
                movimientoAdd(movimiento: $movimiento) {
                  id
                  nuevo
                  fecha_llegada
                  hora_llegada
                  llave
                  vehiculo_placa
                }
              }
            `,
            variables: {
              movimiento: data
            }
          }).then(response => {
            if (response && response.movimientoAdd) {
              this.form = {
                registro: '',
                placa: null,
                llave: false
              };
              this.barcode = null;
              this.$nextTick(() => {
                this.barcode = this.pad(response.movimientoAdd.id, 10);
              });
              this.data = response.movimientoAdd;
              this.dialog = true;
              this.$message.success();
            }
          });
        } else {
          this.$service.graphql({
            query: `
              mutation edit($id: Int!, $movimiento: EditMovimiento!) {
                movimientoEdit(id: $id, movimiento: $movimiento) {
                  id
                  estado
                  total
                  id_pago
                }
              }
            `,
            variables: {
              id: parseInt(this.form.registro),
              movimiento: {}
            }
          }).then(response => {
            if (response) {
              this.form.registro = '';
              let mov = response.movimientoEdit;
              if (mov.estado === 'SALIDA' && mov.id_pago) {
                this.dialog2 = true;
                this.form2 = {
                  id_pago: mov.id_pago,
                  total: mov.total
                };
                this.$message.success();
              } else {
                this.$message.warning('Ya se realizó el registro anteriormente.');
              }
            }
          });
        }
      }
    },
    pad (n, width, z = '0') {
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    },
    print () {
      let html = document.getElementById('boleta').innerHTML;
      this.$util.print(html, css);
    },
    pagar () {
      if (this.$refs.form2.validate()) {
        this.$service.graphql({
          query: `
            mutation edit($id: Int!, $pago: EditPago!) {
              pagoEdit(id: $id, pago: $pago) {
                id
              }
            }
          `,
          variables: {
            id: this.form2.id_pago,
            pago: {
              nit: this.form2.nit,
              razon_social: (this.form2.razon_social || '').toUpperCase()
            }
          }
        }).then(response => {
          if (response) {
            this.$message.success('Se realizó el pago correspondiente');
            this.dialog2 = false;
          }
        });
      }
    }
  },
  watch: {
    tipo: function (val) {
      if (val === 'ENTRADA') {
        this.focusP = true;
        this.focusR = false;
      }
      if (val === 'SALIDA') {
        this.focusP = false;
        this.focusR = true;
      }
    },
    search (val) {
      val && this.getPlacas(val);
    },
    search2 (val) {
      val && this.getNits(val);
    },
    'form2.nit': function (val) {
      console.log('select NIT', val);
      for (let i in this.items2) {
        if (val === this.items2[i].value) {
          this.form2.razon_social = this.items2[i].title;
          break;
        }
      }
    }
  },
  components: {
    barcode: VueBarcode,
    Reloj
  }
};
</script>

<style lang="scss">
.checkbox-space {
  .checkbox {
    padding-top: 25px;
    min-width: auto;
  }
}
.in-out {
  .radio {
    label {
      color: white !important;
      font-weight: 600;
      font-size: 1.4rem;
      line-height: 24px;
    }
  }
}
.boleta {
  padding: 20px 20px 15px;
  width: 100%;
  max-width: 300px;
  margin: 0 auto 10px;

  .boleta-barcode {
    text-align: center;
    margin-bottom: 5px;
  }

  h3 {
    font-size: 1rem;
    margin: 0;
    text-align: center;
    line-height: 1rem;
  }

  p {
    margin: 0 0 5px;
  }
}
.uppercase {
  input, strong {
    text-transform: uppercase;
  }
}
</style>
