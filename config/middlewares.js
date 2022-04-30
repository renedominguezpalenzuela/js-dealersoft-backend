module.exports = [
  'strapi::errors',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'js-dealersoft-docs.s3.us-east-2.amazonaws.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'js-dealersoft-docs.s3.us-east-2.amazonaws.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
];
