# Facebook Marketplace Automation Extension

This Chrome extension is designed to automate the process of filling out product information on Facebook Marketplace. It scrapes product details such as title, price, description, images, category, and more, and fills them into the respective fields on the Facebook Marketplace form. It simulates human-like behavior, such as typing, selecting dropdown options, uploading images, and clicking buttons, ensuring an efficient and natural user experience.

## Features

- **Automatic form filling**: Automatically fills in product details (title, price, description, etc.) from a pre-defined data source.
- **Simulated human interaction**: Simulates human behavior with random delays between actions like typing, selecting dropdown options, and clicking buttons.
- **Image upload**: Allows uploading images from a URL or a file path to the Marketplace form.
- **Error handling**: Robust error handling ensures smooth execution even when elements are not found or other issues arise.
- **Category and condition selection**: Automatically selects product categories and condition (e.g., Household, New) from dropdowns.

## Installation

1. Download or clone the repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode**.
4. Click on **Load unpacked** and select the project folder.

## Usage

1. Ensure that your product data is stored in Chrome's local storage under the key `productToPost`.
2. Navigate to the Facebook Marketplace form.
3. The extension will automatically fill in the product data and upload images for you.

## Author

**Mostofa Tanim Anik**  
Software Engineer

##Disclaimer
This extension was created as a test task to showcase my skills in building Chrome extensions that can scrape data from any marketplace. I selected **Pickaboo**, a well-known e-commerce store, as a demonstration of its functionality. The extension is designed solely for educational purposes to demonstrate my abilities.
I am not responsible for any violations or misuse of this extension. Its usage is strictly for assessment and educational purposes. Any use of the extension outside of this scope, including scraping or automating actions on platforms without proper authorization, is not endorsed or supported by me.

## License

This project is licensed under the MIT License
