'use strict';

const express = require('express');
const asyncify = require('express-asyncify');
const auth = require('express-jwt');
const { config } = require('../../common');
const api = asyncify(express.Router());
const publicRoute = require('./public');
const system = require('./system');

module.exports = function setupApi (services) {
  // Registrando API-REST
  api.use('/public', publicRoute(services));
  api.use('*', auth(config.auth));
  api.use('/system', system(services));

  return api;
};
