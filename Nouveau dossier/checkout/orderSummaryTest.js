import { renderOrderSummary } from '../../scripts/checkout/orderSummary.js';
import { loadFromStorage, cart } from "../../data/cart.js";

// Integration test -> multiple unit tests: 2 things to test: 
// 1. How the page looks
// 2. How the page behaves
describe('test suite: renderOrderSummary', () => {
    // Make this variables global
    const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
    const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';
    
    // Jasmine Hook: that helps to share code between our tests 
    // e.g. 
    // beforeEach() = runs code before each test, 
    // afterEach() = runs code after each test, 
    // beforeAll() = runs code before all tests, 
    // afterAll()= runs code after all tests
    beforeEach(() => {
        spyOn(localStorage, 'setItem');
        document.querySelector('.js-test-container').innerHTML = `
        <div class="js-order-summary"></div>
        <div class="js-payment-summary"></div>
        `;
    
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([
                {
                    productId: productId1,
                    quantity: 1,
                    deliveryOptionId: '1'
                },{
                    productId: productId2,
                    quantity: 1,
                    deliveryOptionId: '3'
                }]);
        });
        // console.log(localStorage.getItem('cart'));
        loadFromStorage();
        
        renderOrderSummary();
    });
    
    it('displays the cart', () => {
        expect(
            document.querySelectorAll('.js-cart-item-container').length
        ).toEqual(2);
        // Add a new javascript class '.js-product-quantity' to the quantity 
        // and finally test with innerText and .toContain('Expected text') methods.
        expect(
            document.querySelector(`.js-product-quantity-${productId1}`).innerText
        ).toContain('Quantity: 1');
        expect(
            document.querySelector(`.js-product-quantity-${productId2}`).innerText
        ).toContain('Quantity: 1');

        document.querySelector('.js-test-container').innerHTML = '';
    });

    it('removes a product', () => {
        document.querySelector(`.js-delete-link-${productId1}`).click();    
        expect(
            document.querySelectorAll('.js-cart-item-container').length
        ).toEqual(1);
        expect(
            document.querySelector(`.js-cart-item-container-${productId1}`)
        ).toEqual(null);
        // .not.toEqual opposite of toEqual
        expect(
            document.querySelector(`.js-cart-item-container-${productId2}`)
        ).not.toEqual(null);
        // After deleting product1 expect only product2 in the cart
        expect(cart.length).toEqual(1);
        // Verify the only product remains in the cart is product2
        expect(cart[0].productId).toEqual(productId2);
        
        // Removes all the view of the test result
        document.querySelector('.js-test-container').innerHTML = '';
    });
});