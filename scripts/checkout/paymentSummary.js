// paymentSummary.js
// import "../data/cart-class.js";
import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from '../utils/money.js';
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary() {
    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        if (!product) return; // ← guard: skip if product not found

        productPriceCents += product.priceCents * cartItem.quantity;

        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        if (!deliveryOption) return; // ← guard: skip if delivery option not found

        shippingPriceCents += deliveryOption.priceCents;

    });

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforeTaxCents * 0.1;
    const totalCents = totalBeforeTaxCents + taxCents;

    const paymentSummaryHTML = `
        <div class="payment-summary-title">
          Order Summary
        </div>

        <div class="payment-summary-row">
          <div>Items (${cart.length}):</div>
          <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
        </div>

        <div class="payment-summary-row">
          <div>Shipping &amp; handling:</div>
          <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
          <div>Total before tax:</div>
          <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
        </div>

        <div class="payment-summary-row">
          <div>Estimated tax (10%):</div>
          <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
        </div>

        <div class="payment-summary-row total-row">
          <div>Order total:</div>
          <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
        </div>

        <button class="place-order-button button-primary add-to-cart-button 
        js-place-order">
          Place your order
        </button>
    `;

    // ← Guard: only set innerHTML if the element actually exists
    const paymentSummaryEl = document.querySelector('.js-payment-summary');
    if (!paymentSummaryEl) {
        console.error('renderPaymentSummary: .js-payment-summary element not found in the DOM.');
        return;
    }

    
    paymentSummaryEl.innerHTML = paymentSummaryHTML;

    document.querySelector('.js-place-order')
    .addEventListener('click', async () => {
      try {
          const response = await fetch('https://supersimplebackend.dev/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cart: cart
          })
        });

        const order = await response.json();
        // console.log(order);
        addOrder(order);
      } catch (error) {
        console.error('Error placing order:', error);
        alert('Sorry, there was an error placing your order. Please try again.');
        return;
      }

      window.location.href = "orders.html";
    });
}