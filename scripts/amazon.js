import products from "../data/products.json" with {type: "json"};
import { addEventListenersHeader } from "./header.js";

const noImagePath = 'images/products/no-image.png';

init();

function init() {
  addEventListenersHeader(products, renderProducts);
  renderProducts(products);
}

function renderProducts(filteredProducts) {
  const productsGrid = document.querySelector('.js-products-grid');
  productsGrid.innerHTML = filteredProducts.length > 0
    ? filteredProducts.map(createProductHtml).join('')
    : `<p class="empty-products-list-message">No products found.</p>`;

  document.addEventListener('click', event => {
    if (event.target.classList.contains('js-variation-option')) {
      handleVariationOptionButton(event.target);
    } else if (event.target.classList.contains('js-add-to-cart-button')) {
      handleAddToCart(event.target);
    }
  });
}

function createProductHtml(product) {
  const images = product.images;
  const productImage = images['Default']
    || images[Object.keys(images)[0]]
    || noImagePath;

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
  const isActiveClassName = index === 0
    ? ' js-is-selected is-selected'
    : '';

  return `
    <button class="js-variation-option variation-option${isActiveClassName}" data-index="${index}">
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
  const variationContainer = button.closest('.js-variation-options-container');
  variationContainer.querySelectorAll('.js-variation-option').forEach(btn => {
    btn.classList.remove('js-is-selected', 'is-selected');
  });
  button.classList.add('js-is-selected', 'is-selected');

  const productContainer = button.closest('.js-product-container');
  const productId = productContainer.dataset.productId;
  const product = products.find(p => p.id === productId);
  if (!product) {
    console.error(`Product with ID "${productId}" not found.`);
    return;
  }

  const buttonContent = (button.textContent || button.innerText).trim();
  let imageSource = '';

  // Helper function to check if the image matches partial names
  const isIncludedInKey = (content) => {
    return Object.keys(product.images).some(key =>
      key.includes(`${content}_`) || key.includes(`_${content}`)
    );
  };

  // 1. Direct matching of the button content with a key
  if (product.images[buttonContent]) {
    imageSource = product.images[buttonContent];
  }
  // 2. Checking for partial matches with `_content` or `content_`
  else if (isIncludedInKey(buttonContent)) {
    const activeContents = getActiveButtonsContent(productContainer);
    const matchedImages = Object.keys(product.images)
      .filter(key => activeContents.every(content => key.includes(content)))
      .map(key => product.images[key])
      .sort((a, b) => a.priority - b.priority);  // Optional: sort by priority
    imageSource = matchedImages[0];
  }
  // 3. Checking for other buttons in the same container
  else if (Array.from(variationContainer.querySelectorAll('.js-variation-option'))
    .some(otherButton => {
      const otherButtonContent = (otherButton.textContent || otherButton.innerText).trim();
      return product.images[otherButtonContent] || isIncludedInKey(otherButtonContent);
    })
  ) {
    imageSource = noImagePath; // Fallback image
  }
  // No match found: exit the function
  else {
    return;
  }

  // Update the product image
  productContainer.querySelector('.js-product-image').src = imageSource || noImagePath;
}

function getActiveButtonsContent(productContainer) {
  const activeButtons = productContainer.querySelectorAll('.js-variation-option.js-is-selected');
  return Array.from(activeButtons).map(button => button.innerHTML.trim());
}

function updateCartSymbol(toAdd) {
  document.querySelector(".js-cart-quantity").innerHTML
    = parseInt(document.querySelector(".js-cart-quantity").innerHTML)
      + toAdd;
}
