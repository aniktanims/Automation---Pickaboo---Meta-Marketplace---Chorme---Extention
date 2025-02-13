let scrapedData = null;

document.getElementById('scrapeButton').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab.url.includes('pickaboo.com')) {
    document.getElementById('result').style.display = 'block';
    document.getElementById('result').innerHTML = 'Please navigate to a Pickaboo product page';
    return;
  }

  try {
    // Execute scraping
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        const titleElement = document.querySelector('.TitleH1__StyledTitleH1-sc-3my69t-0');
        const imageElement = document.querySelector('.image-react-wrapper img');
        const descriptionElement = document.querySelector('.description .read-more');
        const priceElement = document.querySelector('.price-view .Title__StyledTitle-sc-gk5zya-0');

        return {
          title: titleElement ? titleElement.textContent.trim() : '',
          image: imageElement ? imageElement.src : '',
          description: descriptionElement ? descriptionElement.textContent.trim() : '',
          price: priceElement ? priceElement.textContent.trim().replace('৳', '').replace(/,/g, '').trim() : ''
        };
      }
    });

    scrapedData = result;

    // Store the data for Facebook automation
    await chrome.storage.local.set({ productToPost: result });

    // Show success message
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
      <p><strong>Title:</strong> ${result.title}</p>
      <p><strong>Price:</strong> ${result.price}</p>
      <p><strong>Image URL:</strong> ${result.image}</p>
      <p><strong>Description:</strong> ${result.description}</p>
      <p class="success">Product information scraped successfully!</p>
    `;

    // Show Facebook button
    document.getElementById('postToFacebook').style.display = 'block';

  } catch (error) {
    document.getElementById('result').style.display = 'block';
    document.getElementById('result').innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
});

document.getElementById('postToFacebook').addEventListener('click', async () => {
  if (!scrapedData) {
    document.getElementById('result').innerHTML += '<p class="error">Please scrape product data first!</p>';
    return;
  }

  try {
    // Create a new tab with Facebook Marketplace create listing page
    const tab = await chrome.tabs.create({
      url: 'https://www.facebook.com/marketplace/create/item'
    });

    // Wait for the page to load
    setTimeout(async () => {
      // Execute the Facebook automation script
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['facebook.js']
      });
    }, 2000);

    // Update status
    document.getElementById('result').innerHTML += '<p class="success">Opening Facebook Marketplace...</p>';
  } catch (error) {
    document.getElementById('result').innerHTML += `<p class="error">Error: ${error.message}</p>`;
  }
});