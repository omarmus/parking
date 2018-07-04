'use strict';

const debug = require('debug')('app:api:usuario');
const guard = require('express-jwt-permissions')();

module.exports = function setupMovimiento (api, services) {
  // guardar movimiento
  api.patch('/desactivar_cuenta', guard.check(['usuarios:update']), async function desactivarCuenta (req, res, next) {
    debug('Desactivar cuenta de usuario');

    try {

    } catch (e) {
      return next(e);
    }
  });

  return api;
};
