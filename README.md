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

The Pipefy API supports two authentication methods securely through a configuration object, or via legacy positional arguments.

**1. Configuration Object (Recommended)**

```typescript
// For Service Account
const pipefy = new PipefyAPI({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  tokenEndpoint: 'https://app.pipefy.com/oauth/token',
  organizationId: 'YOUR_ORGANIZATION_ID',
  timeZone: 'America/Bogota',
  intlCode: 'es-pa',
  logTable: 'LOG_TABLE_ID', // Optional
});

// For Personal Access Token (API Key)
const pipefy = new PipefyAPI({
  token: 'YOUR_PERSONAL_TOKEN',
  organizationId: 'YOUR_ORGANIZATION_ID',
  timeZone: 'America/Bogota',
  intlCode: 'es-pa',
  logTable: 'LOG_TABLE_ID', // Optional
});
```

**2. Legacy Positional Arguments**

The constructor maintains backward compatibility with the following signature:

```typescript
const pipefy = new PipefyAPI(apiKey, organizationId, logTable, timeZone, intlCode);
```

_(Note: Internally, the library handles the detection and mapping of these parameters to ensure correct initialization regardless of the order used in previous versions.)_

### Methods

- **getCardInfo(cardId: string, children?: boolean, parents?: boolean, options?: getCardInfoOptions): Promise<any>**
  - Retrieves detailed information about a card, including parent/child relations and custom fields.
- **getPipeInfo(pipeId: string): Promise<any>**
  - Retrieves basic information about a pipe by its ID.
- **listPipes(organizationId?: string): Promise<Pipe[] | null>**
  - Lists the pipes of an organization (defaults to the configured `organizationId`).
- **listTables(organizationId?: string): Promise<Table[] | null>**
  - Lists the database tables of an organization (defaults to the configured `organizationId`).
- **moveCardToPhase(cardId: string, phaseId: string): Promise<any>**
  - Moves a card to a specific phase within a pipe.
- **allCardsIds(pipeId: string, parents?: boolean, children?: boolean): Promise<any | null>**
  - Returns the IDs of all cards in a pipe, with option to include relations.
- **findCardFromTitle(title: string, pipeId: string): Promise<any | null>**
  - Searches for a card by its title within a pipe and returns its ID or full data.
- **findCardFromField(field: string, value: string, pipeId: string, first?: boolean, cards?: boolean): Promise<any>**
  - Searches for cards by the value of a specific field in a pipe.
- **makeComment(cardId: string, text: string): Promise<Response>**
  - Adds a comment to a card.
- **updateFaseField(cardId: string, name: string, value: any, valueIsArray?: boolean, operation?: string | null): Promise<Response>**
  - Updates the value of a field in a card, allowing simple or array values.
- **clearConnectorField(cardId: string, field: string): Promise<Response>**
  - Clears the value of a connector field in a card.
- **updateFaseFields(cardId: string, fieldsToUpdate: any): Promise<Response>**
  - Updates multiple fields of a card in a single operation.
- **setAssignees(cardId: string, assignees: string[]): Promise<Response>**
  - Assigns users as assignees to a card.
- **setLabels(cardId: string, labels: string[] | null): Promise<Response>**
  - Assigns or clears labels on a card.
- **setDueDate(cardId: string, dueDate: string): Promise<Response>**
  - Sets the due date for a card.
- **setCardTitle(cardId: string, title: string): Promise<Response>**
  - Renames a card (via `updateCard`). Overrides the title even on pipes whose title comes from a field.
- **findRecordInTable(taleId: string, fieldId: string, value: string, fullData?: boolean): Promise<any | null>**
  - Searches for a record in a table by the value of a field, with option to get full data.
- **createTableRecord(tableId: string, data?: any[]): Promise<any | null>**
  - Creates a new record in a Pipefy table.
- **deleteTablerecord(recordId: string): Promise<Response>**
  - Deletes a record from a table by its ID.
- **listTableRecords(tableId: string): Promise<Response>**
  - Lists all records in a table.
- **getCardsByRelationId(relations: CardRelation[], targetId: string): Card[]**
  - Returns the cards associated with a specific relation.
- **createCardRelation(childId: string, parentId: string, sourceId: string, sourceType: string): Promise<Response>**
  - Creates a relation between two cards (parent/child).
- **indexFields(fields: any[], full?: Boolean): any**
  - Indexes the fields of a card for quick access by name.
- **findCardsById(array: any[], targetId: string): any | null**
  - Searches for cards within an array by ID.
- **getValueFromField(dataArray: any, indexName: string, empty?: boolean, reportValue?: boolean): string | undefined**
  - Gets the value of a specific field from a card.
- **logError(message: string, errorCode?: number, functionName?: string): Promise<any>**
  - Logs an error to the configured log table.
- **clearTable(tableId: string): Promise<any>**
  - Deletes all records from a table.
- **deleteCard(cardId: string): Promise<Response>**
  - Deletes a card by its ID.
- **clearPipe(pipeId: string): Promise<string>**
  - Deletes all cards from a pipe.
- **createEmailTosend(cardId: string, pipeId: string, from: string, fromName: string, to: string, subject: string, html: string): Promise<any>**
  - Creates an email ready to send from a card.
- **sendEmail(emailId: string): Promise<any>**
  - Sends a previously created email.
- **createCard(pipeID: string, dataArray: any, reportError?: boolean, title?: string): Promise<any>**
  - Creates a new card in a pipe. Optional `title` is honored only on pipes with manual titles (ignored, without error, when the pipe derives its title from a field — use `setCardTitle` to force it afterwards).
- **getPreSignedURL(fileName: string): Promise<Response>**
  - Generates a pre-signed URL for uploading files to Pipefy.
- **uploadFileFromUrl(sourceUrl: string): Promise<string | null>**
  - Uploads a file to Pipefy from an external URL.
- **uploadFileFromBuffer(fileName: string, fileData: any): Promise<string | null>**
  - Uploads a file to Pipefy from a data buffer.
- **createWebhook(input: CreateWebhookInput): Promise<Webhook | null>**
  - Creates a webhook on a pipe (`pipe_id`) or a table (`table_id`).
- **listWebhooks(id: string, isTable?: boolean): Promise<Webhook[] | null>**
  - Lists the webhooks configured on a pipe or a table.
- **updateWebhook(input: UpdateWebhookInput): Promise<Response>**
  - Updates an existing webhook (only the provided fields are changed).
- **deleteWebhook(webhookId: string): Promise<Response>**
  - Deletes a webhook by its ID.

### Exported Types

- `getCardInfoOptions`: Options for advanced card queries.
- `saTokenObject`: Service Account Token response format.
- `Card`: Represents a Pipefy card.
- `CardRelation`: Relation between cards.
- `Pipe`: Represents a pipe (`id`, `name`) as returned by `listPipes`.
- `Table`: Represents a database table (`id`, `name`) as returned by `listTables`.
- `WebhookAction`: Allowed webhook events (`card.create`, `card.move`, `card.field_update`, `card.delete`, `card.late`, `card.overdue`, `card.expired`).
- `WebhookFilters`: Optional `field_id` / `on_phase_id` filters for a webhook.
- `CreateWebhookInput`: Input for `createWebhook`.
- `UpdateWebhookInput`: Input for `updateWebhook`.
- `Webhook`: Represents a webhook returned by the API.

These functions and types cover operations for managing cards, relations, comments, users, due dates, table records, file handling, and webhooks in Pipefy.

### Webhooks

Webhooks let Pipefy notify an external endpoint when something happens on a pipe or a table.
Supported events: `card.create`, `card.move`, `card.field_update`, `card.delete`, `card.late`, `card.overdue`, `card.expired`.
Reference: [Pipe & Table Webhooks](https://developers.pipefy.com/reference/pipe-table-webhooks).

```typescript
// Create a webhook on a pipe
const webhook = await pipefy.createWebhook({
  name: 'Dispatcher',
  url: 'https://your-endpoint.example.com/hook',
  actions: ['card.create', 'card.move'],
  email: 'you@example.com', // optional: notified if the webhook fails
  pipe_id: 307062317,
  // Optional filters:
  // filters: { field_id: [1222, 34343], on_phase_id: [123] },
  // Optional headers Pipefy sends on every request (e.g. to authenticate your endpoint):
  headers: { Authorization: 'Bearer YOUR_SECRET_TOKEN' },
});
console.log(webhook); // { id, name, url, email, actions }

// Create a webhook on a table (use table_id instead of pipe_id)
await pipefy.createWebhook({
  name: 'Table sync',
  url: 'https://your-endpoint.example.com/hook',
  actions: ['card.create'],
  table_id: 'aBcD1234',
});

// List webhooks of a pipe (pass true as the 2nd arg for tables)
const pipeWebhooks = await pipefy.listWebhooks('307062317');
const tableWebhooks = await pipefy.listWebhooks('aBcD1234', true);

// Update a webhook (only the provided fields change)
await pipefy.updateWebhook({
  id: '300447638',
  actions: ['card.create', 'card.move'],
  name: 'Dispatcher',
  url: 'https://your-endpoint.example.com/hook',
  email: 'you@example.com',
});

// Delete a webhook
await pipefy.deleteWebhook('300671373');
```

## Usage

### Using Service Account Credentials (Recommended for integrations)

Service accounts are the best practice for server-to-server integrations. The library natively supports "Lazy Token Fetching," meaning it will automatically generate and refresh tokens for you in the background right before making API requests!

```typescript
import { PipefyAPI } from 'pipefy-api';

const pipefy = new PipefyAPI({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  tokenEndpoint: 'https://auth.pipefy.com/oauth/token', // Your specific region endpoint
  organizationId: 'YOUR_ORGANIZATION_ID',
  timeZone: 'America/Bogota', // Check: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  intlCode: 'es-pa', // Check: https://www.andiamo.co.uk/resources/iso-language-codes/
  logTable: 'LOG_TABLE_ID', // Optional table used for Bug Reports
});

// ... No need to worry about manually fetching tokens!
const result = await pipefy.getCardInfo('CARD_ID');
const resultData = await result.json();
console.log(resultData);
```

### Using Personal Access Token (API Key)

You can initialize the API using a configuration object or the legacy positional arguments:

**Using Configuration Object:**

```typescript
import { PipefyAPI } from 'pipefy-api';

const pipefy = new PipefyAPI({
  token: 'YOUR_PERSONAL_TOKEN',
  organizationId: 'YOUR_ORGANIZATION_ID',
  timeZone: 'America/Bogota',
  intlCode: 'es-pa',
});
```

**Using Legacy Positional Arguments:**

```typescript
import { PipefyAPI } from 'pipefy-api';

const pipefy = new PipefyAPI(
  'YOUR_PERSONAL_TOKEN',
  'YOUR_ORGANIZATION_ID',
  'LOG_TABLE_ID',
  'America/Bogota',
  'es-pa',
);
```

const result = await pipefy.getCardInfo('CARD_ID');
const resultData = await result.json();
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

| Column Name | Data Type  |
| ----------- | ---------- |
| Error Code  | short text |
| Message     | long text  |
| Date        | short text |
| Function    | short text |

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
```
