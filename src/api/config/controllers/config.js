'use strict';

/**
 *  config controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const html_to_pdf = require('html-pdf-node');
const axios = require('axios');

const stripe = require("stripe")(process.env.STRIPE_SK);

const PRICE = 20;
const CURRENCY = "EUR";
const STRIPE_PK = "pk_test_51I3lMpHz6wZjUnSMzC9PFSxXXgP98WukmZ37IAtfR5T8Nx58DjobI4yCx13gzvZkqZvwYKQQqASyGmSlkR2OcLHH00WyNjF9yT";

module.exports = createCoreController('api::config.config', ({ strapi }) =>  ({
  async generatePDF(ctx) {
    const { data } = ctx.request.body;
    
    const token = ctx.request.header.authorization.split(' ')[1];

    const front_end_server =  process.env.FRONT_END_SERVER;
    // let url = `https://admin.dealersoft.de/export/${data.type}/${token}?`;
    let url = `${front_end_server}/export/${data.type}/${token}?`;

    

    for(let key in data){
      if(key === 'type') continue;
      url += `${key}=${data[key]}&`;
    }


    let file = { url: url };
    let options = {  };

    const res = await html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
      return pdfBuffer;
    });

    ctx.set("Content-Type", "application/pdf");

    return res;
  },
  async publicKEY(ctx) {
    return { publicKey: STRIPE_PK }
  },
  async getPrice(ctx) {
    return {
      price: PRICE,
      currency: CURRENCY
    };
  },
  async stripePAY(ctx) {
    const user = ctx.state.user;
    const { token } = ctx.request.body;

    try {
      const charge = await stripe.charges.create({
        // Transform cents to dollars.
        amount: PRICE * 100,
        currency: CURRENCY,
        description: `Order ${new Date()} by ${ctx.state.user.id}`,
        source: token
      });

      const dt = user.active_until ? new Date(user.active_until) : new Date();
      const newDT =  new Date(dt.setMonth(dt.getMonth() + 1)); // + months

      const data = await strapi.query('plugin::users-permissions.user').update({
        where: { id: user.id },
        data: {
          active_until: newDT
        }
      })

      ctx.body = charge;
    } catch (e) {
      ctx.body = e;
    }
  },
  async stripePayMobile(ctx) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: PRICE * 100,
      currency: CURRENCY,
      payment_method_types: ['card'],
    });

    ctx.body = paymentIntent;
  },
  async stripeConfirmMobile(ctx) {
    const user = ctx.state.user;

    const { id } = ctx.request.body;

    if(!id || !user) return {
      error: {
        message: "No payment specified"
      }
    }

    const dt = user.active_until ? new Date(user.active_until) : new Date();
    const newDT =  new Date(dt.setMonth(dt.getMonth() + 1));

    const data = await strapi.query('plugin::users-permissions.user').update({
      where: { id: user.id },
      data: {
        active_until: newDT
      }
    })

    ctx.body = data;
  },
}));

