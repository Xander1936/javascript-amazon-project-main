// ============================================================
// cart.js — Object-Oriented Cart using Factory Functions
// ============================================================
// How modules work:
//  1. Add type="module" to your <script> tag in HTML
//  2. Export what you want to share (export function / export let)
//  3. Import it in other files (import { cart } from './cart.js')
//
// Object-Oriented Programming (OOP) tries to model the real world.
// A "Cart" represents a shopping cart — it holds items and knows
// how to manage itself (add, remove, save, load, etc.)
//
// A function defined inside an object is called a METHOD.
// Shorthand: loadFromStorage() {}  ===  loadFromStorage: function() {}
// ============================================================

/**
 * Factory Function: Cart(localStorageKey)
 *
 * Instead of using `class`, we use a plain factory function that
 * builds and returns a cart object. Each call creates an independent
 * cart stored under its own localStorage key.
 *
 * @param {string} localStorageKey - The key used to persist this cart
 * @returns {object} A cart object with methods to manage cart items
 */
function Cart(localStorageKey) {

  // The internal cart object — all methods live here.
  // We name it `cartObj` internally to avoid shadowing the outer scope.
  const cartObj = {
    cartItems: undefined,

    // ----------------------------------------------------------
    // loadFromStorage()
    // Reads cart data from localStorage. If nothing is saved yet,
    // it creates a default cart with two sample items and saves it.
    // ----------------------------------------------------------
    loadFromStorage() {
      this.cartItems = JSON.parse(localStorage.getItem(localStorageKey));

      if (!this.cartItems) {
        // No saved cart found — seed with default items
        this.cartItems = [
          {
            productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 2,
            deliveryOptionId: "1",
          },
          {
            productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
            quantity: 1,
            deliveryOptionId: "2",
          },
        ];
        // BUG FIX: was calling bare saveToStorage() (undefined).
        // Must use this.saveToStorage() to call the method on this object.
        this.saveToStorage();
      }
    },

    // ----------------------------------------------------------
    // saveToStorage()
    // Serializes cartItems to JSON and writes it to localStorage
    // under the key provided when Cart() was created.
    // ----------------------------------------------------------
    saveToStorage() {
      localStorage.setItem(localStorageKey, JSON.stringify(this.cartItems));
    },

    // ----------------------------------------------------------
    // ----------------------------------------------------------
    // addToCart(productId, quantity = 1)
    // BUG FIX: The original code always tried to read the quantity
    // from a DOM element (.js-quantity-selector-<id>).
    // This crashes when addToCart() is called outside of a user
    // interaction (e.g. on page load) because that DOM element
    // doesn't exist in the current page / context.
    //
    // FIX: Accept quantity as a direct parameter with a default
    // value of 1. The caller (e.g. a button click handler) is
    // responsible for reading the DOM and passing the value in.
    // This makes the method reusable and DOM-independent.
    // ----------------------------------------------------------
    addToCart(productId, quantity = 1) {
      const matchingItem = this.cartItems.find(
        (cartItem) => cartItem.productId === productId
      );

      if (matchingItem) {
        // Product already in cart — increase by the given quantity
        matchingItem.quantity += Number(quantity);
      } else {
        // New product — add it with the given quantity and default delivery
        this.cartItems.push({
          productId,
          quantity: Number(quantity),
          deliveryOptionId: "1",
        });
      }

      this.saveToStorage();
    },
    // ----------------------------------------------------------
    // ensureDeliveryOptionIds()
    // Migration helper: older carts saved before deliveryOptionId
    // was introduced won't have that field. This method patches
    // any items missing it and re-saves if anything changed.
    // ----------------------------------------------------------
    ensureDeliveryOptionIds() {
      const DEFAULT_DELIVERY_OPTION_ID = "1";
      let didChange = false;

      this.cartItems.forEach((cartItem) => {
        if (!cartItem.deliveryOptionId) {
          cartItem.deliveryOptionId = DEFAULT_DELIVERY_OPTION_ID;
          didChange = true;
        }
      });

      if (didChange) this.saveToStorage();
    },

    // ----------------------------------------------------------
    // removeFromCart(productId)
    // Filters out the item with the matching productId and saves.
    // ----------------------------------------------------------
    removeFromCart(productId) {
      this.cartItems = this.cartItems.filter(
        (cartItem) => cartItem.productId !== productId
      );
      this.saveToStorage();
    },

    // ----------------------------------------------------------
    // calculateCartQuantity()
    // Sums all item quantities and updates the cart badge element
    // in the DOM (if it exists on the current page).
    // ----------------------------------------------------------
    calculateCartQuantity() {
      const cartQuantity = this.cartItems.reduce(
        (accum, cartItem) => accum + cartItem.quantity,
        0
      );

      const el = document.querySelector(".js-cart-quantity");
      if (el) el.innerHTML = cartQuantity;
    },

    // ----------------------------------------------------------
    // updateQuantity(productId, newQuantity)
    // Directly sets the quantity for a specific product.
    // Does nothing if the product isn't in the cart.
    // ----------------------------------------------------------
    updateQuantity(productId, newQuantity) {
      const matchingItem = this.cartItems.find(
        (cartItem) => cartItem.productId === productId
      );

      if (!matchingItem) return;

      matchingItem.quantity = newQuantity;
      this.saveToStorage();
    },

    // ----------------------------------------------------------
    // updateDeliveryOption(productId, deliveryOptionId)
    // Changes the selected delivery option for a product and
    // immediately persists the change to localStorage.
    // ----------------------------------------------------------
    updateDeliveryOption(productId, deliveryOptionId) {
      const matchingItem = this.cartItems.find(
        (cartItem) => cartItem.productId === productId
      );
      if (!matchingItem) return;

      matchingItem.deliveryOptionId = deliveryOptionId;
      this.saveToStorage();
    },
  };

  // BUG FIX: was `return Cart()` — a recursive call with no base case,
  // causing infinite recursion and a stack overflow.
  // The factory should return the object it just built, not call itself.
  return cartObj;
}

// ============================================================
// Create independent cart instances, each with its own
// localStorage key so they never overwrite each other.
// ============================================================
 const cart = Cart("cart-oop");
const businessCart = Cart("cart-business");

// Load persisted data (or seed defaults) for both carts
cart.loadFromStorage();

cart.addToCart("83d4ca15-0f35-48f5-b7a3-1ea210004f2e");

businessCart.loadFromStorage();

// Patch any legacy items that are missing deliveryOptionId
cart.ensureDeliveryOptionIds();

// Example: add a product to the main cart
// (requires a .js-quantity-selector-<id> element in the DOM)

console.log(cart);
console.log(businessCart);

// ============================================================
// Update the cart quantity badge once the DOM is ready.
// We call it on `cart` specifically — adjust if your page needs
// a combined total across multiple cart objects.
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  cart.calculateCartQuantity();
});