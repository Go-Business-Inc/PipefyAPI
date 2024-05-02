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
const logTable = 'LOG_TABLE_ID';
const timeZone = 'YOUR_TIME_ZONE'; // example: "America/Bogota" --> https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
const intlCode = 'YOUR_INTL_CODE'; // 'es-pa' --> https://www.andiamo.co.uk/resources/iso-language-codes/

const pipefy = new PipefyAPI(apiKey, organizationId, logTable, timeZone, intlCode);

// Example usage
const cardId = 'CARD_ID';
const result = await pipefy.getCardInfo(cardId);
console.log(result);
```

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit).

## Author

- **Name:** Ramón David Sifuentes C.
- **Website:** [www.gobusinessinc.com](https://gobusinessinc.com)

