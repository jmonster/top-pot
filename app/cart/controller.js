import { computed } from '@ember/object';
import { alias, mapBy } from '@ember/object/computed';
import { task } from 'ember-concurrency';

import Controller from '@ember/controller';
import RSVP from 'rsvp';

export default Controller.extend({
  cartItems: alias('model.cartItems'),
  products: mapBy('cartItems', 'product'),

  totalQuantity: computed('cartItems.@each.quantity', function() {
    return this.get('cartItems').reduce(function(result, item) {
      const itemQuantity = item.get('quantity');
      return result + itemQuantity;
    }, 0);
  }),

  totalCost: computed('cartItems.@each.quantity', 'products.@each.price', function() {
    return this.get('calculateTotalCost').perform();
  }),

  calculateTotalCost: task(function*() {
    const productTotals = yield this.get('calculateProductTotals').perform();
    return productTotals.reduce((acc, val) => acc + val, 0);
  }),

  calculateProductTotals: task(function*() {
    const promises = yield this.get('cartItems')
      .map((cartItem) => {
        const quantity = cartItem.get('quantity');
        return cartItem.get('product').then(function(product) {
          return  quantity * product.get('price');
        });
      });

    return RSVP.all(promises);
  }),

  actions: {
    setQuantity(cartItem, quantity) {
      cartItem.set('quantity', quantity);
      return cartItem.save();
    }
  }
});
