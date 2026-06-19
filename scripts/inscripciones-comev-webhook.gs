/**
 * Web App POST — Inscripciones COMEV 2026
 * Pegar en Apps Script del Google Sheet y volver a desplegar la aplicación web.
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var data = JSON.parse(e.postData.contents);

    console.log('Datos recibidos: ' + JSON.stringify(data));

    var email = data.email.toLowerCase().trim();
    var values = sheet.getDataRange().getValues();
    var headers = values[0];

    function normalizeText(text) {
      if (!text) return '';
      return text
        .toString()
        .toLowerCase()
        .replace(/[áàäâ]/g, 'a')
        .replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i')
        .replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u')
        .replace(/ñ/g, 'n')
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '');
    }

    var colMap = {};
    for (var col = 0; col < headers.length; col++) {
      var headerNorm = normalizeText(headers[col]);
      colMap[headerNorm] = col + 1;
    }

    var emailColIndex = colMap['correo'] - 1;
    var rowIndex = -1;

    if (emailColIndex > -1) {
      for (var i = 1; i < values.length; i++) {
        if (values[i] && values[i][emailColIndex]) {
          var rowEmail = values[i][emailColIndex].toString().toLowerCase().trim();
          if (rowEmail === email) {
            rowIndex = i + 1;
            break;
          }
        }
      }
    }

    var partnerNameVal = data.partnerName || data.nombreAcompanante || data.nombreacompanante || '';
    var partnerEmailVal = data.partnerEmail || data.correoAcompanante || data.correoacompanante || '';
    var phoneVal = data.phone || data['Celular ppal'] || data.celular || data.WhatsApp || '';
    var partnerPhoneVal = data.partnerPhone || data['Celular pareja'] || data.celularAcompanante || data.celularacompanante || '';
    var cityVal = data.city || data.ciudad || data.delegacion || '';

    var fieldMappings = {
      idticket: data.ticketId,
      nombre: data.name,
      correo: data.email,
      asociacioninstitucion: data.company,
      asosiacioninstitucion: data.company,
      ciudaddelegacion: cityVal,
      ciudad: cityVal,
      delegacion: cityVal,
      cargopuesto: data.position,
      clasificacion: data.badgeRole,
      modalidad: data.ticketType,
      estadodepago: data.status,
      // Celular titular
      celularppal: phoneVal,
      celularprincipal: phoneVal,
      celular: phoneVal,
      telefono: phoneVal,
      whatsapp: phoneVal,
      phone: phoneVal,
      // Celular acompañante (pareja)
      celularpareja: partnerPhoneVal,
      celulardeacompanante: partnerPhoneVal,
      celularacompanante: partnerPhoneVal,
      telefonoacompanante: partnerPhoneVal,
      whatsappacompanante: partnerPhoneVal,
      partnerphone: partnerPhoneVal,
      // Acompañante
      nombredeacompanante: partnerNameVal,
      nombreacompanante: partnerNameVal,
      nombredelacompanante: partnerNameVal,
      partnername: partnerNameVal,
      correodeacompanante: partnerEmailVal,
      correoacompanante: partnerEmailVal,
      correodelacompanante: partnerEmailVal,
      partneremail: partnerEmailVal,
      // Otros
      comprobante: data.comprobante || '',
      fechaderegistro: data.registeredAt,
      ultimaactualizacion: data.updatedAt,
    };

    var targetRow = rowIndex > -1 ? rowIndex : sheet.getLastRow() + 1;

    var rowData = new Array(headers.length);
    for (var c = 0; c < headers.length; c++) {
      var headerNorm = normalizeText(headers[c]);
      var val = fieldMappings[headerNorm];
      rowData[c] = val !== undefined ? val : '';
    }

    sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData]);

    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
