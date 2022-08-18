module.exports = ({ env }) => ({
  host: env('HOST', 'https://js-dealersoft-server.herokuapp.com'),
  port: env.int('PORT', 1337),
});
