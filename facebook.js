
function randomDelay(min = 500, max = 2000) {
  return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));
}


async function simulateTyping(element, text) {
  element.focus();
  element.value = ''; // Clear field before typing
  for (let i = 0; i < text.length; i++) {
    element.value += text[i];
    element.dispatchEvent(new Event('input', { bubbles: true }));
    await randomDelay(20, 50);
  }
}

async function waitForElement(xpath, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    if (result.singleNodeValue) return result.singleNodeValue;
    await randomDelay(100, 200);
  }
  return null;
}


async function humanClick(element) {
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  await randomDelay(200, 400);
  element.click();
  await randomDelay(200, 400);
}


async function uploadImage(imageUrl) {
  try {
 
    const fileInput = await waitForElement('//input[@type="file" and contains(@accept, "image")]');
    if (!fileInput) {
      console.error('Image upload input not found');
      return;
    }

  
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'product-image.jpg', { type: 'image/jpeg' });


    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;

    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('Image uploaded successfully');
  } catch (error) {
    console.error('Error uploading image:', error);
  }
}

// Select option from dropdown
async function selectDropdownOption(labelText, optionText) {
  try {

    let label = document.querySelector(`label[aria-label="${labelText}"]`);

    if (!label) {
      const elements = Array.from(document.querySelectorAll('label'));
      label = elements.find(el => el.textContent.includes(labelText));
    }

    if (!label) {
      console.error(`${labelText} dropdown not found`);
      return false;
    }

    await humanClick(label);
    await randomDelay(1000, 1500);

    // Look for options in various formats
    const options = Array.from(document.querySelectorAll([
      'div[role="option"]',
      'span.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft',
      'span[class*="xlyipyv"]',
      'div[class*="xjyslct"]'
    ].join(', ')));

    const targetOption = options.find(el => 
      el.textContent.toLowerCase().includes(optionText.toLowerCase()) ||
      el.innerText.toLowerCase().includes(optionText.toLowerCase())
    );

    if (targetOption) {
      await humanClick(targetOption);
      console.log(`Selected ${optionText} for ${labelText}`);
      return true;
    } else {
      console.error(`Option ${optionText} not found for ${labelText}`);
      return false;
    }
  } catch (error) {
    console.error(`Error selecting ${optionText} for ${labelText}:`, error);
    return false;
  }
}


async function fillMarketplaceForm() {
  try {
    //  store product data
    const { productToPost } = await chrome.storage.local.get('productToPost');
    if (!productToPost) {
      console.error('No product data found');
      return;
    }

    console.log('Filling form with:', productToPost);
    await randomDelay(2000, 3000); 
    // Title
    const titleLabel = await waitForElement("//span[contains(text(),'Title')]");
    if (titleLabel) {
      const titleInput = titleLabel.closest('div').querySelector('input');
      if (titleInput) {
        await simulateTyping(titleInput, productToPost.title);
        console.log('Title filled correctly');
      }
    }

    // Price
    const priceLabel = await waitForElement("//span[contains(text(),'Price')]");
    if (priceLabel) {
      const priceInput = priceLabel.closest('div').querySelector('input');
      if (priceInput) {
        await simulateTyping(priceInput, productToPost.price);
        console.log('Price filled correctly');
      }
    }

    // Category Selection (Household)
    await selectDropdownOption('Category', 'Household');

    // Condition Selection (New)
    await selectDropdownOption('Condition', 'New');

    // Brand (Set as "Not available")
    const brandLabel = await waitForElement("//span[contains(text(),'Brand')]");
    if (brandLabel) {
      const brandInput = brandLabel.closest('div').querySelector('input');
      if (brandInput) {
        await simulateTyping(brandInput, 'Not available');
        console.log('Brand set as: Not available');
      }
    }

    // Color Selection (N/A)
    const colorLabel = await waitForElement("//label[contains(text(),'Color')]");
    if (colorLabel) {
      const colorInput = colorLabel.closest('div').querySelector('input');
      if (colorInput) {
        await simulateTyping(colorInput, 'N/A');
        console.log('Color set as: N/A');
      }
    }

    // Description
    const descriptionLabel = await waitForElement("//span[contains(text(),'Description')]");
    if (descriptionLabel) {
      const descriptionInput = descriptionLabel.closest('div').querySelector('textarea, [role="textbox"]');
      if (descriptionInput) {
        await simulateTyping(descriptionInput, productToPost.description);
        console.log('Description filled correctly');
      }
    }

    // Door Pickup Selection
    const doorPickupOption = await waitForElement("//span[contains(text(),'Door pickup')]");
    if (doorPickupOption) {
      const doorPickupContainer = doorPickupOption.closest('div[role="checkbox"]');
      if (doorPickupContainer && !doorPickupContainer.getAttribute('aria-checked') === 'true') {
        await humanClick(doorPickupContainer);
        console.log('Door Pickup selected');
      }
    }

    // Upload Image
    if (productToPost.image) {
      await uploadImage(productToPost.image);
      console.log('Image uploaded');
    }

    // click the Next button
    const nextButton = Array.from(document.querySelectorAll('div[role="button"]'))
      .find(el => el.textContent.includes('Next'));
    if (nextButton) {
      await humanClick(nextButton);
      console.log('Next button clicked');
    }

    console.log('Form filled successfully');

  } catch (error) {
    console.error('Error filling form:', error);
  }
}

// Start the automation when the page is ready
if (document.readyState === 'complete') {
  fillMarketplaceForm();
} else {
  window.addEventListener('load', fillMarketplaceForm);
}