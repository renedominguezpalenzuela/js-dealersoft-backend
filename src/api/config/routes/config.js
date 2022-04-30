'use strict';

/**
 * config router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/generatePDF',
      handler: 'config.generatePDF',
    },
    {
      method: 'GET',
      path: '/getPrice',
      handler: 'config.getPrice',
    },
    {
      method: 'GET',
      path: '/getKey',
      handler: 'config.publicKEY',
    },
    {
      method: 'POST',
      path: '/pay',
      handler: 'config.stripePAY',
    },
    {
      method: 'POST',
      path: '/createPaymentIntent',
      handler: 'config.stripePayMobile',
    },
    {
      method: 'POST',
      path: '/confirmPaymentIntent',
      handler: 'config.stripeConfirmMobile',
    }
  ]
}
