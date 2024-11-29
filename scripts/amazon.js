import json from "../data/products.json" with {type: "json"};
import { addEventListenersHeader } from "./header.js";

const products = json.products;

init();

function init() {
  addEventListenersHeader(products, renderProducts);
  renderProducts(products);
}

function renderProducts(filteredProducts) {
  const productsGrid = document.querySelector('.js-products-grid');
  productsGrid.innerHTML = filteredProducts.length > 0
    ? filteredProducts.map(createProductHtml).join('')
    : `<p class="empty-products-list-message">No products found.</p>`

  productsGrid.querySelectorAll('.js-add-to-cart-button').forEach(button => {
    button.addEventListener('click', () => handleAddToCart(button));
  });
}

function createProductHtml(product) {
  return `
    <div class="product-container" data-product-id=${product.id}>
      <div class="product-image-container">
        <img class="product-image" src="${product.image}">
      </div>

      <div class="product-name limit-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png" alt="Rating"
        >
        <div class="link-primary product-rating-count">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${(product.priceCents / 100).toFixed(2)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector">
          ${[...Array(10)].map((_, i) => `<option value="${++i}">${i}</option>`).join('')}
        </select>
      </div>

      <button class="js-add-to-cart-button button-primary add-to-cart-button"
        data-product-id="${product.id}"
      >
        Add to Cart
      </button>
    </div>
  `;
}

function handleAddToCart(button) {
  const productId = button.dataset.productId;
  const quantity = parseInt(
    button.closest('div').querySelector('.js-quantity-selector').value,
    10
  );

  let matchingItem = cart.find(item => item.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity
    });
  }
  console.log('current cart: %O', cart);
  updateCartSymbol(quantity);
}

function updateCartSymbol(toAdd) {
  document.querySelector(".js-cart-quantity").innerHTML
    = parseInt(document.querySelector(".js-cart-quantity").innerHTML)
      + toAdd;
}
