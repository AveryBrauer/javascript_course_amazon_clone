export function addEventListenersHeader(products, renderProducts) {
  const searchBar = document.querySelector('.js-search-bar');
  const searchButton = document.querySelector('.js-search-button');
  const handleSearch = () => {
    const searchBarContent = searchBar.value.trim();
    renderProducts(searchBarContent
      ? searchProducts(searchBarContent, products)
      : products
    );
  };

  searchBar.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  });

  searchButton.addEventListener('click', handleSearch);
}

function searchProducts(query, products) {
  return products.filter((product) =>
    product.id.toLowerCase().startsWith(query.toLowerCase()) ||
    product.name.toLowerCase().includes(query.toLowerCase())
  );
}
