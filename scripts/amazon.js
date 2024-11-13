const products = [
  {
    id: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    image: 'images/products/athletic-cotton-socks-6-pairs.jpg',
    name: 'Black and Gray Athletic Cotton Socks - 6 Pairs',
    rating: {
      stars: 4.5,
      count: 87
    },
    priceCents: 1090
  },
  {
    id: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    image: 'images/products/intermediate-composite-basketball.jpg',
    name: 'Intermediate Size Basketball',
    rating: {
      stars: 4,
      count: 127
    },
    priceCents: 2095
  },
  {
    id: '83d4ca15-0f35-48f5-b7a3-1ea210004f2e',
    image: 'images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg',
    name: 'Adults Plain Cotton T-Shirt - 2 Pack',
    rating: {
      stars: 4.5,
      count: 56
    },
    priceCents: 799
  }
];

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
        <img src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div>
          ${product.rating.count}
        </div>
      </div>

      <div>
        $${(product.priceCents / 100).toFixed(2)}
      </div>

      <div>
        <select>
          <option selected="">1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
          <option>7</option>
          <option>8</option>
          <option>9</option>
          <option>10</option>
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

    let matchingItem;
    cart.forEach((item) => {
      if (productId === item.productId) {
        matchingItem = item;
      }
    });
    if (matchingItem) {
      matchingItem.quantity++;
    } else {
      cart.push({
        productId: productId,
        quantity: 1
      });
    }
    console.log(cart);
  });
});
