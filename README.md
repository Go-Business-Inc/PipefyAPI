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

## Functions of the PipefyAPI Library

### Constructor

- **PipefyAPI(apiKey: string, organizationId: string, timeZone: string, intlCode: string, logTable?: string | null, endpoint?: string)**:
  Creates an instance of PipefyAPI.

### Methods

- **getCardInfo(cardId: string, children?: boolean, parents?: boolean, options?: getCardInfoOptions): Promise<any>**
  Retrieves card information from Pipefy.

- **getPipeInfo(pipeId: string): Promise<any>**
  Retrieves pipe information from Pipefy.

- **moveCardToPhase(cardId: string, phaseId: string): Promise<any>**
  Moves a card to a specified phase in Pipefy.

- **findCard(cardTitle: string, pipeId: string): Promise<string | null>**
  Finds a card by its title within a specified pipe in Pipefy.

- **findCardFromTitle(title: string, pipeId: string): Promise<string | null>**
  Finds a card by its title within a specified pipe in Pipefy.

- **findCardFromField(field: string, value: string, pipeId: string, first?: boolean, cards?: boolean): Promise<any>**
  Searches for a card by a field value within a specified pipe in Pipefy.

- **makeComment(cardId: string, text: string): Promise<any>**
  Makes a comment on a specified card in Pipefy.

- **updateFaseField(cardId: string, name: string, value: any, valueIsArray?: boolean): Promise<any>**
  Updates a field in a specified card phase in Pipefy.

- **clearConnectorField(cardId: string, field: string): Promise<any>**
  Clears a connector field in a specified card in Pipefy.

- **updateFaseFields(cardId: string, fieldsToUpdate: any): Promise<any>**
  Updates multiple fields in a specified card in Pipefy.

- **setAssignees(cardId: string, assignees: string[]): Promise<any>**
  Sets assignees for a specified card in Pipefy.

- **setDueDate(cardId: string, dueDate: string): Promise<any>**
  Sets the due date for a specified card in Pipefy.

- **findRecordInTable(taleId: string, fieldId: string, value: string, fullData?: boolean): Promise<any>**
  Finds a record in a specified table based on a field value in Pipefy.

- **createTableRecord(tableId: string, data?: any[]): Promise<any>**
  Creates a new record in a specified table in Pipefy.

- **deleteTablerecord(recordId: string): Promise<any>**
  Deletes a record from a specified table in Pipefy.

- **listTableRecords(tableId: string): Promise<any>**
  Retrieves a list of records from a specified table in Pipefy.

- **logError(message: string, errorCode?: number, functionName?: string): Promise<any>**
  Logs an error message to a specified log table in Pipefy.

- **clearTable(tableId: string): Promise<any>**
  Clears all records from a specified table in Pipefy.

- **createEmailTosend(cardId: string, pipeId: string, from: string, fromName: string, to: string, subject: string, html: string): Promise<string | null>**
  Creates an email to send from a specified card in Pipefy.

- **sendEmail(emailId: string): Promise<any>**
  Sends an email using the specified email ID returned by the createEmailTosend function.

- **createCard(pipeId: string, dataArray: any, reportError?: boolean): Promise<any>**
  Creates a new card in a specified pipe in Pipefy.

- **getPreSignedURL(fileName: string): Promise<string | null>**
  Generates a pre-signed URL for uploading a file to Pipefy.

- **uploadFileFromUrl(sourceUrl: string): Promise<string | null>**
  Uploads a file from a specified URL to Pipefy.

- **uploadFileFromBuffer(fileName: string, fileData: any): Promise<string | null>**
  Uploads a file from a buffer to Pipefy.

These functions cover a variety of operations you can perform in Pipefy, including card management, comments, users, due dates, table records, and file handling.


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

