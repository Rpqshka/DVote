const routes = require('next-routes')();

routes.add('/campaign/:address', '/campaign/show');
routes.add('/campaign/:address/add', '/campaign/candidate')
module.exports = routes;