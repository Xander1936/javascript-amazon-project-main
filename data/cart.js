// Get a Variable out of a file with module
// 1. Add type="module" attribute
// 2. Export
// 3. import

// Export the cart
export const cart = [];

// Step 9: Create a Function to add products in the cart
// Step 10: Put related code together 
export function addToCart(productId) {
    // Create the variable to match the selected product with the productId 
    let matchingItem; 
      // Loop throw the products and add them 
      cart.forEach((cartItem) => {
          if (productId === cartItem.productId) {
              matchingItem = cartItem;
          }
      });
  
      if (matchingItem) {
          matchingItem.quantity += 1;
      } else {
          cart.push({
              productId: productId,
              quantity: 1
          });
      }
  }
  