"use strict";

/**
 *  config controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const html_to_pdf = require("html-pdf-node");
const axios = require("axios");

const stripe = require("stripe")(process.env.STRIPE_SK);

const PRICE = 20;
const CURRENCY = "EUR";
const STRIPE_PK =
  "pk_test_51I3lMpHz6wZjUnSMzC9PFSxXXgP98WukmZ37IAtfR5T8Nx58DjobI4yCx13gzvZkqZvwYKQQqASyGmSlkR2OcLHH00WyNjF9yT";

module.exports = createCoreController("api::config.config", ({ strapi }) => ({
  async generatePDF(ctx) {
    const { data } = ctx.request.body;

    //Datos recibidos desde el cliente
    // console.log("Datos");
    // console.log(ctx.request.body);

    const token = ctx.request.header.authorization.split(" ")[1];
    //console.log(token);

    const front_end_server = process.env.FRONT_END_SERVER;
    // let url = `https://admin.dealersoft.de/export/${data.type}/${token}?`;
    let url = `${front_end_server}/export/${data.type}/${token}?`;
    //console.log(url);

    for (let key in data) {
      if (key === "type") continue;
      url += `${key}=${data[key]}&`;
    }

    let file = { url: url };
    let options = {};

    const res = await html_to_pdf
      .generatePdf(file, options)
      .then((pdfBuffer) => {
        return pdfBuffer;
      });

    ctx.set("Content-Type", "application/pdf");

    return res;
  },
  async publicKEY(ctx) {
   // return { publicKey: STRIPE_PK };
  },
  async getPrice(ctx) {
    return {
      price: PRICE,
      currency: CURRENCY,
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
        source: token,
      });

      const dt = user.active_until ? new Date(user.active_until) : new Date();
      const newDT = new Date(dt.setMonth(dt.getMonth() + 1)); // + months

      const data = await strapi.query("plugin::users-permissions.user").update({
        where: { id: user.id },
        data: {
          active_until: newDT,
        },
      });

      ctx.body = charge;
    } catch (e) {
      ctx.body = e;
    }
  },
  async stripePayMobile(ctx) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: PRICE * 100,
      currency: CURRENCY,
      payment_method_types: ["card"],
    });

    ctx.body = paymentIntent;
  },
  async stripeConfirmMobile(ctx) {
    const user = ctx.state.user;

    const { id } = ctx.request.body;

    if (!id || !user)
      return {
        error: {
          message: "No payment specified.",
        },
      };

    const dt = user.active_until ? new Date(user.active_until) : new Date();
    const newDT = new Date(dt.setMonth(dt.getMonth() + 1));

    const data = await strapi.query("plugin::users-permissions.user").update({
      where: { id: user.id },
      data: {
        active_until: newDT,
      },
    });

    ctx.body = data;
  },

  async sendMail(ctx) {
    try {


      const { email_address, first_name, last_name, telephone, message } = ctx.request.body.data;

       



      await strapi.plugins["email"].services.email.send({
        to: email_address,
        from:  process.env.SENDGRID_SENDMAIL_API_ADDRESS,
        replyTo:  process.env.SENDGRID_SENDMAIL_API_ADDRESS,
        subject: "Kontakt Formular",
       // text: "Texto del mensaje",
        html: `<h1>Kontakt Formular</h1><p>${first_name} ${last_name} </p> <p>${telephone}</p> <p>${message}</p>`

      });

      //enviando mensaje de respuesta
      ctx.send({ message: 'Email sent' });

      //        ctx.body = 'ok';  //devuelvo ok si todo bien
    } catch (err) {
      strapi.log.error(`Error sending email to ${sendTo}`, err)
      ctx.send({ error: 'Error sending email' })
   


      ctx.body = err; //devuelo error si hay error
      
    }
  },
}));
