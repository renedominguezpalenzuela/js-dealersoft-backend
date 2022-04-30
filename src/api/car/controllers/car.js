'use strict';

/**
 *  car controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::car.car', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      local: 'en',
    }

    const { data, meta } = await super.find(ctx);

    meta.date = Date.now()

    const data2 = [];

    for(let i = 0 ; i < data.length ; i++){
      const item = data[i];
      const car_buy = await strapi.service('api::car-buy-data.car-buy-data').find({
        populate: {
          car: true,
          client: true
        },
        filters: {
          car: {
            id: {
              $eq: item.id
            }
          }
        },
      });
      const car_sell = await strapi.service('api::car-sell-data.car-sell-data').find({
        populate: {
          car: true,
          client: true
        },
        filters: {
          car: {
            id: {
              $eq: item.id
            }
          }
        },
      });
      data2.push({
        id: item.id,
        attributes: {
          ...item.attributes,
          buy: car_buy.results.length > 0 ? car_buy.results[0] : null,
          sell: car_sell.results.length > 0 ? car_sell.results[0] : null
        }
      });
    }

    return { data2, meta };
  },
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;

    const entity = await strapi.service('api::car.car').findOne(id, {
      ...query,
      populate: {
        pictures: true
      }
    });

    const car_buy = await strapi.service('api::car-buy-data.car-buy-data').find({
      populate: {
        car: true,
        client: true
      },
      filters: {
        car: {
          id: {
            $eq: id
          }
        }
      },
    });
    const car_sell = await strapi.service('api::car-sell-data.car-sell-data').find({
      populate: {
        car: true,
        client: true
      },
      filters: {
        car: {
          id: {
            $eq: id
          }
        }
      },
    });

    entity.buy = car_buy.results.length > 0 ? car_buy.results[0] : null;
    entity.sell = car_sell.results.length > 0 ? car_sell.results[0] : null;

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  }
}));
