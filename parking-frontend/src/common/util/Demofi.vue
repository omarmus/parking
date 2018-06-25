<template>
  <v-card class="demofi">
    <!-- <v-card-title class="headline">
      <v-icon left color="blue" large>security</v-icon> FIRMAR DOCUMENTO
    </v-card-title> -->
    <v-alert
      outline
      color="warning"
      v-if="!demofi_ejecutandose"
      :value="true" >
      <div class="text-xs-justify">
        <h3 class="headline warning--text"><v-icon>warning</v-icon> Atención.-</h3>
        <p>Demofi no se está ejecutando en su equipo o no tiene agregado el certificado de seguridad en su navegador, realice lo siguiente:</p>
        <p>1. Visite el siguiente enlace para su instalación y/o configuración. Presione <a target="_blank" href="http://test.local.agetic.gob.bo/firmador/#">aquí</a>.</p>
        <p class="m-0">2. Puede verificar que el certificado de seguridad de Demofi se encuentra instalado. Presione <a href="" @click.prevent="verCertificado()">aquí</a>.</p>
      </div>
    </v-alert>
    <v-alert
      outline
      color="info"
      icon="info"
      v-if="demofi_ejecutandose && !autenticado"
      :value="true">
      Ingrese el PIN de su Token para poder firmar el documento.
    </v-alert>
    <v-alert
      outline
      v-if="certificados.length"
      color="success"
      icon="check"
      :value="true">
      Token iniciado correctamente
    </v-alert>
    <v-card-text>
      <v-container grid-list-md>
        <v-form
          @submit.prevent="autenticar"
          ref="form"
          lazy-validation>
          <v-layout wrap v-if="!autenticado && !$store.state.pin">
            <v-flex xs7>
              <v-text-field
                label="Pin"
                type="password"
                prepend-icon="verified_user"
                :rules="$validate(['required'])"
                v-model="pin"
                :disabled="!token_conectado || autenticado"
                ></v-text-field>
            </v-flex>
            <v-flex xs5>
              <v-btn
                type="submit"
                color="primary"
                :disabled="!token_conectado || autenticado"> Autenticar
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
        <div v-if="certificados.length">
          <h4><v-icon>person</v-icon> Información del Token</h4>
          <div class="demofi-certificado">
            <p><strong>Nombre:</strong> {{ firmador.nombreComunSubject }}</p>
            <p><strong>Organización:</strong> {{ firmador.organizacionSubject }}</p>
            <p><em>Token válido desde el <strong>{{ firmador.inicioValidez }}</strong> hasta el <strong>{{ firmador.finValidez }}</strong></em></p>
          </div>
          <v-select
            v-if="certificados.length > 1"
            label="Certificado"
            :rules="$validate(['required'])"
            v-model="firmador"
            prepend-icon="person"
            class="p-b-0"
            :disabled="!autenticado"
            item-text="nombreComunSubject"
            item-value="alias"
            :items="certificados"
            ></v-select>
        </div>
      </v-container>
    </v-card-text>
    <v-card-actions v-show="false">
      <v-layout row>
        <v-flex xs12 center>
          <!-- <v-btn
            @click.native="$store.commit('closeModal',4)">
            <v-icon left>cancel</v-icon>Cancelar
          </v-btn> -->
          <v-btn
            v-if="certificados.length"
            id="btn-demofi-firm"
            color="success"
            @click="firmar"
            :disabled="!autenticado || firmando">
          <v-icon left>security</v-icon>Firmar</v-btn>
        </v-flex>
      </v-layout>
    </v-card-actions>
  </v-card>
</template>
<script>

import validate from '@/common/mixins/validate';

export default {
  props: {
    solicitud: {
      type: Object,
      default: () => {}
    },
    onSuccess: {
      type: Function,
      default: null
    }
  },
  mixins: [ validate ],
  created () {
    this.iniciado = false;
    if (this.solicitud && this.solicitud.id) {
      this.solicitudes = [{
        url_source_pdf: `${this.$apiUrl}eapostilla/apostilla/${this.solicitud.id_archivo}/${this.solicitud.id}`,
        nombre_archivo: 'documento.pdf',
        codigo_archivo: 'asada-adas-a-fwq-rfqw-rqasa-wrqw'
      }];
    }
    this.url = `https://localhost:3200`;
    this.urlTokens = `${this.url}/tokens`;
    this.urlStart = `${this.url}/start`;
    this.urlCerts = `${this.url}/certs`;
    this.urlSign = `${this.url}/sign`;
    this.urlFinish = `${this.url}/finish`;

    if (this.solicitud && this.solicitud.id) {
      this.verificarTokenConectado();
    }
  },
  data () {
    return {
      url: ``,
      noDemofi: `Demofi no se esta ejecutando en su equipo. Verifique que el programa se este ejecutando en su maquina.`,
      pin: null,
      tokens: [],
      certificados: [],
      firmados: 0,
      iniciado: false,
      iniciando: false,
      firmador: null,
      solicitudes: [],
      autenticado: false,
      autenticando: false,
      firmando: false,
      demofi_ejecutandose: false,
      token_conectado: false,
      boton_autenticar_habilitado: false,
      mostrar_progress: false
    };
  },
  methods: {
    listTokens () {
      return new Promise((resolve, reject) => {
        this.$http.get(this.urlTokens)
        .then(data => {
          if (data.finalizado === false) {
            reject(data);
          }
          resolve(data);
        })
        .catch(error => {
          console.error(error);
          reject(new Error(this.noDemofi));
        });
      });
    },
    login (pin) {
      return new Promise((resolve, reject) => {
        this.$http.get(`${this.urlStart}?pin=${pin}`)
        .then(data => {
          if (data.data.finalizado === false) {
            reject(data);
          } else {
            this.$store.commit('setPin', pin);
            resolve(data);
          }
        })
        .catch(error => {
          console.error(error);
          reject(new Error(this.noDemofi));
        });
      });
    },
    listCertificates () {
      return new Promise((resolve, reject) => {
        this.$http.get(this.urlCerts)
        .then(data => {
          if (data.data.finalizado === false) {
            reject(new Error(data));
          }
          resolve(data.data);
        })
        .catch(error => {
          console.error(error);
          reject(new Error(this.noDemofi));
        });
      });
    },
    sign (solicitudFirma, aliasParaFirmar) {
      return new Promise((resolve, reject) => {
        let infoFirma = JSON.stringify({
          nombre_archivo: solicitudFirma.nombre_archivo,
          pdf_base64: solicitudFirma.pdf_base64,
          alias: aliasParaFirmar
        });
        console.log('DEMOFI sign', infoFirma);
        this.$http.post(this.urlSign, infoFirma)
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          console.error(error);
          reject(new Error(`Demofi no se esta ejecutando en su equipo.`));
        });
      });
    },
    logout () {
      return new Promise((resolve, reject) => {
        this.$http.get(this.urlFinish)
        .then(data => {
          if (data.finalizado === false) {
            reject(new Error(data));
          }
          resolve(data);
        })
        .catch(error => {
          console.error(error);
          reject(new Error(this.noDemofi));
        });
      });
    },
    getFileBase64 (urlFile) {
      return new Promise((resolve, reject) => {
        this.$http.post(urlFile, this.certificados[0], {responseType: 'arraybuffer', headers: {Authorization: `Bearer ${this.$storage.get('token')}`}})
        .then(response => {
          if (response) {
            // eslint-disable-next-line
            let enBase64 = new Buffer(response.data, 'binary').toString('base64');
            resolve(enBase64);
          } else {
            reject(new Error('La respuesta es incorrecta'));
          }
        });
      });
    },
    verCertificado () { // ------------------------------ COMENZANDO CON LAS PANTALLAS
      const w = 800;
      const h = 400;
      const y = window.outerHeight / 2 + window.screenY - (h / 2);
      const x = window.outerWidth / 2 + window.screenX - (w / 2);
      window.open(`${this.url}`, `_blank`, `toolbar=no,status=no,menubar=no,scrollbars=yes,left=${x},top=${y},width=${w},height=${h},visible=none`, '');
    },

    verificarTokenConectado () {
      if (this.iniciando === false) {
        this.iniciando = true;
        this.listTokens()
        .then(response => {
          this.iniciando = false;
          this.iniciado = true;
          this.demofi_ejecutandose = true;
          this.tokens = response.data.datos;
          this.token_conectado = response.data.datos.length > 0;

          if (this.$store.state.pin) {
            this.pin = this.$store.state.pin;
            this.autenticar();
          }
        }).catch((error) => {
          this.iniciando = false;
          this.iniciado = true;
          this.token_conectado = false;
          this.demofi_ejecutandose = false;
          console.error(error);
        });
      }
    },
    autenticar () {
      if (this.$refs.form.validate()) {
        this.mostrar_progress = true;
        this.autenticando = true;
        this.login(this.pin)
        .then(respLogin => {
          this.mostrar_progress = false;
          this.autenticando = false;
          if (respLogin.data.finalizado === true) {
            this.boton_autenticar_habilitado = false;
            this.autenticado = true;// Obtener certificados
            this.listCertificates() // Una ves autenticado actualizamos la lista de certificados
            .then(respCert => {
              this.certificados = respCert.datos;
              if (respCert.datos.length === 1) {
                this.firmador = respCert.datos[0];
              }
            })
            .catch(error => {
              console.log(error);
            });
          }
        }).catch(error => {
          this.$message.error(error.data.mensaje || 'No se pudo acceder al token');
          this.mostrar_progress = false;
          this.autenticando = false;
          this.pin = null;
          this.autenticado = false;
          this.boton_autenticar_habilitado = true;
          console.log(error);
        });
      }
    },
    cancelar () { // Cerrando session con el token
      this.logout().then(respLogin => {});
    },
    descargarFirmarSubir (solDoc, aliasSeleccionado) { // returns a promise
      this.mostrar_progress = true;
      return new Promise((resolve, reject) => {
        solDoc.estado = 'DESCARGANDO';
        this.getFileBase64(solDoc.url_source_pdf)
        .then(base64Pdf => { // Descargar de pdf en base64 completada. Iniciando solicitud de PDF
          console.log('DEMOFI file', base64Pdf);
          solDoc.pdf_base64 = base64Pdf;
          solDoc.estado = 'FIRMANDO';
          this.sign(solDoc, aliasSeleccionado)
          .then(respFirma => { // Verificar si el archivo se pudo firmar
            console.log('respFirma', respFirma);
            if (respFirma.data.finalizado === false) {
              solDoc.estado = 'ERROR_FIRMA';
              reject(respFirma);
              return;
            }
            solDoc.estado = 'ACTUALIZANDO';// PDF firmado correctamente
            let dataPost = {
              codigo_archivo: solDoc.codigo_archivo,
              pdf_base64_signed: respFirma.data.datos.pdf_base64,
              certificado: respFirma.data.datos.certificado,
              idTramiteDoc: this.solicitud.id,
              emailTramiteDoc: this.solicitud.tramite_solicitante_email
            };
            let config = {
              headers: { Authorization: `Bearer ${this.$storage.get('token')}` }
            };

            let url = `${this.$apiUrl}eapostilla/update/${this.solicitud.id_archivo}`;

            console.log('DEMOFI post', dataPost);
            // inicio
            this.$http.post(url, dataPost, config)
            .then(() => {
              console.log('Firmado con éxito!');
              solDoc.estado = 'ACTUALIZADO';
              resolve(respFirma);
            })
            .catch(error => {
              this.mostrar_progress = false;
              solDoc.estado = 'ERROR_ACTUALIZACION';
              reject(error);
            });
            // fin
          }).catch(error => {
            this.mostrar_progress = false;
            solDoc.estado = 'ERROR_FIRMA';
            reject(error);
          });
        }).catch(error => {
          this.mostrar_progress = false;
          solDoc.estado = 'ERROR_DESCARGA';
          reject(error);
        });
      });
    },
    firmar () { // Obtener el documento en blobs
      let aliasSeleccionado = this.firmador.alias;
      let indice = 0;
      this.firmando = true;
      this.firmados = 0;
      // let firmadosConError = 0;
      let respActualizaciones = [];

      this.$store.commit('setLoading', true);
      let continuarOFinalizarFirma = respuestaActualizacion => {
        respActualizaciones.push(respuestaActualizacion);
        this.firmados++;
        if (indice + 1 >= this.solicitudes.length) {
          if (typeof this.onSuccess === 'function') {
            this.onSuccess(this.solicitud);
          }
          console.log('DEMOFI logout');
          this.$store.commit('setLoading', false);
          this.$store.commit('closeModal', 2);
          this.$store.commit('closeModal', 3);
          this.$store.commit('closeModal', 4);
          this.$store.commit('closeModal', 5);
          document.querySelector('#btn-refresh-list').dispatchEvent(new window.Event('click'));
          this.logout();
          this.firmando = false;
        } else {
          indice++;
          this.firmarDocumento(indice);
        }
      };
      let firmarDocumento = () => {
        this.descargarFirmarSubir(this.solicitudes[indice], aliasSeleccionado)
        .then(continuarOFinalizarFirma)
        .catch((err) => {
          console.log('err: ', err);
          // firmadosConError++;
          continuarOFinalizarFirma();
        });
      };
      firmarDocumento(indice);
    }
  }
};
</script>

<style lang="scss">
.demofi-certificado {
  p {
    margin: 0 0 0px;

    em {
      font-size: 0.9rem;
    }
  }

}

.demofi {
  .alert {
    p {
      margin-bottom: 3px;
    }
  }
}
</style>
