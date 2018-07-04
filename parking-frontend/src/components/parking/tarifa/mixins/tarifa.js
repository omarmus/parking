export default {
  methods: {
    getGestionesFilter (max = false) {
      let gestion = new Date().getFullYear();
      let gestiones = [];
      let fin = 3;
      if (max) {
        fin = 5;
        gestion += 2;
      }
      for (let i = 0; i < fin; i++) {
        gestiones.push(gestion);
        gestion--;
      }
      return gestiones;
    }
  }
};
