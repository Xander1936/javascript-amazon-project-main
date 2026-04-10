import { addToCart, cart, loadFromStorage } from '../../data/cart.js';

describe('addToCart', () => {

  // Shared setup: fake the DOM quantity selector to always return "1"
  // and fake localStorage so each test starts with a known cart state.
  // Both spies are torn down automatically after each test by Jasmine.
  // spyOn() records every time a method is used

  // ─── Helper: fake the quantity selector DOM element ───────────────
  function fakeQuantitySelector(value) {
    spyOn(document, 'querySelector').and.callFake((selector) => {
      // Only intercept the quantity selector; let other queries pass through
      if (selector.startsWith('.js-quantity-selector-')) {
        return { value: String(value) };
      }
      return null;
    });
  }

  // ─── Test 1: adding a product that already exists in the cart ─────
  it('increases the quantity when the product is already in the cart', () => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() =>
      JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 1,
        deliveryOptionId: '1'
      }])
    );

    loadFromStorage(); // reload cart using the spied localStorage above
    fakeQuantitySelector(1); // quantity selector returns "1"

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    // Cart should still have only 1 item (no duplicate added)
    expect(cart.length).toEqual(1);

    // Quantity should be incremented: 1 (existing) + 1 (selector) = 2
    expect(cart[0].quantity).toEqual(2);

    // Product ID must be unchanged
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    // localStorage.setItem must have been called once to persist
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  // ─── Test 2: adding a brand-new product not yet in the cart ───────
  it('adds a new product to the cart; a new item when the product is not in the cart', () => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() =>
      JSON.stringify([]) // cart starts empty
    );
    // console.log(localStorage.getItem('cart'));
    
    loadFromStorage();
    fakeQuantitySelector(1);

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    // A new item should have been pushed into the cart
    expect(cart.length).toEqual(1);

    // Quantity comes directly from the selector
    expect(cart[0].quantity).toEqual(1);

    // Correct product ID
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    // Default delivery option applied
    expect(cart[0].deliveryOptionId).toEqual('1');

    // localStorage.setItem called once
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  // ─── Test 3: quantity selector value greater than 1 ───────────────
  it('adds the correct quantity when the selector value is greater than 1', () => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() =>
      JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 3,
        deliveryOptionId: '1'
      }])
    );

    loadFromStorage();
    fakeQuantitySelector(5); // user selected quantity 5

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    // 3 (existing) + 5 (selector) = 8
    expect(cart[0].quantity).toEqual(8);
    expect(cart.length).toEqual(1);
  });

  // ─── Test 4: adding a new product with quantity > 1 ───────────────
  it('sets the correct quantity for a new product when selector value is greater than 1', () => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() =>
      JSON.stringify([])
    );

    loadFromStorage();
    fakeQuantitySelector(3);

    addToCart('15b6fc6f-327a-4ec4-896f-486349e85a3d');

    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual('15b6fc6f-327a-4ec4-896f-486349e85a3d');
    expect(cart[0].quantity).toEqual(3);
    expect(cart[0].deliveryOptionId).toEqual('1');
  });

  // ─── Test 5: multiple different products can be added ─────────────
  it('keeps other cart items intact when adding a new product', () => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() =>
      JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '1'
      }])
    );

    loadFromStorage();
    fakeQuantitySelector(1);

    // Add a completely different product
    addToCart('15b6fc6f-327a-4ec4-896f-486349e85a3d');

    // Cart should now have 2 distinct items
    expect(cart.length).toEqual(2);

    // First item is unchanged
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);

    // New item was appended correctly
    expect(cart[1].productId).toEqual('15b6fc6f-327a-4ec4-896f-486349e85a3d');
    expect(cart[1].quantity).toEqual(1);
  });

  // ─── Test 6: localStorage is called with the correct arguments ────
  it('saves the updated cart to localStorage with the correct key', () => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() =>
      JSON.stringify([])
    );

    loadFromStorage();
    fakeQuantitySelector(2);

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'cart',
      JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '1'
      }])
    );
  });

});