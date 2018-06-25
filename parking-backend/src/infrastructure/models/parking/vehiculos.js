'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    tipo: {
      type: DataTypes.STRING(100),
      xlabel: lang.t('fields.tipo')
    },
    placa: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      xlabel: lang.t('fields.placa')
    },
    marca: {
      type: DataTypes.STRING(100),
      xlabel: lang.t('fields.marca')
    },
    modelo: {
      type: DataTypes.STRING(100),
      xlabel: lang.t('fields.modelo')
    },
    gestion: {
      type: DataTypes.INTEGER,
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

  let Vehiculos = sequelize.define('vehiculos', fields, {
    timestamps: false,
    tableName: 'par_vehiculos'
  });

  return Vehiculos;
};
