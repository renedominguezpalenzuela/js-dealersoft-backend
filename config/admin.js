module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '08590b863a1ae0f53bc9ca6ec27047b6'),
  },
});
