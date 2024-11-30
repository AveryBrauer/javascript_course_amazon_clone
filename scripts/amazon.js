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

    productsGrid.querySelectorAll('.js-variation-option').forEach(button => {
      button.addEventListener('click', () => handleVariationOptionButton(button));
    });

  productsGrid.querySelectorAll('.js-add-to-cart-button').forEach(button => {
    button.addEventListener('click', () => handleAddToCart(button));
  });
}

function createProductHtml(product) {
  console.log(product);
  const productImage = product.image
    ? product.image
    : product.variations?.[0].images?.[0] || '';

  const variationsHtml = product.variations
    ? product.variations.map((variationContent, index) => createVariationHtml(variationContent, index)).join('')
    : '';

  return `
    <div class="js-product-container product-container" data-product-id=${product.id}>
      <div class="product-image-container">
        <img class="js-product-image product-image" src="${productImage}" data-default-image="${productImage}">
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

      ${variationsHtml}

      <div class="product-spacer"></div>

      <button class="js-add-to-cart-button button-primary add-to-cart-button"
        data-product-id="${product.id}"
      >
        Add to Cart
      </button>
    </div>
  `;
}

function createVariationHtml(variationContent, index) {
  const buttonsHtml = variationContent.buttonsContent.map((buttonContent, index) =>
    createVariationButtonHtml(buttonContent, index)
  ).join('');

  return `
    <div class="variation-name">${variationContent.name}</div>
    <div class="js-variation-options-container variation-options-container" data-index="${index}">
      ${buttonsHtml}
    </div>
  `;
}

function createVariationButtonHtml(buttonContent, index) {
  return `
    <button class="js-variation-option variation-option" data-index="${index}">
      ${buttonContent}
    </button>
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

function handleVariationOptionButton(button) {
  const buttonIndex = button.dataset.index;
  const variationContainerIndex = button.closest('.js-variation-options-container').dataset.index;

  const productContainer = button.closest('.js-product-container');
  const productId = productContainer.dataset.productId;
  const product = products.find(p => p.id === productId);

  const newImageSource = product.variations?.[variationContainerIndex].images?.[buttonIndex] || '';

  if (!newImageSource) {
    return;
  }
  productContainer.querySelector('.js-product-image').src = newImageSource;
}

function updateCartSymbol(toAdd) {
  document.querySelector(".js-cart-quantity").innerHTML
    = parseInt(document.querySelector(".js-cart-quantity").innerHTML)
      + toAdd;
}
