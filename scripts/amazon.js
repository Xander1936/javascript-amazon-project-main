import { cart, addToCart, calculateCartQuantity } from '../data/cart.js';
import { products } from '../data/products.js'; 
import { formatCurrency } from './utils/money.js';

// Step 1: Save the data
let productsHTML = '';

// Step 2: Generate the HTML
products.forEach((product) => {
    productsHTML += `
        <div class="product-container">
          <div class="product-image-container">
            <img class="product-image" src="${product.image}">
          </div>
          <div class="product-name limit-text-to-2-lines">${product.name}</div>
          <div class="product-rating-container">
            <img class="product-rating-stars" src="${product.getStarsUrl()}">
            <div class="product-rating-count link-primary">${product.rating.count}</div>
          </div>
          <div class="product-price">${product.getPrice()}</div>
          <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option> 
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          ${product.extraInfoHTML()}

          <div class="product-spacer"></div>
          <div class="added-to-cart">
            <img src="images/icons/checkmark.png"> Added
          </div>
          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
    `;
});
// Step 3: Insert the HTML into the page
document.querySelector('.js-products-grid').innerHTML = productsHTML;

// Initialize cart quantity on load
calculateCartQuantity();
// Step 4: Add event listeners to the add to cart buttons
document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    // We add a click event listener to each add to cart button
    button.addEventListener('click', () => {
      // We get the productId from the data attribute of the clicked button
        const productId = button.dataset.productId;
        // We call the addToCart function from the cart.js file to add the product to the cart with the selected quantity
        addToCart(productId);
        // We show the "Added to Cart" message by targeting the added-to-cart element inside the clicked product container and adding the "visible" class to it
        calculateCartQuantity();         
    });
});