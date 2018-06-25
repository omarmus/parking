<template>
  <div class="pdf-view">
    <div class="pdf-view-actions">
      <div class="pdf-view-page">
        <span>Página: <span>{{ page_num }}</span> / <span> {{ page_count }}</span></span>
      </div>
      <div class="pdf-view-buttons">
        <v-btn
          type="button"
          :disabled="page_num == 1"
          @click="onPrevPage"><v-icon>keyboard_arrow_left</v-icon> Anterior</v-btn>
        <v-btn
          type="button"
          :disabled="page_num == page_count"
          @click="onNextPage">Siguiente <v-icon>keyboard_arrow_right</v-icon></v-btn>
        <a
          :href="url"
          target="_blank"
          class="btn">
          <div class="btn__content">
            <v-icon>file_download</v-icon> Descargar
          </div>
        </a>
      </div>
    </div>
    <canvas :id="id">Cargando PDF espere por favor...</canvas>
  </div>
</template>

<script>
import 'pdfjs-dist';

export default {
  props: {
    data: {
      type: String,
      default: null
    },
    id: {
      type: String,
      default: 'app-pdf-viewer'
    },
    url: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      page_num: 0,
      page_count: 0
    };
  },
  created () {
    this.pdfDoc = null;
    this.pageNum = 1;
    this.pageRendering = false;
    this.pageNumPending = null;
    this.scale = 1.6;
  },
  mounted () {
    this.canvas = document.getElementById(this.id);
    this.ctx = this.canvas.getContext('2d');

    if (this.data) {
      this.render(this.data);
    }
  },
  methods: {
    render (data) {
      // let pdfData = atob(btoa(String.fromCharCode(...new Uint8Array(data))));
      let pdfData = atob(data);

      // Disable workers to avoid yet another cross-origin issue (workers need
      // the URL of the script to be loaded, and dynamically loading a cross-origin
      // script does not work).
      // PDFJS.disableWorker = true;

      // The workerSrc property shall be specified.
      // window.PDFJS.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

      // Using DocumentInitParameters object to load binary data.
      let loadingTask = window.PDFJS.getDocument({ data: pdfData });
      loadingTask.promise.then(pdsfDoc_ => {
        this.pdfDoc = pdsfDoc_;
        this.page_count = this.pdfDoc.numPages;

        // Initial/first page rendering
        this.renderPage(this.pageNum);
      }, function (error) {
        // PDF loading error
        console.error('Error PDF', error);
      });
    },
    /**
     * Get page info from document, resize canvas accordingly, and render page.
     * @param num Page number.
     */
    renderPage (num) {
      this.pageRendering = true;
      // Using promise to fetch the page
      this.pdfDoc.getPage(num).then(page => {
        var viewport = page.getViewport(this.scale);
        this.canvas.height = viewport.height;
        this.canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: this.ctx,
          viewport: viewport
        };
        var renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(() => {
          this.pageRendering = false;
          if (this.pageNumPending !== null) {
            // New page rendering is pending
            this.renderPage(this.pageNumPending);
            this.pageNumPending = null;
          }
        });
      });

      // Update page counters
      this.page_num = num;
    },
    /**
     * If another page rendering in progress, waits until the rendering is
     * finised. Otherwise, executes rendering immediately.
     */
    queueRenderPage (num) {
      if (this.pageRendering) {
        this.pageNumPending = num;
      } else {
        this.renderPage(num);
      }
    },
    /**
     * Displays previous page.
     */
    onPrevPage () {
      if (this.pageNum <= 1) {
        return;
      }
      this.pageNum--;
      this.queueRenderPage(this.pageNum);
    },
    /**
     * Displays next page.
     */
    onNextPage () {
      if (this.pageNum >= this.pdfDoc.numPages) {
        return;
      }
      this.pageNum++;
      this.queueRenderPage(this.pageNum);
    }
  }
};
</script>

<style lang="scss">
@import '../../../assets/scss/_variables.scss';

.pdf-view {
  canvas {
    width: 100%;
    border: 1px solid #ddd;
    padding: 10px;
  }

  .btn-view {

  }

  .pdf-view-actions {
    background: darken($info, 0%);
    color: #f0f0f0;
    overflow: hidden;

    .pdf-view-buttons {
      float: right;
      padding-right: 5px;

      .btn {
        margin: 5px 0;
      }
    }

    .pdf-view-page {
      float: left;
      line-height: 46px;
      padding-left: 20px;
      font-size: 1.1rem;
    }
  }
}
</style>
