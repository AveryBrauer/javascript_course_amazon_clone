import json from "../data/products.json" with {
  type: "json"
};
const products = json.products;

let productsHtml = '';

products.forEach((product) => {
  productsHtml += `
    <div data-product-id=${product.id}>
      <div>
        <img src="${product.image}">
      </div>

      <div>
        ${product.name}
      </div>

      <div>
        <img src="images/ratings/rating-${product.rating.stars * 10}.png" alt="Rating">
        <div>
          ${product.rating.count}
        </div>
      </div>

      <div>
        $${(product.priceCents / 100).toFixed(2)}
      </div>

      <div>
        <select class="js-quantity-select">
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

      <button class="js-add-to-cart-button"
        data-product-id="${product.id}"
      >
        Add to Cart
      </button>
    </div>
  `;
});
document.querySelector('.js-products-grid').innerHTML = productsHtml;

document.querySelectorAll('.js-add-to-cart-button').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;

    const selectElement = button.closest('div').querySelector('.js-quantity-select');
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
  });
});
