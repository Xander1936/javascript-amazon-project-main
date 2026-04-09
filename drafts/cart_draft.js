// Export the cart
export let cart = JSON.parse(localStorage.getItem("cart"));

// Helper: persist cart
function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// If cart doesn't exist, create default cart (with deliveryOptionId)
if (!cart) {
  cart = [
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
  saveToStorage();
}

// Ensure legacy carts (already saved) have deliveryOptionId.
// If you previously stored cart items without deliveryOptionId, we add a default.
function ensureDeliveryOptionIds() {
  // Default to first option "1" if missing.
  // You can change this default if your deliveryOptions ids differ.
  const DEFAULT_DELIVERY_OPTION_ID = "1";
  // We loop through each item in the cart and check if it has a deliveryOptionId. If it doesn't, we assign it the default delivery option id. We also keep track of whether we made any changes to the cart items using the didChange variable. If we did make changes, we call saveToStorage() to persist the updated cart with deliveryOptionIds.
  let didChange = false;

  cart.forEach((item) => {
    if (!item.deliveryOptionId) {
      item.deliveryOptionId = DEFAULT_DELIVERY_OPTION_ID;
      didChange = true;
    }
  });

  if (didChange) saveToStorage();
}

ensureDeliveryOptionIds();

// Add products in the cart
export function addToCart(productId) {
  // We check if the product is already in the cart by looking for a matching item with the same productId. If we find a matching item, we increase its quantity by the selected amount from the dropdown. If we don't find a matching item, it means the product is not yet in the cart, so we create a new cart item with the productId, the selected quantity from the dropdown, and a default deliveryOptionId of "1", and we add this new item to the cart array.
  let matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  if (matchingItem) {
    // If the product is already in the cart, we increase its quantity by the selected amount from the dropdown. We find the quantity selector for the specific product using its id in the class name, get its value, convert it to a number, and add it to the existing quantity of the matching cart item.
    matchingItem.quantity += Number(
      document.querySelector(`.js-quantity-selector-${productId}`).value
    );
  } else {
    cart.push({
      productId: productId,
      quantity: Number(
        document.querySelector(`.js-quantity-selector-${productId}`).value
      ),
      // Provide a default deliveryOptionId for new items
      deliveryOptionId: "1",
    });
  }

  saveToStorage();
}

// Remove product from cart
export function removeFromCart(productId) {
  // We remove a product from the cart by filtering out the cart item with the specified productId. We create a new array that includes only the cart items whose productId does not match the given productId, effectively removing the item from the cart. After updating the cart array, we call saveToStorage() to persist the changes.
  cart = cart.filter((cartItem) => cartItem.productId !== productId);
  saveToStorage();
}

// Calculate total quantity of products in cart
export function calculateCartQuantity() {
  // We calculate the total quantity of products in the cart by using the reduce method to sum up the quantity of each cart item. 
  // We start with an initial value of 0 and add the quantity of each cart item to this accumulator. 
  // The result is stored in the cartQuantity variable.
  let cartQuantity = cart.reduce((accum, cartItem) => accum + cartItem.quantity, 0);

  const el = document.querySelector(".js-cart-quantity");
  // We update the cart quantity badge in the header by setting its innerHTML to the calculated cart quantity. 
  // If the element exists, we update it; otherwise, we do nothing.
  if (el) el.innerHTML = cartQuantity;
}

// Update quantity of a product
export function updateQuantity(productId, newQuantity) {
    // We update the quantity of a product in the cart by finding the matching cart item with the specified productId. 
   // If we find a matching item, we set its quantity to the new quantity provided as an argument. 
  // After updating the quantity, we call saveToStorage() to persist the changes to localStorage.
  let matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  if (matchingItem) {
    matchingItem.quantity = newQuantity;
    saveToStorage();
  }
}

// Update delivery option of a product
export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (!matchingItem) return;

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

// Initialize quantity display on pages that have the cart badge
document.addEventListener("DOMContentLoaded", calculateCartQuantity);