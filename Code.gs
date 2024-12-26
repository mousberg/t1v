function doGet(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify({
    'result': 'error',
    'message': 'GET method not supported'
  }));
  
  return output;
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = e.parameter;
    
    // Format timestamp
    const timestamp = new Date().toISOString();
    
    // Initialize all possible fields with default values
    let startupStage = '';
    let checkSize = '';
    let otherRole = '';
    
    // Fill in the appropriate field based on category
    switch(data.category) {
      case 'founder':
        startupStage = data.startupStage;
        break;
      case 'investor':
        checkSize = data.checkSize;
        break;
      case 'na':
        otherRole = data.otherRole;
        break;
    }
    
    // Create row with consistent ordering
    const rowData = [
      timestamp,              // A: Timestamp
      data.firstName,         // B: First Name
      data.lastName,          // C: Last Name
      data.email,            // D: Email
      data.linkedin,         // E: LinkedIn
      data.city,             // F: City
      data.category,         // G: Category
      startupStage,          // H: Startup Stage (if founder)
      checkSize,             // I: Check Size (if investor)
      otherRole              // J: Other Role (if na)
    ];
    
    // Append to sheet
    sheet.appendRow(rowData);
    
    // Return success response
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify({
      'result': 'success',
      'message': 'Data added successfully'
    }));
    
    return output;
    
  } catch (error) {
    // Return error response
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    }));
    
    return output;
  }
}

function doOptions(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };

  // Handle preflight OPTIONS request
  if (e.method === 'OPTIONS') {
    return ContentService.createTextOutput('')
      .setMimeType(ContentService.MimeType.TEXT)
      .setHeaders(headers);
  }

  // Handle POST request
  if (e.postData && e.postData.contents) {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      const data = JSON.parse(e.postData.contents);
      
      sheet.appendRow([
        new Date(),
        data.name,
        data.email,
        data.category
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        'result': 'success',
        'message': 'Data added successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({
        'result': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    'result': 'error',
    'message': 'No data received'
  }))
  .setMimeType(ContentService.MimeType.JSON)
  .setHeaders(headers);
} 