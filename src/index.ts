export class PipefyAPI {
  private readonly endpoint: string;
  private readonly organizationId: string;
  private readonly apiKey: string;
  private readonly logTable: string | null;
  private readonly timeZone: string;
  private readonly intlCode: string;

  constructor(apiKey: string, organizationId: string, timeZone: string, intlCode: string, logTable: string | null = '', endpoint='https://api.pipefy.com/graphql') {
    this.endpoint = endpoint;
    this.organizationId = organizationId;
    this.apiKey = apiKey;
    this.logTable = logTable;
    this.timeZone = timeZone;
    this.intlCode = intlCode;
  }

  getCardInfo(cardId: string, children = false, parents = false, options: getCardInfoOptions = {} ): Promise<any> {
    let childenQuery = `child_relations { name id cards { id title } }`
    if(children){
      childenQuery = `child_relations { name id cards { id title current_phase { id name } ${options.second_level?`parent_relations { name id cards { id title current_phase { id name } fields { indexName name value report_value ${options.date_value?"date_value":""} ${options.datetime_value?"datetime_value":""} } } } child_relations { name id cards { id title current_phase { id name } fields { indexName name value report_value ${options.date_value?"date_value":""} ${options.datetime_value?"datetime_value":""} } } }`:``} fields { indexName name value report_value ${options.date_value?"date_value":""} ${options.datetime_value?"datetime_value":""} } } }`
    }
    let parentsQuery = `parent_relations { name id cards { id title } }`
    if(parents){
      parentsQuery = `parent_relations { name id cards { id title current_phase { id name } ${options.second_level?`parent_relations { name id cards { id title current_phase { id name } fields { indexName name value report_value ${options.date_value?"date_value":""} ${options.datetime_value?"datetime_value":""} } } } child_relations { name id cards { id title current_phase { id name } fields { indexName name value report_value ${options.date_value?"date_value":""} ${options.datetime_value?"datetime_value":""} } } }`:``}  fields { indexName name value report_value ${options.date_value?"date_value":""} ${options.datetime_value?"datetime_value":""} } } }`
    }
    return this.pipefyFetch(`{ card(id: "${cardId}") { id pipe {id name suid} title assignees { id name } createdAt createdBy{ id name email createdAt } ${childenQuery} ${parentsQuery} comments_count current_phase { name id } done due_date fields { indexName name value report_value ${options.date_value?"date_value":""} ${options.datetime_value?"datetime_value":""} } labels { id name } phases_history { phase { name  id } firstTimeIn lastTimeOut } url } }`)
  }
  
  getPipeInfo(pipeId: string): Promise<any> {
    return this.pipefyFetch(`{ pipe(id: "${pipeId}") { id name } }`)
  }
  
  moveCardToPhase(cardId: string, phaseId: string): Promise<any>{
    return this.pipefyFetch(`mutation{ moveCardToPhase(input:{ card_id: ${cardId}, destination_phase_id: ${phaseId} }) { clientMutationId } }`)
  }
  
  async allCardsIds(pipeId: string, parents: boolean = false, children: boolean = false): Promise<any | null> {
    let childenQuery = ``
    if(children){
      childenQuery = ` child_relations { name id cards { id title } }`
    }
    let parentsQuery = ``
    if(parents){
      parentsQuery = ` parent_relations { name id cards { id title } }`
    }
    const search: any = await (await this.pipefyFetch(`{ allCards(pipeId: ${pipeId}) { totalCount nodes { id${parentsQuery}${childenQuery} } pageInfo { hasPreviousPage hasNextPage } } } `)).json()
    if(search.data.allCards.nodes.length >0){
        return search.data.allCards
    } else {
        return null
    }
  }

  async findCardFromTitle(title: string, pipeId: string): Promise<any | null>{
    const search: any = await (await this.pipefyFetch(`{ cards(pipe_id: "${pipeId}", search: {title: "${title}"}) { edges { node { id } } } } `)).json()
    if(search.data.cards.edges.length >0){
        return search.data.cards.edges[0].node.id
    } else {
        return null
    }
  }

  async findCardFromField(field: string, value: string, pipeId: string, first: Boolean = true, cards = false): Promise<any>{
    let cardfields = ''
    if(cards){
      cardfields = 'fields { indexName name value report_value } current_phase { name id }'
    }
    const query = `{ findCards( pipeId: ${pipeId} search: {fieldId: "${field}", fieldValue: "${value}"} ) { edges { node { id ${cardfields} } } } } `
    //console.log(query)
    const search: any = await (await this.pipefyFetch(query)).json()
    //console.log(`SEARCH: '${title}'`, search)
    if(search.data.findCards.edges.length >0){
      //console.log('SEARCH array:', search.data.cards.edges)
      if(first){
        if(cards){
          return search.data.findCards.edges[0].node
        } else {
          return search.data.findCards.edges[0].node.id
        }
      } else {
        return search.data.findCards.edges
      }
    } else {
      return null
    }
  }

  makeComment(cardId: string, text: string): Promise<Response>{
    return this.pipefyFetch(`mutation{ createComment(input:{ card_id: "${cardId}", text: "${text.replace(/"/g,"")}" }) { clientMutationId } }`)
  }

  updateFaseField(cardId: string, name: string, value: any, valueIsArray = false ): Promise<Response>{
    let valueTosend = `"${value}"`
    if(valueIsArray || Array.isArray(value) ){
      valueTosend = `[ "${value.join('", "')}" ]`
    }
    const query = `mutation { updateFieldsValues(input: {nodeId: "${cardId}", values: {fieldId: "${name}", value: ${valueTosend} }}) { clientMutationId } }`
    //console.log('QUERY: ',query)
    return this.pipefyFetch(query)
  }
  
  clearConnectorField(cardId: string, field: string): Promise<Response>{
    return this.pipefyFetch(`mutation { updateCardField( input: {card_id: ${cardId} , field_id: "${field}", new_value: null} ) { clientMutationId success } }`)
  }
  
  updateFaseFields(cardId: string, fieldsToUpdate: any): Promise<Response>{
    // fieldsToUpdate debe ser un objeto del tipo { field1: value1, field2: value2, ... }
    // por cada objeto se debe buscar el nombre y valor para colocar en el formato
    // {fieldId: "${name}", value: "${value}" },
    let fieldArray: any[] = []
    for(let field in fieldsToUpdate){
      if(Array.isArray(fieldsToUpdate[field])){
        if(fieldsToUpdate[field].length > 0){
          fieldArray.push(`{fieldId: "${field}", value: [ "${ fieldsToUpdate[field].join('", "') }" ] }`)
          //console.log("FIELD SKIPPED:",field)
        }
      } else {
        if(fieldsToUpdate[field] != null || fieldsToUpdate[field] != undefined){
          fieldArray.push(`{fieldId: "${field}", value: "${fieldsToUpdate[field]}" }`)
        } else if(fieldsToUpdate[field] == null) {
          fieldArray.push(`{fieldId: "${field}", value: null }`)
        } else if(fieldsToUpdate[field] == undefined) {
          //console.log("FIELD SKIPPED:",field)
        }
      }
    }
    const fieldValues = fieldArray.join(', ')
    return this.pipefyFetch(`mutation { updateFieldsValues(input: {nodeId: "${cardId}", values: [ ${fieldValues} ]}) { clientMutationId } }`)
  }
  
  setAssignees(cardId: string, assignees: string[]): Promise<Response>{
    return this.pipefyFetch(`mutation { updateCard(input: {id: "${cardId}", assignee_ids: ["${ assignees.join('", "') }"]}) { clientMutationId } }`)
  }

  setLabels(cardId: string, labels: string[] | null): Promise<Response>{
    if(labels == null){
      return this.pipefyFetch(`mutation { updateCard(input: {id: "${cardId}", label_ids: null }) { clientMutationId } }`);
    } else {
      return this.pipefyFetch(`mutation { updateCard(input: {id: "${cardId}", label_ids: ["${labels.join('", "')}"]}) { clientMutationId } }`);
    }
  }

  setDueDate(cardId: string, dueDate: string): Promise<Response>{
    return this.pipefyFetch(`mutation { updateCard(input: {id: "${cardId}", due_date: "${dueDate}"}) { clientMutationId } }`)
  }
  
  async findRecordInTable(taleId: string, fieldId: string, value: string, fullData = false): Promise< any | null>{
    let query = `{ findRecords(tableId: "${taleId}", search: {fieldId: "${fieldId}", fieldValue: "${value}"}) { edges { node { id } } } }`
    if(fullData){
      query = `{ findRecords(tableId: "${taleId}", search: {fieldId: "${fieldId}", fieldValue: "${value}"}) { edges { node { id fields { indexName name report_value value } } } } }`
    }
    const search: any = await (await this.pipefyFetch(query)).json()
    if(search.data.findRecords.edges != undefined && search.data.findRecords.edges.length >0){
      if(fullData){
        return search.data.findRecords.edges[0].node
      }
      return search.data.findRecords.edges[0].node.id
    } else {
        return null
    }
  }
  
  /**
   * Removes specific special characters from a given text.
   * 
   * @param text - The input text from which special characters will be removed.
   * @returns The cleaned text with specified special characters removed.
   */
  private stringClearSpecialChars(text: any): string{
    return String(text).replace('"','').replace('"','').replace('[','').replace(']','').replace('!','').replace('(',' ').replace(')',' ')
  }
  

  async createTableRecord(tableId: string, data: any[] = []): Promise< any | null>{
  
    let fields_attributes: any[] = []
    for(let i=0; i<data.length;i++){
      fields_attributes.push(`{field_id: "${data[i].id}", field_value: "${ this.stringClearSpecialChars(data[i].value) }"}`)
    }
  
    const query = `
    mutation {
      createTableRecord(input: {table_id: "${tableId}", fields_attributes: [ ${ fields_attributes.join(', ')} ]  }){
        table_record {
          id
        }
      }
    }`
  
    const result: any = await (await this.pipefyFetch(query)).json()
    //console.log(query)
    //console.log(result.data.createTableRecord.table_record)
  
    if(result.errors != undefined){
      console.log('ERROR: createTableRecord: ',result.errors[0].message)
      return null    
    }
    if(result.data.createTableRecord.table_record.id == undefined){
      return null    
    }
    return result.data.createTableRecord.table_record.id
  }

  /**
   * Deletes a table record with the specified record ID.
   *
   * @param {string} recordId - The ID of the record to be deleted.
   * @returns {Promise<Response>} A promise that resolves to the response of the delete operation.
   */
  deleteTablerecord(recordId: string): Promise<Response>{
    return this.pipefyFetch(`mutation { deleteTableRecord(input: {id: "${recordId}"}) { clientMutationId success } }`)
  }
  
  /**
   * Retrieves the records of a specified table.
   *
   * @param tableId - The unique identifier of the table whose records are to be fetched.
   * @returns A promise that resolves to the response containing the table records.
   */
  listTableRecords(tableId: string): Promise<Response>{
    return this.pipefyFetch(`{ table_records(table_id: "${tableId}") { edges { node { id } } } }`)
  }

  /**
   * Returns the cards array from the relation with the specified ID.
   * 
   * @param relations - An array of parent or child relation objects.
   * @param targetId - The ID of the target relation.
   * @returns An array of cards from the relation with the specified ID, or an empty array if not found.
   */
  getCardsByRelationId(relations: CardRelation[], targetId: string): Card[] {
    const cardRelation = relations.find(relation => relation.id === targetId);
    return cardRelation ? cardRelation.cards : [];
  }


  /**
   * Creates a relation between two cards in Pipefy.
   * 
   * @param childId - The ID of the child card.
   * @param parentId - The ID of the parent card.
   * @param sourceId - The ID of the connection or the internal ID of the field used to relate the cards.
   * @param sourceType - The source type of the relation. Valid options: `"PipeRelation"` or `"Field"`.
   * @returns A promise that resolves to the API response containing the created card relation details.
   */
  createCardRelation(childId: string, parentId: string, sourceId: string, sourceType: string): Promise<Response>{
    return this.pipefyFetch(`mutation { createCardRelation(input:{ childId: ${childId}, parentId: ${parentId}, sourceId: ${sourceId}, sourceType: "${sourceType}" }) { cardRelation { id childId parentId } } }`)
  }

  /**
   * Indexes all fields from Pipefy as an object indexable by name.
   *
   * @param {any[]} fields - Array with fields as received from Pipefy.
   * @param {boolean} [full=false] - If true, returns an object with all properties.
   * @returns {any} - An indexed object containing field values.
   */
  indexFields(fields: any[], full:Boolean = false): any{
    const indexedFields: any = {};
    for (const item of fields) {
        const { indexName, name, value, report_value, ...rest } = item;
        const type = typeof value === 'number' ? 'number' : 'string';
        const index = name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        if(full){
            indexedFields[indexName] = { ...item, type };
        } else {
            indexedFields[index] = value;
        }
    }
    return indexedFields;
  }

  findCardsById(array: any[], targetId: string): any | null {
    for (const item of array) {
      if (item.id === targetId) {
        return item.cards;
      }
    }
    return null; // Devolvemos null si no encontramos el objeto con el id buscado
  }

  /**
   * Retrieves a value from a specified field within a data array.
   *
   * @param dataArray - The array of data objects to search through.
   * @param indexName - The name of the index to match within the data objects.
   * @param empty - Optional. If true, returns an empty string when no match is found. Defaults to false.
   * @param reportValue - Optional. If true, returns the 'report_value' of the matched object. If false, returns the 'value'. Defaults to true.
   * @returns The 'report_value' or 'value' of the matched object, an empty string if `empty` is true and no match is found, or undefined if no match is found and `empty` is false.
   */
  getValueFromField(dataArray: any, indexName: string, empty = false, reportValue = true):string|undefined{
    const result = dataArray.filter((element: any) => element.indexName == indexName)
    //console.log(result)
    if(result[0] != undefined){
        if(reportValue){
            return result[0].report_value 
        } else {
            return result[0].value // report_value
        }
    }
    if(empty) return ''
    return undefined
  }
  
  async logError(message: string, errorCode = 200, functionName: string = ''): Promise<any>{
    if(this.logTable == undefined){
      return null
    }
    const now = new Date() 
    return await this.createTableRecord(this.logTable,[ { id: 'error_code', value: errorCode }, { id: 'message', value: message } , { id: 'date', value: now.toLocaleString(this.intlCode,{ timeZone: this.timeZone }) }, { id: 'function', value: functionName } ])
  }
  
  async clearTable(tableId: string): Promise<any> {
    let recordCount = 0
    const recodrs: any = await (await this.listTableRecords(tableId)).json()
    if(recodrs.data.table_records.edges != undefined){
      let promises: any[] = []
      for(let i=0;i<recodrs.data.table_records.edges.length;i++){
        promises.push(this.deleteTablerecord(recodrs.data.table_records.edges[i].node.id))
      }
      const result = await Promise.all(promises)
    }
    return `Deleted ${recordCount} recodrs in table ${tableId}`
  }

  deleteCard(cardId: string): Promise<Response>{
    return this.pipefyFetch(`mutation { deleteCard(input: {id: "${cardId}"}) { clientMutationId success } }`)
  }


  async clearPipe(pipeId: string): Promise<string> {
    let recordCount = 0
    let finished = false
    do {
      const allCards: any = await this.allCardsIds(pipeId)
      if(allCards != null){
        let promises: any[] = []
        for(let i=0;i<allCards.nodes.length;i++){
          promises.push(this.deleteCard(allCards.nodes[i].id))
        }
        const result = await Promise.all(promises)
        recordCount += result.length
      } else {
        finished = true
      }
    }
    while(!finished)

    return `Deleted ${recordCount} cards in pipe ${pipeId}`
  }
  
  async createEmailTosend(cardId: String, pipeId: string, from: string, fromName: string, to: string, subject: String, html: String): Promise<any>{
    const createEmailResult: any = await (await this.pipefyFetch(`mutation { createInboxEmail( input: { card_id: ${cardId}, repo_id: ${pipeId}, from: "${from}", fromName: "${fromName}", to: "${to}", subject: "${subject}", html: "${html}" } ) { clientMutationId inbox_email{id} } } `)).json()
    if("errors" in createEmailResult){
      console.log(createEmailResult.errors)
      return null
    }
   return createEmailResult.data.createInboxEmail.inbox_email.id
  }

  async sendEmail(emailId: String): Promise<any>{
    return this.pipefyFetch(`mutation { sendInboxEmail(input: {id: ${emailId} }) { clientMutationId } }`)
  }
  
  /**
   * Wraps a field name and value into a specific string format.
   * 
   * @param fieldName - The name of the field to wrap.
   * @param value - The value of the field. Can be a single value or an array of values.
   * @returns A string in the format `{ field_id: "fieldName", field_value: "value" }` or 
   *          `{ field_id: "fieldName", field_value: [ "value1", "value2", ... ] }` if the value is an array.
   *          Returns `null` if the value is `null` or `undefined`.
   */
  private wrapField(fieldName: string,value: any): string | null{
    if(Array.isArray( value )){
      return `{ field_id: "${fieldName}", field_value: [ "${ value.join('", "') }" ] }`
  
    } else {
      if(value != null || value != undefined){
        return `{ field_id: "${fieldName}", field_value: "${value}" }`
      } else {
        // console.log("FIELD SKIPPED:",fieldName)
        return null
      }
    }
  }
  
  async createCard(pipeID: string, dataArray: any, reportError = false): Promise<any>{  
  
    let dataToWrite: any[] = []
    if(Array.isArray(dataArray)){
      // Si es Array
      for(let i=0;i<dataArray.length;i++){
        const wrappedField = this.wrapField(dataArray[i].field_id,dataArray[i].field_value)
        if(wrappedField) dataToWrite.push(wrappedField)
      }
    } else {
      // Si es objeto
      for(let param in dataArray){
        const wrappedField = this.wrapField(param,dataArray[param])
        if(wrappedField) dataToWrite.push(wrappedField)
      }
    }
  
  
    const query = `
    mutation{
        createCard(input:{
          pipe_id: ${pipeID},
          fields_attributes: [
            ${ dataToWrite.join(', ') }
          ],
          }) {
          clientMutationId
          card {
            id
          }
        }
      }
      `
    //console.log(query)
  
    // send query
    const resultPipefy: any = await (await this.pipefyFetch(query)).json()
    //console.log('Result: ',resultPipefy)
    //console.log('errors:', resultPipefy.errors[0].message)
  
    if(resultPipefy.errors != undefined){
      const message = `Pipefy error: ${resultPipefy.errors[0].message}`
      //logError(message,500, 'createCard')
      //console.log(message)
      if(reportError){
        return { errors: resultPipefy.errors }
      }
      return message
    }
  
    //logError(`New card created #${resultPipefy.data.createCard.card.id}`, 200, 'createCard')
    return resultPipefy.data.createCard.card.id
  }
  
  /**
   * Extracts the file name from a given URL.
   *
   * @param {string} url - The URL from which to extract the file name.
   * @returns {string | null} The decoded file name if extraction is successful, otherwise null.
   *
   * @throws Will log an error to the console if the URL parsing fails.
   */
  private getFileNameFromURL(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/');
      const lastSegment = pathSegments[pathSegments.length - 1];
      const decodedFileName = decodeURIComponent(lastSegment);
      const fileNameParts = decodedFileName.split('.');
      // Si necesitas la extensión del archivo
      //const fileName = fileNameParts[0]; // Nombre del archivo sin extensión
      //const fileExtension = fileNameParts.length > 1 ? fileNameParts[fileNameParts.length - 1] : ''; // Extensión del archivo
  
      return decodedFileName
    } catch (error) {
      console.error('Error parsing the URL:', error);
      return null;
    }
  }
  
  getPreSignedURL(fileName: String): Promise<Response>{
    let query = `mutation {
      createPresignedUrl(input: { organizationId: ${this.organizationId}, fileName: "${fileName}" }){
        clientMutationId
        url
      }
    }`
    return this.pipefyFetch(query)
  }
  
  private extractPathFromURL(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathWithoutDomain = urlObj.pathname //+ urlObj.search;
  
      const path = pathWithoutDomain.substring(1)
  
      return path; // Remove the leading '/'
    } catch (error) {
      console.error('Error parsing the URL:', error);
      return null;
    }
  }
  
  async uploadFileFromUrl(sourceUrl: string): Promise<string | null>{
    try {
  
      // Search for the name of the file whithin the source URL
      const fileName = this.getFileNameFromURL(sourceUrl)
      if(fileName == null){
        console.log('Error parsing file name from source URL');
        return null
      }
  
      // Look for the upload URL
      const preSignedUrl: any = await (await this.getPreSignedURL(fileName)).json()
      const uploadURL = preSignedUrl.data.createPresignedUrl.url
      if(!uploadURL){
        console.log('Error getting pre signed URL');
        return null
      }
  
      // Realiza una solicitud GET para obtener el contenido del archivo remoto
      const response = await fetch(sourceUrl);
  
      if (response.ok) {
        // Convierte el contenido a ArrayBuffer
        const fileData = await response.arrayBuffer();
  
        // Convertir ArrayBuffer a Blob
        const blob = new Blob([fileData]);
  
        // Realiza la solicitud PUT con fetch
        const uploadResponse = await fetch(uploadURL, {
          method: 'PUT',
          headers: {
            'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream', // Usa el tipo de contenido del archivo remoto o un valor predeterminado
          },
          body: blob,
        });
  
        if (uploadResponse.ok) {
          console.log('Archivo cargado con éxito.',fileName);
          return this.extractPathFromURL(uploadURL)
          
        } else {
          console.error(`Error al cargar el archivo ${fileName}. Estado: ${uploadResponse.status} ${uploadResponse.statusText}`);
        }
      }
      return null
    } catch (error) {
      console.error('Error durante la carga del archivo:', error);
      return null
    }
  }
  
  async uploadFileFromBuffer(fileName: string, fileData: any): Promise<string | null>{
    try {
  
      // Look for the upload URL
      const preSignedUrlResponse = await this.getPreSignedURL(fileName)
      console.log(`preSignedUrlResponse: ${preSignedUrlResponse.status}: ${preSignedUrlResponse.statusText}`)
      const preSignedUrl: any = await (preSignedUrlResponse).json()
      const uploadURL = preSignedUrl.data.createPresignedUrl.url
      if(!uploadURL){
        console.log('Error getting pre signed URL');
        return null
      }
  
  
      // Realiza la solicitud PUT con fetch
      const uploadResponse = await fetch(uploadURL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream', // Usa el tipo de contenido del archivo remoto o un valor predeterminado
        },
        body: fileData,
      });
  
      if (uploadResponse.ok) {
        console.log('Archivo cargado con éxito.',fileName);
        return this.extractPathFromURL(uploadURL)
        
      } else {
        console.error(`Error al cargar el archivo ${fileName}. Estado: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }
    
      return null
    } catch (error) {
      console.error('Error durante la carga del archivo:', error);
      return null
    }
  }



  /**
   * Makes a fetch request to the Pipefy API with the given GraphQL query.
   *
   * @param query - The GraphQL query to be sent in the request body.
   * @param method - The HTTP method to be used for the request (default is 'POST').
   * @returns A promise that resolves to the response of the fetch request.
   */
  pipefyFetch(query: string, method: string = 'POST'): Promise<Response> {

    const options = {
        method: method,
        headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({query: query})
    };
    return fetch(this.endpoint, options)
  }

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