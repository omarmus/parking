'use strict';

const debug = require('debug')('app:api');
const { generateToken, generateTokenSolicitante } = require('../lib/auth');
const api = require('./api');

module.exports = async function setupApi (app, services) {
  debug('Iniciando API-REST');

  // Registrando API-REST
  app.use('/api', api(services));

  // login
  app.post('/auth', async function auth (req, res, next) {
    debug('Autenticación de usuario');
    const { Usuario, Modulo, Parametro, Log } = services;
    const { usuario, contrasena } = req.body;
    const routesRol = {
      1: 'entidades',
      2: 'usuarios',
      3: ''
    };
    let respuesta;

    try {
      if (!usuario || !contrasena) {
        return res.status(403).send({ error: 'El usuario y la contraseña son obligatorios' });
      }
      // Verificando que exista el usuario/contraseña
      let user = await Usuario.userExist(usuario, contrasena);
      if (user.code === -1) {
        return res.status(403).send({ error: user.message });
      }
      user = user.data;

      // Actualizando el último login
      const now = new Date();
      await Usuario.update({
        id: user.id,
        ultimo_login: now
      });
      const ip = req.connection.remoteAddress;
      Log.info(`El usuario: ${usuario} ingresó al sistema a las ${now}`, 'LOGIN', null, usuario, ip);

      // Obteniendo menu
      let menu = await Modulo.getMenu(user.id_rol);
      let permissions = menu.data.permissions;
      menu = menu.data.menu;

      // Bloqueando el ingreso del usuario solicitante(para el portal) y generando el token de solicitante
      if (user.id_rol === 3) {
        console.log('-------------------------------');
        console.log(permissions);
        console.log('-------------------------------');
        console.log(generateTokenSolicitante(usuario, permissions));
        return next(new Error('No existe el usuario'));
      }

      // Generando token
      let token = await generateToken(Parametro, usuario, permissions);

      // Formateando permisos
      let permisos = {};
      permissions.map(item => (permisos[item] = true));

      respuesta = {
        menu,
        token,
        permisos,
        usuario: {
          'id': user.id,
          'usuario': user.usuario,
          'nombres': user['persona.nombres'],
          'primer_apellido': user['persona.primer_apellido'],
          'segundo_apellido': user['persona.segundo_apellido'],
          'email': user.email,
          'id_entidad': user.id_entidad,
          'id_rol': user.id_rol,
          'entidad': user['entidad.nombre'],
          'rol': user['rol.nombre'],
          'lang': 'es'
        },
        redirect: routesRol[user.id_rol]
      };
    } catch (e) {
      return next(e);
    }
    res.send(respuesta);
  });

  return app;
};
