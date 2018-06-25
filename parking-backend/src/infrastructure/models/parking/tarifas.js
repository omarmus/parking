'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    minutos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      xlabel: lang.t('fields.minutos')
    },
    precio: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: false,
      xlabel: lang.t('fields.precio')
    },
    turno: {
      type: DataTypes.ENUM,
      values: ['DIURNO', 'NOCTURNO'],
      defaultValue: 'DIURNO',
      allowNull: false,
      xlabel: lang.t('fields.turno')
    },
    gestion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      xlabel: lang.t('fields.gestion')
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['ACTIVO', 'INACTIVO'],
      defaultValue: 'ACTIVO',
      allowNull: false,
      xlabel: lang.t('fields.estado')
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let Tarifas = sequelize.define('tarifas', fields, {
    timestamps: false,
    tableName: 'par_tarifas'
  });

  return Tarifas;
};
