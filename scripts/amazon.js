// Main Idea Of Javascript
// 1. Save the data : data = infos about our products
// 2. Generate the HTML
// 3. Make it interactive

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
    // productsHTML += it's an Accumulator Pattern
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

          <button class="add-to-cart-button button-primary">
            Add to Cart
          </button>
        </div>
    `;
})

// Step 3: Combine this HTML together into
// one string and put it on the web page
console.log(productsHTML);

// Step 4: Take the HTML 
// And put it on the web page (using the DOM)
// Use the DOM:
// '.' means look and take the element with the class of js-products-grid
// '.innerHTML means change the HTML inside the element
document.querySelector('.js-products-grid').innerHTML = productsHTML;

// Add the products with the JSON in data folder throw the products.js file
// Step 5: Delete the Array of products line 8 or comment it.
// Add <script src="data/products.js"></script> in the amazon.html file to loop and load the products.
