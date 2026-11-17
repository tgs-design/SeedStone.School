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
const ENQUIRY_SHEET_NAME = 'Admission Enquiries'

function doPost(event) {
  try {
    const postBody = event && event.postData && event.postData.contents
    const data = postBody ? JSON.parse(postBody) : null
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return jsonResponse({ success: false, message: 'A JSON enquiry payload is required.' })
    }
    const studentName = cleanText(data.studentName, 100)
    const parentName = cleanText(data.parentName, 100)
    const mobileNumber = cleanText(data.mobile, 20)
    const interestedGrade = cleanText(data.grade, 20)
    const city = cleanText(data.city, 80)

    if (!studentName || !parentName || !isValidMobileNumber(mobileNumber) ||
        !/^Class [1-8]$/.test(interestedGrade) || !city) {
      return jsonResponse({ success: false, message: 'Check the required enquiry details and try again.' })
    }

    const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')
    if (!spreadsheetId) {
      return jsonResponse({ success: false, message: 'Spreadsheet configuration is missing.' })
    }

    const lock = LockService.getScriptLock()
    lock.waitLock(10000)
    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId)
      const sheet = spreadsheet.getSheetByName(ENQUIRY_SHEET_NAME)
      if (!sheet) {
        return jsonResponse({ success: false, message: 'The Admission Enquiries tab was not found.' })
      }

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
      const row = [
        enquiryId,
        new Date(),
        safeCellText(studentName),
        safeCellText(parentName),
        safeCellText(mobileNumber),
        interestedGrade,
        safeCellText(city),
        'New',
      ]
      const rowNumber = sheet.getLastRow() + 1
      sheet.appendRow(row)
      const savedRow = sheet.getRange(rowNumber, 1, 1, row.length).getValues()[0]
      if (
        savedRow[0] !== row[0] ||
        !(savedRow[1] instanceof Date) ||
        row.slice(2).some((value, index) => savedRow[index + 2] !== value)
      ) {
        throw new Error('The saved enquiry row did not match the submitted details.')
      }
      return jsonResponse({ success: true, enquiryId: enquiryId })
    } finally {
      lock.releaseLock()
    }
  } catch (error) {
    console.error(error)
    return jsonResponse({ success: false, message: 'The enquiry could not be saved to the spreadsheet.' })
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

function jsonResponse(result) {
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON)
}
