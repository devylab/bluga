module.exports = {
  headers: ['css/animate.css', 'css/icomoon.css', 'css/bootstrap.css', 'css/style.css', 'js/modernizr-2.6.2.min.js'],
  footers: [
    'js/jquery.min.js',
    'js/jquery.easing.1.3.js',
    'js/bootstrap.min.js',
    'js/jquery.waypoints.min.js',
    'js/main.js',
  ],
  routes: [
    {
      route: '/',
      path: '/pages/index.ejs',
    },
    {
      route: '/:slug',
      path: '/pages/single.ejs',
    },
  ],
};
