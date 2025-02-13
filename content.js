// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrapeProduct') {
    const productData = scrapeProduct();
    sendResponse(productData);
  }
});

function scrapeProduct() {
  // Get product title
  const titleElement = document.querySelector('.TitleH1__StyledTitleH1-sc-3my69t-0');
  const title = titleElement ? titleElement.textContent.trim() : '';

  // Get product image
  const imageElement = document.querySelector('.image-react-wrapper img');
  const image = imageElement ? imageElement.src : '';

  // Get product description
  const descriptionElement = document.querySelector('.description .read-more');
  const description = descriptionElement ? descriptionElement.textContent.trim() : '';

  // Get product price
  const priceElement = document.querySelector('.price-view .Title__StyledTitle-sc-gk5zya-0');
  const price = priceElement ? priceElement.textContent.trim().replace('৳', '').replace(/,/g, '').trim() : '';

  return {
    title,
    image,
    description,
    price
  };
}

// Auto-scrape when on a product page
if (window.location.href.includes('pickaboo.com/product-detail/')) {
  const productData = scrapeProduct();
  console.log('Scraped Product Data:', productData);
}