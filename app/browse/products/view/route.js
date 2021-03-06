import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model(params) {
    return RSVP.hash({
      product: this.store.findRecord('product', params.id),
      cart: this.modelFor('application').cart
    });
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set('quantity', 1);
    }
  }
});
