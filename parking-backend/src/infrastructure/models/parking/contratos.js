'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      xlabel: lang.t('fields.fecha_inicio')
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      xlabel: lang.t('fields.fecha_fin')
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

  let Roles = sequelize.define('contratos', fields, {
    timestamps: false,
    tableName: 'par_contratos'
  });

  return Roles;
};
