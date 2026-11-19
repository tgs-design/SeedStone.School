const ENQUIRY_HEADERS = [
  'Enquiry ID',
  'Submission Date and Time',
  'Student Name',
  'Parent Name',
  'Mobile Number',
  'Interested Grade',
  'City',
  'Lead Status',
  'Submission Key',
]
const ENQUIRY_SHEET_NAME = 'Admission Enquiries'

function doGet() {
  return jsonResponse({ success: true, message: 'Admission enquiry endpoint is available.' })
}

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
    const submissionKey = typeof data.submissionKey === 'string' ? data.submissionKey.trim() : ''

    if (!studentName || !parentName || !isValidMobileNumber(mobileNumber) ||
        !/^Class [1-8]$/.test(interestedGrade) || !city ||
        !/^[0-9a-f-]{36}$/i.test(submissionKey)) {
      return jsonResponse({ success: false, message: 'Check the required enquiry details and try again.' })
    }

    const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SEEDSTONE_SPREADSHEET_ID')
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
        const existingHeaders = sheet.getRange(1, 1, 1, ENQUIRY_HEADERS.length - 1).getValues()[0]
        if (ENQUIRY_HEADERS.slice(0, -1).some((header, index) => existingHeaders[index] !== header)) {
          throw new Error('The Enquiries sheet has unexpected column headers.')
        }
        const submissionKeyHeader = sheet.getRange(1, ENQUIRY_HEADERS.length).getValue()
        if (submissionKeyHeader && submissionKeyHeader !== ENQUIRY_HEADERS[ENQUIRY_HEADERS.length - 1]) {
          throw new Error('The Enquiries sheet has unexpected column headers.')
        }
        if (!submissionKeyHeader) {
          const lastRow = sheet.getLastRow()
          if (lastRow > 1 && sheet.getRange(2, ENQUIRY_HEADERS.length, lastRow - 1, 1)
            .getValues().some((row) => row[0] !== '')) {
            throw new Error('The Enquiries sheet has data in the reserved submission-key column.')
          }
          sheet.getRange(1, ENQUIRY_HEADERS.length).setValue(ENQUIRY_HEADERS[ENQUIRY_HEADERS.length - 1])
        }
      }

      const existingEnquiry = findExistingSubmission(sheet, submissionKey)
      if (existingEnquiry) {
        if (!isSameSubmission(existingEnquiry, studentName, parentName, mobileNumber, interestedGrade, city, submissionKey)) {
          return jsonResponse({ success: false, message: 'This submission key was already used for different enquiry details.' })
        }
        return jsonResponse({ success: true, enquiryId: existingEnquiry[0] })
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
        submissionKey,
      ]
      const rowNumber = sheet.getLastRow() + 1
      sheet.appendRow(row)
      sheet.getRange(rowNumber, 2).setNumberFormat('yyyy-mm-dd hh:mm:ss')
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
    console.error('Apps Script doPost failed:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : '',
    })
    const safeMessages = [
      'The Enquiries sheet has unexpected column headers.',
      'The Enquiries sheet has data in the reserved submission-key column.',
      'The saved enquiry row did not match the submitted details.',
    ]
    const diagnosticError = error instanceof Error && safeMessages.includes(error.message)
      ? error.message
      : 'An unexpected Apps Script or spreadsheet error occurred.'
    return jsonResponse({
      success: false,
      message: 'The enquiry could not be saved to the spreadsheet.',
      diagnosticError: diagnosticError,
    })
  }
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return ''
  const cleaned = value.trim()
  return cleaned.length > 0 && cleaned.length <= maxLength ? cleaned : ''
}

function isValidMobileNumber(value) {
  return /^(?:\+?91[\s-]?)?[6-9]\d{9}$/.test(value)
}

function findExistingSubmission(sheet, submissionKey) {
  const lastRow = sheet.getLastRow()
  if (lastRow < 2) return null
  const keys = sheet.getRange(2, ENQUIRY_HEADERS.length, lastRow - 1, 1).getValues()
  const matchingIndex = keys.findIndex((row) => row[0] === submissionKey)
  return matchingIndex < 0
    ? null
    : sheet.getRange(matchingIndex + 2, 1, 1, ENQUIRY_HEADERS.length).getValues()[0]
}

function isSameSubmission(row, studentName, parentName, mobileNumber, interestedGrade, city, submissionKey) {
  return row[2] === safeCellText(studentName) &&
    row[3] === safeCellText(parentName) &&
    row[4] === safeCellText(mobileNumber) &&
    row[5] === interestedGrade &&
    row[6] === safeCellText(city) &&
    row[8] === submissionKey
}

function safeCellText(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value
}

function jsonResponse(result) {
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON)
}
