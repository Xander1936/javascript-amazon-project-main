# 🛒 JavaScript Amazon Project

A feature-rich, full-stack-style **Amazon e-commerce clone** built entirely with **Vanilla JavaScript (ES Modules)**, HTML5, and CSS3. This project simulates a real-world online shopping experience — from browsing products to checkout and order tracking — with cart persistence via `localStorage` and automated tests via Jasmine.

> **Built as part of** [SuperSimpleDev's JavaScript Full Course](https://github.com/SuperSimpleDev/javascript-amazon-project), extended and customized by [Alexandre Massoda](https://github.com/Xander1936) with additional features, refactored architecture, and a complete Jasmine test suite.

---

## 🚀 Live Demo

> 🔗 **[View Live on Vercel](https://javascript-amazon-project-main-blond.vercel.app/)**  
> *(or open `amazon.html` locally — no build step required)*

---

## 📸 Screenshots

| Product Listing | Cart & Checkout | Payment Summary |
|---|---|---|
| `amazon.html` | `checkout.html` | `checkout.html` |
| Browse 40+ products with ratings, prices, and quantity selectors | Manage cart items, update quantities, delete products, choose delivery options | Real-time order total with tax calculation and place-order button |

---

## ✨ Features

### 🛍️ Shopping Page (`amazon.html`)
- Browse a catalog of **40+ products** with images, names, star ratings, and prices
- Select quantity (1–10) before adding to cart
- **Add to Cart** with real-time badge update showing total item count
- Cart count persists across page reloads via `localStorage`

### 🧺 Cart & Checkout (`checkout.html`)
- View all cart items with product image, name, price, and quantity
- **Inline quantity editing** — click "Update", type a new value, press Enter or "Save"
- **Delete items** individually from the cart
- Choose from **3 delivery options** per item (Free / Standard / Express), each showing a calculated delivery date using [Day.js](https://unpkg.com/dayjs@1.11.10/esm/index.js)
- Cart state is persisted and restored from `localStorage` on every visit

### 💳 Payment Summary (sidebar)
- Live calculation of:
  - **Items subtotal** (price × quantity for all cart items)
  - **Shipping & handling** (sum of selected delivery option costs)
  - **Total before tax**
  - **Estimated tax (10%)**
  - **Order total**
- "Place your order" button

### 📦 Orders Page (`orders.html`)
- View past orders with product details and tracking links

### 📍 Tracking Page (`tracking.html`)
- Visual order tracking status per item

### 🧪 Automated Testing (Jasmine)
- Full unit test suite for `cart.js` using **Jasmine**
- Tests cover: adding existing products, adding new products, quantity increments, `localStorage` persistence, delivery option defaults, and edge cases

---

## 🗂️ Project Structure

```
javascript-amazon-project-main/
│
├── amazon.html              # Main product listing page
├── checkout.html            # Cart, delivery options & payment summary
├── orders.html              # Past orders view
├── tracking.html            # Order tracking view
│
├── data/                    # Core data layer (ES Modules)
│   ├── cart.js              # Cart state, localStorage persistence, all cart operations
│   ├── products.js          # Product catalog (40+ items with IDs, images, prices, ratings)
│   └── deliveryOptions.js   # Delivery options (id, deliveryDays, priceCents)
│
├── scripts/                 # UI logic layer
│   ├── amazon.js            # Product rendering + Add to Cart for amazon.html
│   ├── checkout.js          # Entry point: imports and calls renderOrderSummary + renderPaymentSummary
│   ├── checkout/
│   │   ├── orderSummary.js  # Renders cart items, binds delete/update/delivery events
│   │   └── paymentSummary.js# Calculates and renders cost breakdown sidebar
│   └── utils/
│       └── money.js         # formatCurrency() helper (cents → "$X.XX")
│
├── styles/                  # CSS
│   ├── shared/
│   │   └── general.css      # Base styles, header, nav
│   └── pages/
│       ├── amazon.css       # Product grid styles
│       └── checkout.css     # Cart, delivery options, payment summary styles
│
├── images/                  # Static assets
│   ├── products/            # Product images (JPG/WEBP)
│   ├── icons/               # UI icons (cart, ratings, etc.)
│   └── ratings/             # Star rating images
│
├── backend/
│   └── products.json        # Products data (JSON format for backend use)
│
└── tests-jasmine/           # Jasmine test suite
    ├── data/                # CartTest.js
    |   └── cartTest.js      # Unit tests for addToCart()
    ├── utils/               # moneyTest.js
    |   └── moneyTest.js     # Unit tests for formatCurrency()
    └── checkout/            # orderSummaryTest.js
        └── orderSummaryTest.js # Unit tests for renderOrderSummary()
```

---

## 🧰 Tech Stack

| Category | Technology |
|---|---|
| **Language** | Vanilla JavaScript (ES2020+, ES Modules) |
| **Markup** | HTML5 |
| **Styling** | CSS3 (custom, no framework) |
| **Date handling** | [Day.js](https://unpkg.com/dayjs@1.11.10/esm/index.js) via CDN (ESM) |
| **Persistence** | `localStorage` API |
| **Testing** | [Jasmine](https://jasmine.github.io/) v5.x |
| **Module system** | Native ES Modules (`type="module"`) |
| **Build tool** | None — runs directly in the browser |

---

## ⚙️ Architecture & Design Decisions

### ES Modules
All JavaScript files use `import`/`export` with `type="module"` script tags. This enforces clean separation of concerns and avoids global namespace pollution.

### Data / UI Separation (MVC-inspired)
```
data/         → Model  (state, localStorage, business logic)
scripts/      → View + Controller  (DOM rendering, event binding)
```

### Cart Persistence
The cart is stored as a JSON array in `localStorage` under the key `"cart"`. On every page load, `loadFromStorage()` reads and validates the cart, ensuring all items have a `deliveryOptionId` (backwards compatibility for legacy saved carts).

### Event Rebinding Pattern
When a delivery option is selected, `renderOrderSummary()` re-renders the entire cart HTML and rebinds all events — ensuring the UI always reflects the latest state without stale event listeners.

### Delivery Date Calculation
Delivery dates are computed dynamically using Day.js:
```javascript
dayjs().add(option.deliveryDays, 'day').format('dddd, MMMM D')
// → "Monday, April 14"
```

---

## 🛠️ Getting Started

### Prerequisites
- A modern browser (Chrome, Firefox, Edge, Safari)
- A local server (required for ES Modules — see note below)

> ⚠️ **ES Modules require a server.** Opening `amazon.html` directly via `file://` will cause CORS errors. Use one of the options below.

### Option 1 — VS Code Live Server (recommended)
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Right-click `amazon.html` → **"Open with Live Server"**

### Option 2 — Python HTTP Server
```bash
# Python 3
python -m http.server 3000
# Then open: http://localhost:3000/amazon.html
```

### Option 3 — Node.js
```bash
npx serve .
# Then open the URL shown in the terminal
```

### Clone the repository
```bash
git clone https://github.com/Xander1936/javascript-amazon-project-main.git
cd javascript-amazon-project-main
```

---

## 🧪 Running the Tests

This project uses **Jasmine** for unit testing. Tests are written for `cart.js` and cover all branches of `addToCart()`.

### Setup
1. Download [Jasmine standalone](https://github.com/jasmine/jasmine/releases/tag/v5.1.1) and place it in a `jasmine/` folder at the project root, or use the CDN version.

2. Create a `SpecRunner.html` at the root:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Jasmine Tests</title>
  <link rel="stylesheet" href="jasmine/jasmine.css">
  <script src="jasmine/jasmine.js"></script>
  <script src="jasmine/jasmine-html.js"></script>
  <script src="jasmine/boot0.js"></script>
  <script src="jasmine/boot1.js"></script>
</head>
<body>
  <script type="module" src="tests/cartTest.js"></script>
</body>
</html>
```

3. Open `SpecRunner.html` via Live Server.

### What's tested

| Test | Description |
|---|---|
| ✅ Adds existing product | Increments quantity when product already in cart |
| ✅ Adds new product | Pushes new item with correct productId, quantity, deliveryOptionId |
| ✅ Quantity > 1 (existing) | Correctly adds selector value to existing quantity |
| ✅ Quantity > 1 (new) | Sets correct quantity for brand-new cart item |
| ✅ Multiple products | Keeps other cart items intact when adding a new one |
| ✅ localStorage persistence | Verifies `setItem` is called with the correct key and payload |

---

## 📦 Key Modules Reference

### `data/cart.js`
| Export | Description |
|---|---|
| `cart` | Live array of cart items `{ productId, quantity, deliveryOptionId }` |
| `loadFromStorage()` | Reads cart from `localStorage`, sets defaults if empty |
| `addToCart(productId)` | Adds or increments a product; reads quantity from DOM selector |
| `removeFromCart(productId)` | Filters out the item and saves |
| `updateQuantity(productId, newQty)` | Updates quantity and saves |
| `updateDeliveryOption(productId, optionId)` | Updates delivery option and saves |
| `calculateCartQuantity()` | Sums all quantities and updates the `.js-cart-quantity` badge |

### `data/products.js`
| Export | Description |
|---|---|
| `products` | Array of 40+ product objects `{ id, image, name, rating, priceCents, keywords }` |
| `getProduct(productId)` | Returns a single product by ID |

### `data/deliveryOptions.js`
| Export | Description |
|---|---|
| `deliveryOptions` | Array of `{ id, deliveryDays, priceCents }` |
| `getDeliveryOption(id)` | Returns a delivery option by ID |

### `scripts/utils/money.js`
| Export | Description |
|---|---|
| `formatCurrency(cents)` | Converts integer cents to `"X.XX"` string (e.g. `1099` → `"10.99"`) |

---

## 🔄 Data Flow

```
User clicks "Add to Cart" (amazon.html)
        ↓
amazon.js → addToCart(productId)
        ↓
cart.js → updates cart array → saveToStorage() → localStorage
        ↓
calculateCartQuantity() → updates badge in header

User navigates to checkout.html
        ↓
checkout.js → renderOrderSummary() + renderPaymentSummary()
        ↓
orderSummary.js → reads cart + products + deliveryOptions → renders HTML + binds events
paymentSummary.js → reads cart + products + deliveryOptions → calculates totals → renders sidebar

User selects new delivery option
        ↓
updateDeliveryOption() → saves to localStorage → renderOrderSummary() re-renders
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please ensure any new logic in `cart.js` is covered by a Jasmine test before submitting.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Alexandre Hervé Massoda Ma Mbeleck**  
Full-Stack Software Engineer · Douala, Cameroon

[![GitHub](https://img.shields.io/badge/GitHub-Xander1936-181717?logo=github)](https://github.com/Xander1936)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-alexandre--massoda-0A66C2?logo=linkedin)](https://linkedin.com/in/alexandre-massoda)
[![Email](https://img.shields.io/badge/Email-alexandrehervemassodamambeleck@gmail.com-D14836?logo=gmail)](mailto:alexandrehervemassodamambeleck@gmail.com)

---

## 🙏 Acknowledgements

- [SuperSimpleDev](https://github.com/SuperSimpleDev) — original course project structure and teaching materials
- [Day.js](https://day.js.org/) — lightweight date library used for delivery date calculations
- [Jasmine](https://jasmine.github.io/) — testing framework used for unit tests
- Amazon.com — UI/UX reference and inspiration