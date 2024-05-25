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

  getCardInfo(cardId: string, children = false, parents = false, options: getCardInfoOptions = {} ) {
    let childenQuery = `child_relations { name id cards { id title } }`
    if(children){
      childenQuery = `child_relations { name id cards { id title fields { indexName name value report_value ${options.date_value?"date_value":""} ${options.datetime_value?"datetime_value":""} } } }`
    }
    let parentsQuery = `parent_relations { name id cards { id title } }`
    if(parents){
      parentsQuery = `parent_relations { name id cards { id title fields { indexName name value report_value ${options.date_value?"date_value":""} ${options.datetime_value?"datetime_value":""} } } }`
    }
    return this.pipefyFetch(`{ card(id: "${cardId}") { id pipe {id name suid} title assignees { id name } createdAt createdBy{ id name email createdAt } ${childenQuery} ${parentsQuery} comments_count current_phase { name id } done due_date fields { indexName name value report_value ${options.date_value?"date_value":""} ${options.datetime_value?"datetime_value":""} } labels { id name } phases_history { phase { name  id } firstTimeIn lastTimeOut } url } }`)
  }

  
  getPipeInfo(pipeId: string): Promise<any> {
    return this.pipefyFetch(`{ pipe(id: "${pipeId}") { id name } }`)
  }

  
  moveCardToPhase(cardId: string, phaseId: string): Promise<any>{
    return this.pipefyFetch(`mutation{ moveCardToPhase(input:{ card_id: ${cardId}, destination_phase_id: ${phaseId} }) { clientMutationId } }`)
  }

  
  async findCard(cardTitle: string, pipeId: string) {
    const search: any = await (await this.pipefyFetch(`{ allCards(pipeId: "${pipeId}") { edges { node { id title } } } }`)).json()
    let cardId: string | null = null
    for(let i = 0; i < search.data.allCards.edges.length; i++){
      if(search.data.allCards.edges[i].node.title == cardTitle){
        cardId = search.data.allCards.edges[i].node.id
      }
    }
    return cardId
  }

  
  async findCardFromTitle(title: string, pipeId: string){
    const search: any = await (await this.pipefyFetch(`{ cards(pipe_id: "${pipeId}", search: {title: "${title}"}) { edges { node { id } } } } `)).json()
    if(search.data.cards.edges.length >0){
        return search.data.cards.edges[0].node.id
    } else {
        return null
    }
  }

  async findCardFromField(field: string, value: string, pipeId: string, first: Boolean = true, cards = false){
    let cardfields = ''
    if(cards){
      cardfields = 'fields { indexName name value report_value }'
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

  makeComment(cardId: string, text: string){
    return this.pipefyFetch(`mutation{ createComment(input:{ card_id: "${cardId}", text: "${text.replace(/"/g,"")}" }) { clientMutationId } }`)
  }

  updateFaseField(cardId: string, name: string, value: any, valueIsArray = false ){
    let valueTosend = `"${value}"`
    if(valueIsArray || Array.isArray(value) ){
      valueTosend = `[ "${value.join(", ")}" ]`
    }
    const query = `mutation { updateFieldsValues(input: {nodeId: "${cardId}", values: {fieldId: "${name}", value: ${valueTosend} }}) { clientMutationId } }`
    //console.log('QUERY: ',query)
    return this.pipefyFetch(query)
  }
  
  clearConnectorField(cardId: string, field: string){
    return this.pipefyFetch(`mutation { updateCardField( input: {card_id: ${cardId} , field_id: "${field}", new_value: null} ) { clientMutationId success } }`)
  }
  
  updateFaseFields(cardId: string, fieldsToUpdate: any){
    // fieldsToUpdate debe ser un objeto del tipo { field1: value1, field2: value2, ... }
    // por cada objeto se debe buscar el nombre y valor para colocar en el formato
    // {fieldId: "${name}", value: "${value}" },
    let fieldArray: any[] = []
    let fieldArray2: any[] = []
    for(let field in fieldsToUpdate){
      if(Array.isArray(fieldsToUpdate[field])){
        fieldArray.push(`{fieldId: "${field}", value: [ "${ fieldsToUpdate[field].join('", "') }" ] }`)
      } else {
        if(fieldsToUpdate[field] != null || fieldsToUpdate[field] != undefined){
          fieldArray.push(`{fieldId: "${field}", value: "${fieldsToUpdate[field]}" }`)
        } else {
          //console.log("FIELD SKIPPED:",field)
        }
      }
    }
    const fieldValues = fieldArray.join(', ')
    return this.pipefyFetch(`mutation { updateFieldsValues(input: {nodeId: "${cardId}", values: [ ${fieldValues} ]}) { clientMutationId } }`)
  }
  
  setAssignees(cardId: string, assignees: string[]){
    return this.pipefyFetch(`mutation { updateCard(input: {id: "${cardId}", assignee_ids: [${ assignees.join(', ') }]}) { clientMutationId } }`)
  }
  setDueDate(cardId: string, dueDate: string){
    return this.pipefyFetch(`mutation { updateCard(input: {id: "${cardId}", due_date: "${dueDate}"}) { clientMutationId } }`)
  }
  
  async findRecordInTable(taleId: string, fieldId: string, value: string, fullData = false){
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
  
  private stringClearSpecialChars(text: any){
    return String(text).replace('"','').replace('"','').replace('[','').replace(']','').replace('!','').replace('(',' ').replace(')',' ')
  }
  
  async createTableRecord(tableId: string, data: any[] = []){
  
    let fields_attributes: any[] = []
    for(let i=0; i<data.length;i++){
      fields_attributes.push(`{field_id: "${data[i].id}", field_value: "${ this.stringClearSpecialChars(data[i].value) }"}`)
    }
  
    const query = `
    mutation {
      createTableRecord(input: {table_id: "${tableId}", fields_attributes: [ ${ fields_attributes.join(', ')}]  }){
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
  
  deleteTablerecord(recordId: string){
    return this.pipefyFetch(`mutation { deleteTableRecord(input: {id: "${recordId}"}) { clientMutationId success } }`)
  }
  
  listTableRecords(tableId: string){
    return this.pipefyFetch(`{ table_records(table_id: "${tableId}") { edges { node { id } } } }`)
  }
  
  async logError(message: string, errorCode = 200, functionName: string = ''){
    if(this.logTable == undefined){
      return null
    }
    const now = new Date() 
    return await this.createTableRecord(this.logTable,[ { id: 'error_code', value: errorCode }, { id: 'message', value: message } , { id: 'date', value: now.toLocaleString(this.intlCode,{ timeZone: this.timeZone }) }, { id: 'function', value: functionName } ])
  }
  
  async clearTable(tableId: string) {
    let recordCount = 0
    const recodrs: any = await (await this.listTableRecords(tableId)).json()
    if(recodrs.data.table_records.edges != undefined){
      let promises: any[] = []
      for(let i=0;i<recodrs.data.table_records.edges.length;i++){
        promises.push(this.deleteTablerecord(recodrs.data.table_records.edges[i].node.id))
      }
      const resutl = await Promise.all(promises)
      console.log(resutl)
      return resutl
    }
    return `Deleted ${recordCount} recodrs in table ${tableId}`
  }
  
  
  async createEmailTosend(cardId: String, pipeId: string, from: string, fromName: string, to: string, subject: String, html: String){
    const createEmailResult: any = await (await this.pipefyFetch(`mutation { createInboxEmail( input: { card_id: ${cardId}, repo_id: ${pipeId}, from: "${from}", fromName: "${fromName}", to: "${to}", subject: "${subject}", html: "${html}" } ) { clientMutationId inbox_email{id} } } `)).json()
    if("errors" in createEmailResult){
      console.log(createEmailResult.errors)
      return null
    }
   return createEmailResult.data.createInboxEmail.inbox_email.id
  }
  
  async sendEmail(emailId: String){
    return this.pipefyFetch(`mutation { sendInboxEmail(input: {id: ${emailId} }) { clientMutationId } }`)
  }
  
  private wrapField(fieldName: string,value: any){
    if(Array.isArray( value )){
      return `{ field_id: "${fieldName}", field_value: [ "${ value.join('", "') }" ] }`
  
    } else {
      if(value != null || value != undefined){
        return `{ field_id: "${fieldName}", field_value: "${value}" }`
      } else {
        console.log("FIELD SKIPPED:",fieldName)
        return null
      }
    }
  }
  
  async createCard(pipeID: string, dataArray: any, reportError = false){  
  
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
  
  getPreSignedURL(fileName: String){
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
  
      //console.log("PATH A SUBIR A PIPEFY:", path)
  
      return path; // Remove the leading '/'
    } catch (error) {
      console.error('Error parsing the URL:', error);
      return null;
    }
  }
  
  
  async uploadFileFromUrl(sourceUrl: string){
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
      // const fileFromUrl = await getHttpsFileStream(url)
      //console.log("RESPONSE:",response.ok)
  
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
  
  async uploadFileFromBuffer(fileName: string, fileData: any){
    try {
  
      // Look for the upload URL
      const preSignedUrl: any = await (await this.getPreSignedURL(fileName)).json()
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



  private pipefyFetch(query: string, method: string = 'POST'){

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


export interface getCardInfoOptions {
  date_value?: boolean,
  datetime_value?: boolean
}
