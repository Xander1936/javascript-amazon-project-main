import { renderOrderSummary } from "../scripts/checkout/orderSummary.js";
import { renderPaymentSummary } from "../scripts/checkout/paymentSummary.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";
// import "../data/cart-class.js";
// import "../data/backend-practice.js";


// Promises allows JavaScript to run many codes at the same time. 
// Promises help keep our code flat and avoid too much nesting. 
// Use promises instead of callbacks.
// resolve() is a function  - similar to done() function in jasmine - lets us control when to go to the next step.

// async makes a function return a promise and lets us use await.
// await = lets us write asynchronous code like normal code
// The best practice is to use async / await over promises and callbacks. 
async function loadPage() {
    // Handle error in async / await using try {} catch (error) {}
    // We can use try / catch to catch errors in normal code.
    try {
        // We can manually create errors with throw
        // throw 'error1';

        // console.log('load page');
    
        // await = we can only use it when we are inside an async function.
        await loadProductsFetch();

        const value = await new Promise((resolve, reject) => {
            // throw 'error2';
            loadCart(() => {
                // reject('error3');
                resolve('value3');
            });
        });
    } catch (error) {
        console.log('Unexpected error. Please try again later.');  
    } 

    renderOrderSummary();
    renderPaymentSummary();

    // return 'value2';
}
loadPage();

/*
// Promise.all() lets us run multiple promises at the same time.
Promise.all([
    // This Promise do the same thing as the previous loadProducts() callback function.
    loadProductsFetch(),

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
*/

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