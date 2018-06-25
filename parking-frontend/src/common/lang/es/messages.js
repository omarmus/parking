import error from './errors';
import validate from './validates';
import menu from './menu';

export default {
  error,
  validate,
  menu,
  app: {
    title: 'Base frotend',
    account: 'Mi cuenta',
    settings: 'Configuración',
    logOut: 'Cerrar sesión'
  },
  login: {
    title: 'Inicia tu sesión',
    user: 'Nombre de usuario',
    password: 'Contraseña',
    rememberMe: 'Recuerdame',
    forgotPass: '¿Se te olvidó tu contraseña?',
    login: 'Ingresar',
    noAccount: '¿No tienes una cuenta?',
    signUp: 'Registrate aquí'
  },
  common: {
    add: 'Agregar',
    required: 'Campo obligatorio',
    cancel: 'Cancelar',
    save: 'Guardar',
    rowsPage: 'Filas por página',
    updateList: 'Actualizar esta lista',
    filters: 'Filtros/búsqueda',
    of: 'de',
    active: 'Activo',
    observation: 'Observar',
    firm: 'Firmar',
    approve: 'Aprobar y Firmar',
    edit: 'Editar',
    status: 'Estado',
    actions: 'Acciones',
    close: 'Cerrar'
  },
  entity: {
    title: 'Entidades',
    add: 'Agregar nueva entidad',
    crud: {
      edit: 'Editar',
      code: 'Código',
      name: 'Nombre',
      acronym: 'Sigla',
      description: 'Descripción',
      status: 'Estado',
      addEnt: 'Agregar entidad',
      editEnt: 'Editar entidad',
      address: 'Dirección',
      email: 'Correo electrónico de atención al cliente',
      phones: 'Teléfono(s)',
      web: 'Página web de la entidad'
    }
  },
  account: {
    title: 'Cuentas',
    add: 'Agregar nueva cuenta',
    select: 'Seleccione una entidad para ver sus cuentas',
    crud: {
      edit: 'Editar',
      accountNumber: 'Nro. de cuenta',
      status: 'Estado',
      entity: 'Entidad',
      addAc: 'Agregar cuenta',
      editAc: 'Editar cuenta'
    }
  },
  user: {
    title: 'Usuarios',
    add: 'Agregar nuevo usuario',
    crud: {
      edit: 'Editar',
      user: 'Usuario',
      userData: 'Datos del usuario',
      entity: 'Entidad',
      role: 'Rol',
      status: 'Estado',
      addUser: 'Agregar usuario',
      editUser: 'Editar usuario',
      fullname: 'Nombre completo',
      email: 'Correo electrónico'
    }
  },
  rol: {
    title: 'Roles',
    add: 'Agregar nuevo rol',
    crud: {
      name: 'Nombre',
      description: 'Descripción',
      tipo: 'Tipo',
      editRol: 'Editar Rol',
      addRol: 'Agregar Rol'
    }
  },
  parametro: {
    title: 'Parámetros',
    add: 'Agregar nuevo parámetro',
    preferencias: 'Preferencias',
    crud: {
      name: 'Nombre',
      value: 'Valor',
      label: 'Label',
      description: 'Descripción',
      editParametro: 'Editar Parámetro',
      addParametro: 'Agregar Parámetro'
    }
  },
  module: {
    title: 'Módulos y permisos',
    add: 'Agregar nuevo módulo',
    crud: {
      edit: 'Editar',
      module: 'Módulo padre',
      label: 'Título',
      path: 'Path',
      icon: 'Ícono',
      order: 'Orden',
      status: 'Estado',
      visible: 'Visible',
      is_visible: 'Es visible',
      submodule: 'Sub módulo',
      section: 'Sección',
      addModule: 'Agregar módulo',
      editModule: 'Editar módulo',
      permissions: 'Permisos'
    }
  },
  log: {
    title: 'Logs del sistema',
    crud: {
      nivel: 'Nivel',
      tipo: 'Tipo',
      mensaje: 'Mensaje',
      referencia: 'Referencia',
      ip: 'IP',
      fecha: 'Fecha de creación',
      usuario: 'Usuario'
    }
  },
  servicioIop: {
    title: 'Interoperabilidad',
    add: 'Agregar nuevo servicio',
    crud: {
      codigo: 'Código',
      metodo: 'Método',
      descripcion: 'Descripción',
      entidad: 'Entidad',
      url: 'Url',
      token: 'Token',
      tipo: 'Tipo',
      estado: 'Estado',
      editServicio: 'Editar Servicio Iop',
      addServicio: 'Agregar Servicio Iop'
    }
  },
  // Itinerarios
  operador: {
    title: 'Operadores aéreos',
    add: 'Agregar nuevo operador',
    edit: 'Editar operador',
    crud: {
      edit: 'Editar',
      nit: 'Nit',
      sigla: 'Sigla',
      razon_social: 'Razón social',
      matricula_comercio: 'Matrícula de comercio',
      codigo: 'Código',
      departamento: 'Departamento',
      provincia: 'Provincia',
      municipio: 'Municipio',
      direccion: 'Dirección',
      telefonos: 'Teléfonos',
      tipo: 'Tipo',
      licencia: 'Licencia',
      fecha_vigencia: 'Fecha de vigencia',
      descripcion: 'Descripción',
      estado: 'Estado'
    }
  },
  aeropuerto: {
    title: 'Aeropuertos',
    add: 'Agregar nuevo aeropuerto',
    edit: 'Editar aeropuerto',
    crud: {
      codigo_icao: 'Código ICAO',
      codigo_iata: 'Código IATA',
      nombre: 'Nombre',
      ciudad: 'Ciudad',
      pais: 'País',
      lat_grados: 'Latitud grados',
      lat_minutos: 'Latitud minutos',
      lat_segundos: 'Latitud segundos',
      lat_dir: 'Latitud dir',
      lon_grados: 'Longitud grados',
      lon_minutos: 'Longitud minutos',
      lon_segundos: 'Longitud segundos',
      lon_dir: 'Longitud dir',
      altitud: 'Altitud',
      lat_decimal: 'Latitud decimal',
      lon_decimal: 'Longitud decimal',
      municipio: 'Municipio',
      departamento: 'Departamento',
      categoria: 'Categoría',
      estado: 'Estado'
    }
  },
  aeronave: {
    title: 'Aeronaves',
    add: 'Agregar nueva aeronave',
    edit: 'Editar aeronave',
    crud: {
      correlativo: 'Correlativo',
      matricula: 'Matrícula',
      serie: 'Serie',
      marca: 'Marca',
      modelo: 'Modelo',
      fecha_inscripcion: 'Fecha de inscripción',
      propietario: 'Propietario',
      ciudad: 'Ciudad',
      observaciones: 'Observaciones',
      fecha_actualizacion: 'Fecha de actualización',
      capacidad_pasajeros: 'Capacidad de pasajeros',
      capacidad_carga: 'Capacidad de carga',
      capacidad_equipaje: 'Capacidad de equipaje',
      ads_b: 'ADS-B',
      descripcion: 'Descripción',
      estado: 'Estado',
      id_operador: 'Operador',
      operador_nit: 'NIT del operador',
      operador_sigla: 'Operador aéreo',
      operador_razon_social: 'Razón social deĺ operador'
    }
  },
  solicitud: {
    title: 'Solicitudes de itinerarios',
    add: 'Agregar nueva solicitud',
    edit: 'Editar solicitud',
    crud: {
      codigo: 'Código DGAC',
      fecha_inicio: 'Fecha de inicio',
      fecha_fin: 'Fecha final',
      observacion: 'Observación',
      tipo: 'Tipo de itinerario',
      estado: 'Estado',
      id_operador: 'Operador aéreo'
    }
  }
};
