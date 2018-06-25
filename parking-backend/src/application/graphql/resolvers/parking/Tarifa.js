'use strict';
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { Tarifa } = services;

  return {
    Query: {
      tarifas: async (_, args, context) => {
        permissions(context, 'tarifas:read');

        let items = await Tarifa.findAll(args, context.id_rol, context.id_tarifa);
        return items.data;
      },
      tarifa: async (_, args, context) => {
        permissions(context, 'tarifas:read');

        let item = await Tarifa.findById(args.id);
        return item.data;
      }
    },
    Mutation: {
      tarifaAdd: async (_, args, context) => {
        permissions(context, 'tarifas:create');

        args.tarifa._user_created = context.id_usuario;
        let item = await Tarifa.createOrUpdate(args.tarifa);
        return item.data;
      },
      tarifaEdit: async (_, args, context) => {
        permissions(context, 'tarifas:update');

        args.tarifa._user_updated = context.id_usuario;
        args.tarifa._updated_at = new Date();
        args.tarifa.id = args.id;
        let item = await Tarifa.createOrUpdate(args.tarifa);
        return item.data;
      },
      tarifaDelete: async (_, args, context) => {
        permissions(context, 'tarifas:delete');

        let deleted = await Tarifa.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
