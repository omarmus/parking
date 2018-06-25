import error from './errors';
import validate from './validates';
import menu from './menu';

export default {
  error,
  validate,
  menu,
  app: {
    title: 'Base frontend',
    account: 'My account',
    settings: 'Settings',
    logOut: 'Logout'
  },
  login: {
    title: 'Login',
    user: 'Username',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPass: 'Forgot password?',
    login: 'Login',
    noAccount: 'Dont have an account?',
    signUp: 'Signup here'
  },
  common: {
    add: 'Add',
    required: 'Required',
    cancel: 'Cancel',
    save: 'Save',
    rowsPage: 'Rows per page',
    updateList: 'Update list',
    filters: 'Filters/Search',
    of: 'of',
    active: 'Active',
    observation: 'Observation',
    firm: 'Firm',
    edit: 'Edit',
    status: 'State',
    actions: 'Actions',
    close: 'Cerrar'
  },
  entity: {
    title: 'Entities',
    add: 'Add new entity',
    crud: {
      edit: 'Edit',
      name: 'Name',
      code: 'Code',
      acronym: 'Acronym',
      description: 'Description',
      status: 'Status',
      addEnt: 'Add entity',
      editEnt: 'Edit entity',
      address: 'Address',
      email: 'Correo electrónico',
      phones: 'Teléfono(s)',
      web: 'Página web de la institución',
      user_ppte: 'Usuario en el sistema PPTE',
      pass_ppte: 'Contraseña en el sistema PPTE'
    }
  },
  account: {
    title: 'Accounts',
    add: 'Add new account',
    select: 'Choose an entity to see its accounts',
    crud: {
      edit: 'Edit',
      accountNumber: 'Account number',
      status: 'Status',
      entity: 'Entity',
      addAc: 'Add account',
      editAc: 'Edit account'
    }
  },
  user: {
    title: 'Users',
    add: 'Add new user',
    crud: {
      edit: 'Edit',
      user: 'User',
      userData: 'User info',
      entity: 'Entity',
      role: 'Role',
      status: 'Status',
      addUser: 'Add user',
      editUser: 'Edit user',
      fullname: 'Nombre completo',
      email: 'Correo electrónico'
    }
  },
  module: {
    title: 'Módulos',
    add: 'Agregar nuevo módulo',
    crud: {
      edit: 'Editar',
      module: 'Módulo',
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
    title: 'Logs',
    crud: {
      nivel: 'Nivel',
      tipo: 'Tipo',
      mensaje: 'Mensaje',
      referencia: 'Referencia',
      ip: 'IP',
      fecha: 'Fecha de creación',
      usuario: 'Usuario'
    }
  }
};
