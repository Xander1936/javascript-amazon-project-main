// orderSummary.js
import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";

import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";


function formatDeliveryDate(deliveryDays) {
  return dayjs().add(deliveryDays, "day").format("dddd, MMMM D");
}

function getDeliveryOptionById(optionId) {
  return deliveryOptions.find((option) => option.id === optionId);
}

function deliveryOptionsHTML(matchingProduct, cartItem) {
  return deliveryOptions.map((option) => {
    const dateString = formatDeliveryDate(option.deliveryDays);
    const priceString =
      option.priceCents === 0 ? "FREE" : `$${formatCurrency(option.priceCents)} -`;
    const isChecked = option.id === cartItem.deliveryOptionId;

    return `
      <div
        class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${option.id}"
      >
        <input
          type="radio"
          ${isChecked ? "checked" : ""}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}"
        >
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">${priceString} Shipping</div>
        </div>
      </div>
    `;
  }).join("");
}

export function renderOrderSummary() {
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    const matchingProduct = getProduct(cartItem.productId);
    if (!matchingProduct) return;

    if (!cartItem.deliveryOptionId) {
      cartItem.deliveryOptionId = deliveryOptions[0]?.id;
    }

    const deliveryOption = getDeliveryOptionById(cartItem.deliveryOptionId);
    const dateString = deliveryOption
      ? formatDeliveryDate(deliveryOption.deliveryDays)
      : formatDeliveryDate(0);


    // orderSummary.js  — only the HTML template inside renderOrderSummary() changes

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}"
          data-product-id="${matchingProduct.id}">
        <div class="delivery-date">Delivery date: ${dateString}</div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">
          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>

            <div class="product-quantity js-product-quantity-${matchingProduct.id}">
              <span class="quantity-display">
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>

              <span class="update-quantity-link link-primary"
                    data-product-id="${matchingProduct.id}">Update</span>

              <input
                type="number"
                class="quantity-input js-quantity-input-${matchingProduct.id}"
                value="${cartItem.quantity}"
                min="1"
                style="width: 30px; display: none;"
              >

              <span class="save-quantity-link link-primary" style="display: none;">Save</span>

              <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}"
                    data-product-id="${matchingProduct.id}">Delete</span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  const summaryEl = document.querySelector(".js-order-summary");
  if (summaryEl) summaryEl.innerHTML = cartSummaryHTML;

  bindDeleteEvents();
  bindQuantityEditEvents();
  bindQuantitySaveEvents();
  bindDeliveryOptionEvents();
}

function bindDeleteEvents() {
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
       
      document.querySelector(`.js-cart-item-container-${productId}`)?.remove();
      calculateCartQuantity();
      renderPaymentSummary();
    });
  });
}

function bindQuantityEditEvents() {
  document.querySelectorAll(".update-quantity-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const container = link.closest(".cart-item-container");
      container.querySelector(".quantity-display").style.display = "none";
      container.querySelector(".update-quantity-link").style.display = "none";
      const input = container.querySelector(".quantity-input");
      const saveLink = container.querySelector(".save-quantity-link");
      input.style.display = "initial";
      saveLink.style.display = "initial";

      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") validateAndSaveQuantity(container, input);
      });
    });
  });
}

function bindQuantitySaveEvents() {
  document.querySelectorAll(".save-quantity-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const container = link.closest(".cart-item-container");
      validateAndSaveQuantity(container, container.querySelector(".quantity-input"));
    });
  });
}

function validateAndSaveQuantity(container, input) {
  const newQuantity = Number(input.value);
  const productId = container.dataset.productId;

  if (Number.isNaN(newQuantity) || newQuantity < 0 || newQuantity >= 1000) {
    alert("Please enter a quantity between 0 and 999.");
    return;
  }

  input.style.display = "none";
  container.querySelector(".save-quantity-link").style.display = "none";
  container.querySelector(".quantity-display").style.display = "inline";
  container.querySelector(".update-quantity-link").style.display = "inline";
  container.querySelector(".quantity-label").textContent = newQuantity;

  updateQuantity(productId, newQuantity);
  calculateCartQuantity();
  renderPaymentSummary();
}

function bindDeliveryOptionEvents() {
  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}