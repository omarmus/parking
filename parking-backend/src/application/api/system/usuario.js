'use strict';

const debug = require('debug')('app:api:usuario');
const guard = require('express-jwt-permissions')();
const { userData, generateToken } = require('../../lib/auth');
const moment = require('moment');

module.exports = function setupUsuario (api, services) {
  api.get('/persona-segip/:ci', guard.check(['serviciosIop:read']), async (req, res, next) => {
    debug('Buscando persona en SEGIP');
    const { Persona } = services;
    const { ci } = req.params;
    const { fechaNacimiento, complemento, tipoDoc = 'CI' } = req.query;

    let persona;
    try {
      persona = await Persona.find({
        nro_documento: ci + (complemento ? '-' + complemento : ''),
        tipo_documento: tipoDoc,
        fecha_nacimiento: moment(fechaNacimiento, 'DD/MM/YYYY').utcOffset(0).format('YYYY-MM-DD')
      });
      if (persona.code === 1) {
        persona = persona.data;
        persona = {
          paterno: persona.primer_apellido,
          materno: persona.segundo_apellido,
          nombres: persona.nombres,
          nacionalidad: persona.nacionalidad,
          telefono: persona.telefono,
          movil: persona.movil,
          genero: persona.genero,
          id_persona: persona.id
        };
        persona = { persona };
      } else {
        return res.send({ warning: 'La persona no está registrada en el sistema, complete los datos para registrarla.' });
      }
    } catch (e) {
      return next(e);
    }

    res.send(persona);
  });

  // cambiar contrasena
  api.patch('/cambiar_pass', guard.check(['usuarios:update']), async (req, res, next) => {
    debug('Cambiar contraseña de usuario');
    const { Usuario } = services;
    const { password, newPassword } = req.body;

    try {
      let _user = await userData(req, services);
      let user = await Usuario.userExist(_user.usuario, password);
      if (user.code === 1) {
        await Usuario.update({
          id: _user.id,
          contrasena: newPassword
        });
        res.send({ message: 'Contraseña cambiada correctamente' });
      } else {
        res.send({ error: 'Su contraseña anterior es incorrecta' });
      }
    } catch (e) {
      return next(e);
    }
  });

  // desactivar cuenta
  api.patch('/desactivar_cuenta', guard.check(['usuarios:update']), async function desactivarCuenta (req, res, next) {
    debug('Desactivar cuenta de usuario');
    const { Usuario } = services;
    const { password } = req.body;
    try {
      let _user = await userData(req, services);
      let user = await Usuario.userExist(_user.usuario, password);
      if (user.code === 1) {
        await Usuario.update({
          id: _user.id,
          estado: 'INACTIVO'
        });
        res.send({ message: '¡Cuenta desactivada!' });
      } else {
        res.send({ error: 'Su contraseña es incorrecta' });
      }
    } catch (e) {
      return next(e);
    }
  });

  api.get('/hora', async function obtenerHora (req, res, next) {
    const now = moment();
    debug('Obteniendo hora', now.format('DD/MM/YYYY'), now.format('HH:mm'));
    res.send({
      fecha: now.format('YYYY-MM-DD'),
      hora: now.format('HH:mm:ss')
    });
  });

  api.get('/menu', guard.check(['modulos:read']), async function obtenerMenu (req, res, next) {
    debug('Obteniendo menú y permisos');
    const { Modulo, Parametro } = services;
    let user = await userData(req, services);
    let menu;
    let token;
    let permisos = {};

    try {
      // Obteniendo menu
      menu = await Modulo.getMenu(user.id_rol);
      let permissions = menu.data.permissions;
      menu = menu.data.menu;

      // Generando token
      token = await generateToken(Parametro, user.usuario, permissions);

      // Formateando permisos
      permissions.map(item => (permisos[item] = true));
    } catch (e) {
      return next(e);
    }

    res.send({
      permisos,
      menu,
      token
    });
  });

  return api;
};
