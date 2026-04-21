import { renderOrderSummary } from "../scripts/checkout/orderSummary.js";
import { renderPaymentSummary } from "../scripts/checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";
import { loadCart } from "../data/cart.js";
// import "../data/cart-class.js";
// import "../data/backend-practice.js";

// Promises allows JavaScript to run many codes at the same time. 
// Promises help keep our code flat and avoid too much nesting. 
// Use promises instead of callbacks.
// resolve() is a function  - similar to done() function in jasmine - lets us control when to go to the next step.

// Promise.all() lets us run multiple promises at the same time.
Promise.all([
    // This Promise do the same thing as the previous loadProducts() callback function.
    new Promise((resolve) => {
        // console.log('start promise');
        // We wait to the products finish loading then go to the next step with ".then(() => {})".
        loadProducts(() => {
            // console.log('finished loading');
            // Lets us control when to go to the next step.
            resolve('value1');
        });
    }),

    new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    }) 

]).then((values) => {
    console.log(values);
    renderOrderSummary();
    renderPaymentSummary();
});


/*
// This Promise do the same thing as the previous loadProducts() callback function.
new Promise((resolve) => {
    // console.log('start promise');
    // We wait to the products finish loading then go to the next step with ".then(() => {})".
    loadProducts(() => {
        // console.log('finished loading');
        // Lets us control when to go to the next step.
        resolve('value1');
    });

}).then((value) => {
    console.log(value);
    
    // console.log('next step');
    // renderOrderSummary();
    // renderPaymentSummary();
    
    return new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    });

}).then(() => {
    renderOrderSummary();
    renderPaymentSummary();
});
*/

// Callback Function - loadProducts()
/*
loadProducts(() => {
    loadCart(() => {
        renderOrderSummary();
        renderPaymentSummary();
    });
});
*/