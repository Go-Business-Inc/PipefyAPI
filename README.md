# Pipefy API Library

## Overview

This library provides a convenient way to interact with the Pipefy API, allowing developers to easily integrate Pipefy functionality into their applications. It includes functions for managing cards, pipes, comments, and more.

## Features

- Create, update, and delete cards
- Retrieve card information, including fields, assignees, and comments
- Manage pipes, including fetching pipe information
- Perform operations like moving cards to different phases
- Search for cards based on various criteria
- Manage comments on cards
- Handle errors and logging

## Installation

To use this library in your TypeScript project, install it via npm:

```bash
npm install pipefy-api
```

## Usage

```typescript
import { PipefyAPI } from 'pipefy-api';

const apiKey = 'YOUR_API_KEY';
const organizationId = 'YOUR_ORGANIZATION_ID';
const logTable = 'LOG_TABLE_ID'; // Table used for Bug Reports
const timeZone = 'YOUR_TIME_ZONE'; // example: "America/Bogota" --> https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
const intlCode = 'YOUR_INTL_CODE'; // 'es-pa' --> https://www.andiamo.co.uk/resources/iso-language-codes/

const pipefy = new PipefyAPI(apiKey, organizationId, logTable, timeZone, intlCode);

// Example usage
const cardId = 'CARD_ID';
const result = await pipefy.getCardInfo(cardId);
const resultData = await result.json();
console.log(`Code: ${result.status}: ${result.statusText}`);
console.log(resultData);
```

### How to get Pipefy API Key

Follow these steps:

1. **Log in to your Pipefy Account:** Go to [Pipefy's login page](https://app.pipefy.com/) and enter your credentials to access your account.

2. **Navigate to Account Preferences:** Once logged in, click on your profile picture or name in the top right corner of the screen. From the dropdown menu, select "Account Preferences."

3. **Access Personal Access Tokens:** In the Account Preferences section, look for the "Personal Access Tokens" or "API Tokens" option. Click on it to access the tokens management page.

4. **Create a New API Key:** On the tokens management page, you should see an option to create a new token or key. Click on it and follow the prompts to generate a new API Key.

5. **Use the API Key:** Copy the newly generated API Key. You will use this key in the constructor of the PipefyAPI class in your code.


### How to get Organization ID

To find your Pipefy Organization ID, follow these steps:

1. **Log in to your Pipefy Account:** Visit [Pipefy's login page](https://app.pipefy.com/) and enter your credentials to access your account.

2. **Check the URL:** After logging in, navigate to initial page within your Pipefy account. Look at the URL in your browser's address bar.

3. **Locate the Organization ID in the URL:** The Organization ID is typically found in the URL after the `/organizations/` segment. For example, in the URL `https://app.pipefy.com/organizations/123456789`, the Organization ID is `123456789`.

4. **Note down the Organization ID:** Make a note of the Organization ID from the URL. This ID is required in the constructor of the PipefyAPI class in your code or configurations when interacting with Pipefy's API.


### Log Table

To use the Log Table feature with PipefyAPI, follow these steps to create a database within your Pipefy account with the following structure:

| Column Name  | Data Type  |
|--------------|------------|
| Error Code   | short text |
| Message      | long text  |
| Date         | short text |
| Function     | short text |

Then, use the ID of the database in the constructor of the PipefyAPI class.

1. **Create a Database:** Log in to your Pipefy account and navigate to the section where you can create a new database. Define the structure of the database with the fields as specified above.

2. **Get the Database ID:** Once the database is created, open it and look at the URL in your browser's address bar. The ID of the database is typically found after the `/apollo_databases/` segment. For example, in the URL `https://app.pipefy.com/apollo_databases/987654321`, the LOG_TABLE_ID would be `987654321`.

3. **Use the Database ID:** Copy the LOG_TABLE_ID from the URL and use it in the constructor of the PipefyAPI class in your code or configurations.


### Time Zone Configuration

To configure the time zone in the PipefyAPI class, follow these steps:

1. **Choose Your Time Zone:** Replace `'YOUR_TIME_ZONE'` with your desired time zone identifier. For example, `"America/Bogota"` represents the time zone for Bogota, Colombia. You can find a list of time zone identifiers on [Wikipedia's list of tz database time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

2. **Update the Code:** Replace `const timeZone = 'YOUR_TIME_ZONE';` with the chosen time zone identifier in the constructor of the PipefyAPI class in your code or configurations.


### Internationalization Code Configuration

To configure the internationalization (i18n) code in the PipefyAPI class, follow these steps:

1. **Choose Your Internationalization Code:** Replace `'YOUR_INTL_CODE'` with your desired internationalization code. For example, `'es-pa'` represents Spanish as spoken in Panama. You can find a list of ISO language codes on [Andiamo's ISO Language Codes](https://www.andiamo.co.uk/resources/iso-language-codes/).

2. **Update the Code:** Replace `const intlCode = 'YOUR_INTL_CODE';` with the chosen internationalization code in the constructor of the PipefyAPI class in your code or configurations.

By setting the internationalization code, you specify the language and regional preferences for output text and formatting in PipefyAPI.


## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit).

## Author

- **Name:** Ramón David Sifuentes C.
- **Website:** [www.gobusinessinc.com](https://gobusinessinc.com)

