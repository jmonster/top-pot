import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('onboarding');
  this.route('authenticated', { path: '/' }, function() {

  });
  this.route('cart');
  this.route('cms');
  this.route('products', function() {
    this.route('view', { path: '/view/:id' });
  });
});

export default Router;
