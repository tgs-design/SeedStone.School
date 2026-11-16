const ENQUIRY_HEADERS = [
  'Enquiry ID',
  'Submission Date and Time',
  'Student Name',
  'Parent Name',
  'Mobile Number',
  'Interested Grade',
  'City',
  'Lead Status',
]

function doPost(event) {
  try {
    const data = event && event.parameter ? event.parameter : {}
    const studentName = cleanText(data.studentName, 100)
    const parentName = cleanText(data.parentName, 100)
    const mobileNumber = cleanText(data.mobile || data.mobileNumber, 20)
    const interestedGrade = cleanText(data.grade || data.interestedGrade, 20)
    const city = cleanText(data.city, 80)

    if (!studentName || !parentName || !isValidMobileNumber(mobileNumber) ||
        !/^Class [1-8]$/.test(interestedGrade) || !city) {
      return responsePage({ status: 'error' })
    }

    const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')
    if (!spreadsheetId) throw new Error('Missing SPREADSHEET_ID script property.')

    const lock = LockService.getScriptLock()
    lock.waitLock(10000)
    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId)
      let sheet = spreadsheet.getSheetByName('Enquiries')
      if (!sheet) sheet = spreadsheet.insertSheet('Enquiries')

      if (sheet.getLastRow() === 0) {
        sheet.appendRow(ENQUIRY_HEADERS)
        sheet.setFrozenRows(1)
      } else {
        const existingHeaders = sheet.getRange(1, 1, 1, ENQUIRY_HEADERS.length).getValues()[0]
        if (ENQUIRY_HEADERS.some((header, index) => existingHeaders[index] !== header)) {
          throw new Error('The Enquiries sheet has unexpected column headers.')
        }
      }

      const enquiryId = 'SS-' + Utilities.getUuid().replace(/-/g, '').slice(0, 12).toUpperCase()
      sheet.appendRow([
        enquiryId,
        new Date(),
        safeCellText(studentName),
        safeCellText(parentName),
        safeCellText(mobileNumber),
        interestedGrade,
        safeCellText(city),
        'New',
      ])
      return responsePage({ status: 'saved', enquiryId: enquiryId })
    } finally {
      lock.releaseLock()
    }
  } catch (error) {
    console.error(error)
    return responsePage({ status: 'error' })
  }
}

function cleanText(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength)
}

function isValidMobileNumber(value) {
  return /^(?:\+?91[\s-]?)?[6-9]\d{9}$/.test(value)
}

function safeCellText(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value
}

function responsePage(result) {
  const message = JSON.stringify({
    type: 'seedstone-enquiry-result',
    status: result.status,
    enquiryId: result.enquiryId || '',
  })
  return HtmlService.createHtmlOutput(
    '<!doctype html><html><body><script>parent.postMessage(' +
      message +
      ', "*");</script></body></html>',
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}
