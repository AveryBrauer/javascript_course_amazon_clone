import json from "../data/products.json" with {
  type: "json"
};
const products = json.products;

let productsHtml = '';

if (products && products.length > 0) {
  products.forEach((product) => {
    productsHtml += `
      <div class="product-container" data-product-id=${product.id}>
        <div class="product-image-container">
          <img class="product-image" src="${product.image}">
        </div>

        <div class="product-name limit-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png" alt="Rating">
          <div class="link-primary product-rating-count">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          $${(product.priceCents / 100).toFixed(2)}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector">
            <option value="1" selected>1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        <button class="button-primary add-to-cart-button js-add-to-cart-button"
          data-product-id="${product.id}"
        >
          Add to Cart
        </button>
      </div>
    `;
  });
} else {
  productsHtml = `
    <p class="empty-products-list-message">
      The product list is empty or couldn't be loaded.
    </p>
  `;
}
document.querySelector('.js-products-grid').innerHTML = productsHtml;

document.querySelectorAll('.js-add-to-cart-button').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;

    const selectElement = button.closest('div').querySelector('.js-quantity-selector');
    const quantity = parseInt(selectElement.value, 10);

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
  });
});

function updateCartSymbol(toAdd) {
  document.querySelector(".js-cart-quantity").innerHTML
    = parseInt(document.querySelector(".js-cart-quantity").innerHTML)
      + toAdd;
}
