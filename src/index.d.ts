
/**
 * Represents a PipefyClient instance.
 * @constructor
 * @param {string} apiKey - The API key for accessing Pipefy.
 * @param {string} organizationId - The ID of the organization in Pipefy.
 * @param {string} logTable - The ID of the log table in Pipefy.
 * @param {string} timeZone - The time zone for date/time operations. Check: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
 * @param {string} intlCode - The international code for language settings. Check: https://www.andiamo.co.uk/resources/iso-language-codes/
 * @param {string} endpoint - (Optional) The endpoint for GraphQL.
 */
export declare class PipefyAPI {
    private readonly endpoint;
    private readonly organizationId;
    private readonly apiKey;
    private readonly logTable;
    private readonly timeZone;
    private readonly intlCode;
    constructor(apiKey: string, organizationId: string, timeZone: string, intlCode: string, logTable?: string | null, endpoint?: string);
    
    /**
     * Retrieves detailed information about a specific card from the Pipefy API.
     *
     * @param cardId - The unique identifier of the card to retrieve information for.
     * @param children - Whether to include information about child relations of the card. Defaults to false.
     * @param parents - Whether to include information about parent relations of the card. Defaults to false.
     * @param options - Additional options to customize the query.
     * @param options.second_level - Whether to include second-level relations in the query. Defaults to false.
     * @param options.date_value - Whether to include date values in the fields. Defaults to false.
     * @param options.datetime_value - Whether to include datetime values in the fields. Defaults to false.
     * @returns A promise that resolves to the card information retrieved from the Pipefy API.
     */
    getCardInfo(cardId: string, children?: boolean, parents?: boolean, options?: getCardInfoOptions): Promise<any>;

    /**
     * Retrieves information about a specific pipe from the Pipefy API.
     *
     * @param pipeId - The unique identifier of the pipe to retrieve information for.
     * @returns A promise that resolves to the pipe information, including its id and name.
     */
    getPipeInfo(pipeId: string): Promise<any>;

    /**
     * Moves a card to a specified phase in Pipefy.
     * @param {string} cardId - The ID of the card to move.
     * @param {string} phaseId - The ID of the destination phase.
     * @returns {Promise<any>} A promise that resolves when the card is successfully moved to the specified phase.
     */
    moveCardToPhase(cardId: string, phaseId: string): Promise<any>;

    /**
     * Finds all card from specified pipe.
     *
     * @param pipeId - The ID of the pipe where the card is located.
     * @param children - Whether to include information about child relations of the card. Defaults to false.
     * @param parents - Whether to include information about parent relations of the card. Defaults to false.
     * @returns A promise that resolves a list of cards.
     */
    allCardsIds(pipeId: string, parents?: boolean, children?: boolean): Promise<any | null>;

    /**
     * Finds a card from a specific field in a Pipefy pipe.
     *
     * @param {string} field - The field to search by.
     * @param {string} value - The value to search for in the specified field.
     * @param {string} pipeId - The ID of the pipe to search within.
     * @param {boolean} [first=true] - Whether to return only the first matching card or all matching cards.
     * @param {boolean} [cards=false] - Whether to include card fields and current phase information in the result.
     * @returns {Promise<any>} A promise that resolves to the card(s) found, or null if no cards are found.
     */
    findCard(cardTitle: string, pipeId: string): Promise<any>;

    /**
     * Finds a card by its title within a specified pipe in Pipefy.
     * @param {string} title - The title of the card to search for.
     * @param {string} pipeId - The ID of the pipe in which to search for the card.
     * @returns {Promise<string | null>} A promise that resolves with the ID of the found card, or null if not found.
     */
    findCardFromTitle(title: string, pipeId: string): Promise<string | null>;

    /**
     * Look for a card with a particular field value in a Pipe.
     * 
     * @param {string} field - The name of the field to search.
     * @param {string} value - The value to search for in the specified field.
     * @param {string} pipeId - The ID of the Pipe in which to search for the card.
     * @param {boolean} [first=true] - If true, returns only the first matching card. Defaults to true.
     * @param {boolean} [cards=false] - If true, includes card fields in the result. Defaults to false.
     * 
     * @returns {object | string | null} - If 'first' is true and 'cards' is true, returns the details of the first matching card.
     *                                     If 'first' is true and 'cards' is false, returns the ID of the first matching card.
     *                                     If 'first' is false, returns an array of card details.
     *                                     Returns null if no matching cards are found.
     */
    findCardFromField(field: string, value: string, pipeId: string, first?: boolean, cards?: boolean): Promise<any>;

    /**
     * Makes a comment on a specified card.
     * @param cardId The ID of the card to comment on.
     * @param options Options for making the comment.
     * @returns A promise that resolves when the comment is successfully made.
     */
    makeComment(cardId: string, text: string): Promise<any>;

    /**
     * Updates a specific field in a Pipefy card with a given value.
     *
     * @param cardId - The ID of the card where the field will be updated.
     * @param name - The ID of the field to be updated.
     * @param value - The new value to assign to the field. Can be a string or an array.
     * @param valueIsArray - Optional. Set to true if the value is an array. Defaults to false.
     * @param operation - Optional. Specifies an additional operation to be applied (e.g., ADD, REMOVE).
     * @returns A Promise resolving with the API response after attempting to update the field value.
     *
     * The function constructs and sends a GraphQL mutation to update the specified field.
     * It properly formats string and array values and handles optional operations.
     */
    updateFaseField(cardId: string, name: string, value: any, valueIsArray?: boolean, operation?: string | null): Promise<any>;

    /**
     * Clears a connector field in a specified card.
     * @param cardId The ID of the card from which to clear the field.
     * @param field The name of the field to clear.
     * @returns A promise that resolves when the field is successfully cleared.
     */
    clearConnectorField(cardId: string, field: string): Promise<any>;

    /**
     * Updates multiple fields in a specified card.
     * @param cardId The ID of the card to update.
     * @param fieldsToUpdate An object containing the fields to update, where the keys are field IDs and the values are the new values.
     * @returns A promise that resolves when the fields are successfully updated.
     */
    updateFaseFields(cardId: string, fieldsToUpdate: any): Promise<any>;

    /**
     * Sets assignees for a specified card.
     * @param cardId The ID of the card for which to set assignees.
     * @param assignees An array of user IDs representing the assignees.
     * @returns A promise that resolves when the assignees are successfully set.
     */
    setAssignees(cardId: string, assignees: string[]): Promise<any>;

    /**
     * Updates the labels of a card in Pipefy using a GraphQL mutation.
     * 
     * @param cardId - The unique identifier of the card to update.
     * @param labels - An array of label IDs to assign to the card. If `null`, the labels on the card will be cleared.
     * @returns A Promise resolving to the result of the `pipefyFetch` call.
     */
    setLabels(cardId: string, labels: string[] | null): Promise<Response>;

    /**
     * Sets the due date for a specified card.
     * @param cardId The ID of the card for which to set the due date.
     * @param dueDate The new due date in ISO 8601 format (e.g., "2024-05-10T00:00:00Z").
     * @returns A promise that resolves when the due date is successfully set.
     */
    setDueDate(cardId: string, dueDate: string): Promise<any>;

    /**
     * Finds a record in a specified table based on a field value.
     * @param taleId The ID of the table in which to search for the record.
     * @param fieldId The ID of the field to search within the table.
     * @param value The value to search for in the specified field.
     * @param fullData Optional. If true, returns the full data of the record. Defaults to false.
     * @returns The ID or full data of the record if found, otherwise returns null.
     */
    findRecordInTable(taleId: string, fieldId: string, value: string, fullData?: boolean): Promise<any>;

    /**
     * Creates a new record in a specified table with the provided data.
     * @param tableId The ID of the table in which to create the record.
     * @param data An array of objects containing the field ID and corresponding value for each field in the record.
     * @returns The ID of the newly created record if successful, otherwise returns null.
     */
    createTableRecord(tableId: string, data?: any[]): Promise<any>;

    /**
     * Deletes a record from a specified table.
     * @param recordId The ID of the record to delete.
     * @returns A Promise that resolves to indicate success or failure of the deletion.
     */
    deleteTablerecord(recordId: string): Promise<any>;

    /**
     * Retrieves a list of records from a specified table.
     * @param tableId The ID of the table from which to retrieve records.
     * @returns A Promise that resolves to the list of records retrieved from the table.
     */
    listTableRecords(tableId: string): Promise<any>;

    /**
     * Logs an error message to a specified log table in Pipefy.
     * @param message The error message to log.
     * @param errorCode The error code associated with the message (default is 200).
     * @param functionName The name of the function where the error occurred (optional).
     * @returns A Promise that resolves when the error is logged successfully.
     */
    logError(message: string, errorCode?: number, functionName?: string): Promise<any>;

    /**
     * Clears all records from a specified table in Pipefy.
     * @param tableId The ID of the table to clear.
     * @returns A Promise that resolves with information about the cleared table or an error message.
     */
    clearTable(tableId: string): Promise<any>;

    /**
     * Deletes a card with the specified ID.
     *
     * @param cardId - The ID of the card to be deleted.
     * @returns A promise that resolves to the response of the delete operation.
     */
    deleteCard(cardId: string): Promise<Response>;

    /**
     * Clears all cards from a specified pipe by deleting them.
     * 
     * @param pipeId - The ID of the pipe from which to delete all cards.
     * @returns A promise that resolves to a string indicating the number of cards deleted and the pipe ID.
     * 
     */
    clearPipe(pipeId: string): Promise<any>;

    /**
     * Creates an email to send from a specified card in Pipefy.
     * @param cardId The ID of the card from which to send the email.
     * @param pipeId The ID of the pipe associated with the card.
     * @param from The email address of the sender.
     * @param fromName The name of the sender.
     * @param to The email address of the recipient.
     * @param subject The subject of the email.
     * @param html The HTML content of the email.
     * @returns A Promise that resolves with the ID of the created email or null if there was an error.
     */
    createEmailTosend(cardId: String, pipeId: string, from: string, fromName: string, to: string, subject: String, html: String): Promise<string | null>;

    /**
     * Sends an email using the specified email ID returned by the function createEmailTosend.
     * @param emailId The ID of the email to send.
     * @returns A Promise that resolves when the email is sent successfully or null if there was an error.
     */
    sendEmail(emailId: String): Promise<any>;

    /**
     * Creates a new card in a specified pipe in Pipefy.
     * @param pipeId The ID of the pipe where the card will be created.
     * @param dataArray An array containing the data to be set in the new card's fields.
     * @param reportError Determines whether to report errors encountered during card creation (default is false).
     * @returns A Promise that resolves with the created card's ID if successful, or null if there was an error.
     */
    createCard(pipeId: string, dataArray: any, reportError?: boolean ): Promise<any>;

    /**
     * Generates a pre-signed URL for uploading a file to Pipefy.
     * @param fileName The name of the file for which to generate the pre-signed URL.
     * @returns A Promise that resolves with the pre-signed URL if successful, or null if there was an error.
     */
    getPreSignedURL(fileName: string): Promise<string | null>;

    /**
     * Uploads a file from a specified URL to Pipefy.
     * @param sourceUrl The URL of the file to upload.
     * @returns A Promise that resolves with the path of the uploaded file in Pipefy if successful, or null if there was an error.
     */
    uploadFileFromUrl(sourceUrl: string): Promise<string | null>;

    /**
     * Uploads a file from a buffer to Pipefy.
     * @param fileName The name of the file to upload.
     * @param fileData The buffer containing the file data.
     * @returns A Promise that resolves with the path of the uploaded file in Pipefy if successful, or null if there was an error.
     */
    uploadFileFromBuffer(fileName: string, fileData: any): Promise<string | null>;

    /**
     * Indexes all fields from Pipefy as an object indexable by name.
     *
     * @param {any[]} fields - Array with fields as received from Pipefy.
     * @param {boolean} [full=false] - If true, returns an object with all properties.
     * @returns {any} - An indexed object containing field values.
     */
    indexFields(fields: any[], full?:Boolean ): any;

    /**
     * Searches for an card in an array based on the value of an "id" property.
     *
     * @param array - The array of cards to search within.
     * @param targetId - The ID of the object to find.
     * @returns The object with the specified ID if found, or `null` if it does not exist.
     */
    findCardsById(array: any[], targetId: string): any | null;

    /**
     * Retrieve a value from an array based on the specified index.
     *
     * @param {any} dataArray - The array containing the data.
     * @param {string} indexName - The index to search for in the array.
     * @param {boolean} [empty=false] - If true, return an empty string when the value doesn't exist; otherwise, return "undefined".
     * @param {boolean} [reportValue=true] - If true, return the value; if false, return the raw value (default is true).
     * @returns {string|undefined} - The retrieved value or undefined if not found (unless 'empty' is true).
     *
     */
    getValueFromField(dataArray: any, indexName: string, empty?: boolean, reportValue?:boolean):string|undefined;

      /**
     * Returns the cards array from the relation with the specified ID.
     * 
     * @param relations - An array of parent or child relation objects.
     * @param targetId - The ID of the target relation.
     * @returns An array of cards from the relation with the specified ID, or an empty array if not found.
     */
    getCardsByRelationId(relations: CardRelation[], targetId: string): Card[]

    /**
     * Creates a relation between two cards in Pipefy.
     * 
     * @param childId - The ID of the child card.
     * @param parentId - The ID of the parent card.
     * @param sourceId - The ID of the connection or the internal field ID used for the relation.
     * @param sourceType - The type of the relation source. Either "PipeRelation" or "Field".
     * @returns A promise resolving to the API response with the created card relation details.
     */
    createCardRelation(childId: string, parentId: string, sourceId: string, sourceType: string): Promise<Response>;

    /**
     * Makes a fetch request to the Pipefy API with the given GraphQL query.
     *
     * @param query - The GraphQL query string to be sent in the request body.
     * @param method - Optional. The HTTP method to use for the request (defaults to `'POST'`).
     * @returns A promise that resolves to the `Response` object returned by the fetch call.
     */
    pipefyFetch(query: string, method?: string): Promise<Response>; 
}


/**
 * Options for retrieving card information.
 * 
 * @interface getCardInfoOptions
 * 
 * @property {boolean} [date_value] - Whether to include date values in the card information.
 * @property {boolean} [datetime_value] - Whether to include datetime values in the card information.
 * @property {boolean} [second_level] - Whether to include second-level information in the card details.
 */
export interface getCardInfoOptions {
    date_value?: boolean,
    datetime_value?: boolean,
    second_level?: boolean,
  }
  
  /**
   * Represents a card in the Pipefy API.
   * 
   * @interface Card
   * @property {string} id - The unique identifier of the card.
   * @property {string} title - The title of the card.
   * @property {Array} fields - The fields associated with the card.
   * @property {Object} [current_phase] - The current phase of the card.
   * @property {string} current_phase.id - The unique identifier of the current phase.
   * @property {string} current_phase.name - The name of the current phase.
   * @property {CardRelation[]} [child_relations] - The child relations of the card.
   * @property {CardRelation[]} [parent_relations] - The parent relations of the card.
   */
  export interface Card {
    id: string;
    title: string;
    fields: [];
    current_phase?: {
        id: string,
        name: string
    },
    child_relations?: CardRelation[],
    parent_relations?: CardRelation[],
  }
  
  /**
   * Represents a relation between cards in the system.
   * 
   * @interface CardRelation
   * @property {string} name - The name of the card relation.
   * @property {string} id - The unique identifier of the card relation.
   * @property {Card[]} cards - An array of cards associated with this relation.
   */
  export interface CardRelation {
    name: string;
    id: string;
    cards: Card[];
  }