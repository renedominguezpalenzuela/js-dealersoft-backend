module.exports = ({ env }) => ({
  
    email: {
      config: {
        provider: 'sendgrid', 
        providerOptions: {
          apiKey: env('SENDGRID_API_KEY'),
        },
        settings: {
          defaultFrom: 'mail@dealersoft.de',
        defaultReplyTo: 'mail@dealersoft.de',
        testAddress: 'mail@dealersoft.de'
        },
      },
    },
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: {
          Bucket: env('AWS_BUCKET'),
        },
      },
    },
  },
});
