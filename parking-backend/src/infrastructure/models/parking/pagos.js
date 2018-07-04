'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    nit: {
      type: DataTypes.STRING(50),
      xlabel: lang.t('fields.nit')
    },
    razon_social: {
      type: DataTypes.STRING(255),
      xlabel: lang.t('fields.razon_social')
    },
    nro_factura: {
      type: DataTypes.STRING(50),
      xlabel: lang.t('fields.nro_factura')
    },
    nro_autorizacion: {
      type: DataTypes.STRING(50),
      xlabel: lang.t('fields.nro_autorizacion')
    },
    fecha: {
      type: DataTypes.DATE,
      xlabel: lang.t('fields.fecha')
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      xlabel: lang.t('fields.total')
    },
    gestion: {
      type: DataTypes.INTEGER,
      xlabel: lang.t('fields.gestion')
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['CREADO', 'POR_PAGAR', 'PAGADO'],
      defaultValue: 'CREADO',
      allowNull: false,
      xlabel: lang.t('fields.estado')
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let Pagos = sequelize.define('pagos', fields, {
    timestamps: false,
    tableName: 'par_pagos'
  });

  return Pagos;
};
