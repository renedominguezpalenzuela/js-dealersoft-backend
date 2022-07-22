module.exports = ({ env }) => ({
 
    email: {
      config: {
        provider: 'sendgrid', // For community providers 
                                             //  pass the full package name
                                             // (e.g. provider: 'strapi-provider-email-mandrill')
        providerOptions: {
          apiKey: env('SENDGRID_API_KEY'),
        },
        settings: {
          defaultFrom: 'renedp1975@gmail.com',
        defaultReplyTo: 'renedp1975@gmail.com',
        testAddress: 'renedp1975@gmail.com',
        },
      },
    },
  

  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 100000,
      },
    },
  },
});
