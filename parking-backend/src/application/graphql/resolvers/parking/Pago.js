'use strict';
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { Pago } = services;

  return {
    Query: {
      pagos: async (_, args, context) => {
        permissions(context, 'pagos:read');

        let items = await Pago.findAll(args, context.id_rol, context.id_pago);
        return items.data;
      },
      pago: async (_, args, context) => {
        permissions(context, 'pagos:read');

        let item = await Pago.findById(args.id);
        return item.data;
      }
    },
    Mutation: {
      pagoAdd: async (_, args, context) => {
        permissions(context, 'pagos:create');

        args.pago._user_created = context.id_usuario;
        let item = await Pago.createOrUpdate(args.pago);
        return item.data;
      },
      pagoEdit: async (_, args, context) => {
        permissions(context, 'pagos:update');

        args.pago._user_updated = context.id_usuario;
        args.pago._updated_at = new Date();
        args.pago.id = args.id;
        let item = await Pago.createOrUpdate(args.pago);
        return item.data;
      },
      pagoDelete: async (_, args, context) => {
        permissions(context, 'pagos:delete');

        let deleted = await Pago.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
