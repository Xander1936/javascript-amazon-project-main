// Main Idea Of Javascript
// 1. Save the data : data = infos about our products
// 2. Generate the HTML
// 3. Make it interactive

// Module cart: Avoid naming conflicts, is a better way to organize our code
// With the modules the order the scripts files doesn't matter   
// Open the variable cart from cart.js
// Do this again with products.js file 
import { cart } from '../data/cart.js';
import { products } from '../data/products.js'; 


// Step 1: Save the data
// This is called a data structure.
/* const products = [
{
    image: "images/products/athletic-cotton-socks-6-pairs.jpg",
    name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
    rating: {
        stars: 4.5,
        count: 87
    },
    priceCents: 1090
},
{
    image: "images/products/intermediate-composite-basketball.jpg",
    name: "Intermediate Size Basketball",
    rating: {
        stars: 4,
        count: 127
    },
    priceCents: 2095
},
{
    image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
    name: "Adults Plain Cotton T-Shirt - 2 Pack",
    rating: {
        stars: 4.5,
        count: 56
    },
    priceCents: 799
},
{
    image: 'images/products/black-2-slot-toaster.jpg',
    name: '2 Slot Toaster - Black',
    rating: {
        stars: 5,
        count: 2197
    },
    priceCents: 1899
},
]; */
// Step 3: First Create a Variable at the top
let productsHTML = '';

// Step 2: Generate the HTML
// Use the data to generate the HTML
// Loop throw the Array of products
products.forEach((product) => {
    // Step 3: Second save the HTML into the variable productsHTML
    // productsHTML += means productsHTML = productsHTML + 
    // productsHTML '+=' it's an Accumulation Pattern
    // Pour les arrondis uitliser la methode toFixed()
    // Delete all the HTML code (amazon.html line 55) for the products
    productsHTML += `
        <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            $${(product.priceCents / 100).toFixed(2)}
          </div>

          <div class="product-quantity-container">
            <select>
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

          <div class="product-spacer"></div>

          <div class="added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" 
          data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
    `;
})

// Step 3: Combine this HTML together into
// one string and put it on the web page


// Step 4: Take the HTML 
// And put it on the web page (using the DOM)
// Use the DOM:
// '.' means look and take the element with the class of js-products-grid
// '.innerHTML means change the HTML inside the element
document.querySelector('.js-products-grid').innerHTML = productsHTML;

// Add the products with the JSON in data folder throw the products.js file
// Step 5: Delete the Array of products line 8 or comment it.
// Add <script src="data/products.js"></script> in the amazon.html file to loop and load the products.

// Step 6: Use and eventListener and Make the  Website interactive.
// Create a cart.js file inside the data folder and link it in the amazon.html file
// Add a data attribute in the button after the class to attach any information to an element.
// Un data attribute s'écrit toujours avec "data-" au début et il faut séparer le nom avec "-" 
document.querySelectorAll('.js-add-to-cart')
    .forEach((button) => {
        button.addEventListener('click', () => {
            // console.log('Added product');
            // 'dataset' récupère l'attribut HTML data attribute 'data-'
            // console.log(button.dataset.productName);
            // Always use the productId because two products with the same name can be saved to the cart. 
            const productId = button.dataset.productId;
            
            let matchingItem;

            // Loop throw the products and add them 
            cart.forEach((item) => {
                if (productId === item.productId) {
                    matchingItem = item;
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
            // Step 7:
            // The cart is an array of objects
            // So let's loop throw each object in the array
            // Then calculate the quantity
            let cartQuantity = 0;
            cart.forEach((item) => {
                // Accumulation pattern
                cartQuantity += item.quantity;
            });

            // Step 8: Put the quantity on the page using the DOM
            document.querySelector('.js-cart-quantity')
                .innerHTML = cartQuantity


            // console.log(cartQuantity);
            // console.log(cart)
        });
    })
