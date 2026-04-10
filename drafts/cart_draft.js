// cart.js
export let cart = [];

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// NEW: exported so tests can reload cart state after setting up spies
export function loadFromStorage() {
  const stored = JSON.parse(localStorage.getItem("cart"));

  if (stored) {
    cart = stored;
  } else {
    cart = [
      { productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6", quantity: 2, deliveryOptionId: "1" },
      { productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d", quantity: 1, deliveryOptionId: "2" },
    ];
    saveToStorage();
  }

  ensureDeliveryOptionIds();
}

function ensureDeliveryOptionIds() {
  const DEFAULT_DELIVERY_OPTION_ID = "1";
  let didChange = false;
  cart.forEach((item) => {
    if (!item.deliveryOptionId) {
      item.deliveryOptionId = DEFAULT_DELIVERY_OPTION_ID;
      didChange = true;
    }
  });
  if (didChange) saveToStorage();
}

export function addToCart(productId) {
  const matchingItem = cart.find((cartItem) => cartItem.productId === productId);
  if (matchingItem) {
    matchingItem.quantity += Number(
      document.querySelector(`.js-quantity-selector-${productId}`).value
    );
  } else {
    cart.push({
      productId,
      quantity: Number(document.querySelector(`.js-quantity-selector-${productId}`).value),
      deliveryOptionId: "1",
    });
  }
  saveToStorage();
}

export function removeFromCart(productId) {
  cart = cart.filter((cartItem) => cartItem.productId !== productId);
  saveToStorage();
}

export function calculateCartQuantity() {
  const cartQuantity = cart.reduce((accum, cartItem) => accum + cartItem.quantity, 0);
  const el = document.querySelector(".js-cart-quantity");
  if (el) el.innerHTML = cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
  const matchingItem = cart.find((cartItem) => cartItem.productId === productId);
  if (!matchingItem) return;
  matchingItem.quantity = newQuantity;
  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  const matchingItem = cart.find((cartItem) => cartItem.productId === productId);
  if (!matchingItem) return;
  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

document.addEventListener("DOMContentLoaded", () => {
  loadFromStorage();
  calculateCartQuantity();
});