// checkout.js
import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
  updateDeliveryOption,
} from "../data/cart.js";

import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../data/deliveryOptions.js";

// ---------- Helpers ----------

function formatDeliveryDate(deliveryDays) {
  const today = dayjs();
  const deliveryDate = today.add(deliveryDays, "day");
  return deliveryDate.format("dddd, MMMM D");
}

function getDeliveryOptionById(optionId) {
  return deliveryOptions.find((option) => option.id === optionId);
}

// Build the radio inputs HTML for delivery options (checked based on cart state)
function deliveryOptionsHTML(matchingProduct, cartItem) {
  const deliveryOptionId = cartItem.deliveryOptionId;

  let html = "";

  deliveryOptions.forEach((option) => {
    const dateString = formatDeliveryDate(option.deliveryDays);

    const priceString =
      option.priceCents === 0 ? "FREE" : `$${formatCurrency(option.priceCents)} -`;

    const isChecked = option.id === deliveryOptionId;

    html += `
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
  });

  return html;
}

// ---------- Render cart summary ----------

export function renderOrderSummary() {
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = products.find((product) => product.id === productId);
    if (!matchingProduct) return;

    // Ensure deliveryOptionId exists (just in case)
    if (!cartItem.deliveryOptionId) {
      cartItem.deliveryOptionId = deliveryOptions[0]?.id;
    }

    const deliveryOption = getDeliveryOptionById(cartItem.deliveryOptionId);
    const dateString = deliveryOption
      ? formatDeliveryDate(deliveryOption.deliveryDays)
      : formatDeliveryDate(0);

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}"
           data-product-id="${productId}">
        <div class="delivery-date">Delivery date: ${dateString}</div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">
          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>

            <div class="product-quantity">
              <span class="quantity-display">
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>

              <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                Update
              </span>

              <input
                type="number"
                class="quantity-input js-quantity-input-${matchingProduct.id}"
                value="${cartItem.quantity}"
                min="1"
                style="width: 30px; display: none;"
              >

              <span class="save-quantity-link link-primary" style="display: none;">Save</span>

              <span class="delete-quantity-link link-primary js-delete-link"
                    data-product-id="${matchingProduct.id}">
                Delete
              </span>
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
}

// ---------- Events: Delete ----------

function bindDeleteEvents() {
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;

      removeFromCart(productId);

      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      if (container) container.remove();

      calculateCartQuantity();
    });
  });
}

// ---------- Events: Update quantity (UI edit mode) ----------

function bindQuantityEditEvents() {
  document.querySelectorAll(".update-quantity-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const cartItemContainer = link.closest(".cart-item-container");

      cartItemContainer.classList.add("is-editing-quantity");

      const quantityDisplay = cartItemContainer.querySelector(".quantity-display");
      const updateLink = cartItemContainer.querySelector(".update-quantity-link");
      if (quantityDisplay) quantityDisplay.style.display = "none";
      if (updateLink) updateLink.style.display = "none";

      const quantityInput = cartItemContainer.querySelector(".quantity-input");
      const saveLink = cartItemContainer.querySelector(".save-quantity-link");

      if (quantityInput) quantityInput.style.display = "initial";
      if (saveLink) saveLink.style.display = "initial";

      quantityInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          validateAndSaveQuantity(cartItemContainer, quantityInput);
        }
      });
    });
  });
}

// ---------- Events: Save quantity ----------

function bindQuantitySaveEvents() {
  document.querySelectorAll(".save-quantity-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const cartItemContainer = link.closest(".cart-item-container");
      const quantityInput = cartItemContainer.querySelector(".quantity-input");

      validateAndSaveQuantity(cartItemContainer, quantityInput);
    });
  });
}

function validateAndSaveQuantity(cartItemContainer, quantityInput) {
  const newQuantity = Number(quantityInput.value);
  const productId = cartItemContainer.dataset.productId;

  if (Number.isNaN(newQuantity) || newQuantity < 0 || newQuantity >= 1000) {
    alert("Please enter a quantity between 0 and 999.");
    return;
  }

  cartItemContainer.classList.remove("is-editing-quantity");

  quantityInput.style.display = "none";
  const saveLink = cartItemContainer.querySelector(".save-quantity-link");
  if (saveLink) saveLink.style.display = "none";

  const quantityDisplay = cartItemContainer.querySelector(".quantity-display");
  if (quantityDisplay) quantityDisplay.style.display = "inline";

  const updateLink = cartItemContainer.querySelector(".update-quantity-link");
  if (updateLink) updateLink.style.display = "inline";

  updateQuantity(productId, newQuantity);

  const quantityLabel = cartItemContainer.querySelector(".quantity-label");
  if (quantityLabel) quantityLabel.textContent = newQuantity;

  calculateCartQuantity();
}

// ---------- Events: Persist delivery option instantly ----------

function bindDeliveryOptionEvents() {
  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;

      // 1) Persist immediately
      updateDeliveryOption(productId, deliveryOptionId);

      // 2) Re-render summary so the correct date + radio is reflected instantly
      renderOrderSummary();

      // 3) Re-bind events for the newly rendered DOM
      bindDeleteEvents();
      bindQuantityEditEvents();
      bindQuantitySaveEvents();
      bindDeliveryOptionEvents();
    });
  });
}

// ---------- Init ----------

renderOrderSummary();

bindDeleteEvents();
bindQuantityEditEvents();
bindQuantitySaveEvents();
bindDeliveryOptionEvents();

// Ensure badge count is updated
calculateCartQuantity();