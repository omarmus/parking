<template>
  <div class="file-upload">
    <vue-dropzone
      ref="myVueDropzone"
      id="dropzone"
      @vdropzone-success="vdropzoneSuccess"
      @vdropzone-error="vdropzoneError"
      @vdropzone-sending="sendingEvent"
      :options="dropzoneOptions">
    </vue-dropzone>
  </div>
</template>
<script>
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.css';

export default {
  props: {
    url: {
      type: String,
      default: 'http://localhost/upload'
    },
    label: {
      type: String,
      default: 'Arrastra tus archivos aquí'
    },
    name: {
      type: String,
      default: 'file'
    },
    types: {
      type: String,
      default: 'application/pdf'
    },
    onSuccess: {
      type: Function,
      default: null
    },
    onError: {
      type: Function,
      default: null
    },
    form: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      dropzoneOptions: {
        url: this.url,
        maxFilesize: 5,
        paramName: this.name,
        acceptedFiles: this.types,
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: `<i aria-hidden="true" class="material-icons icon primary--text">cloud_upload</i> ${this.label}`,
        dictFallbackMessage: 'Tu navegador no soporta drag and drop.',
        dictFallbackText: 'Usa el formulario de abajo para subir tus archivos como en los viejos tiempos.',
        dictFileTooBig: 'Archivo muy grande ({{filesize}}MiB). Máximo permitido: {{maxFilesize}}MiB.',
        dictInvalidFileType: 'No puede subir este tipo de archivo',
        dictResponseError: 'El servidor respondió con código {{statusCode}}.',
        dictCancelUpload: 'Cancelar subida.',
        dictCancelUploadConfirmation: 'Esta seguro que quiere cancelar?',
        dictRemoveFile: 'Eliminar archivo',
        dictMaxFilesExceeded: 'No puede subir mas archivos.',
        headers: {
          Authorization: `${this.$authToken} ${this.$storage.get('token')}`
        }
      }
    };
  },
  components: {
    vueDropzone: vue2Dropzone
  },
  methods: {
    vdropzoneSuccess (file, response) {
      this.$loading.hide();
      console.log('Archivo subido', file, response);
      if (typeof this.onSuccess === 'function') {
        this.onSuccess(file, response);
      }
    },
    vdropzoneError (file, message, xhr) {
      this.$loading.hide();
      this.$message.error(message.error || message);
      if (typeof this.onError === 'function') {
        this.onError(file, message, xhr);
      }
    },
    sendingEvent (file, xhr, formData) {
      this.$loading.show('Subiendo archivo, espere por favor...');
      if (this.form) {
        for (let key in this.form) {
          formData.append(key, this.form[key]);
        }
      }
    }
  }
};
</script>

<style lang="scss">
.file-upload {
  margin-bottom: 20px;
}
</style>
