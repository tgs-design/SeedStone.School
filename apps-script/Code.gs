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
  let stage = 'request-validation'
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

    stage = 'spreadsheet-configuration'
    const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SEEDSTONE_SPREADSHEET_ID')
    if (!spreadsheetId) {
      return jsonResponse({ success: false, message: 'Spreadsheet configuration is missing.' })
    }

    const lock = LockService.getScriptLock()
    stage = 'sheet-lock'
    lock.waitLock(10000)
    try {
      stage = 'sheet-open'
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId)
      const sheet = spreadsheet.getSheetByName(ENQUIRY_SHEET_NAME)
      if (!sheet) {
        return jsonResponse({ success: false, message: 'The Admission Enquiries tab was not found.' })
      }

      stage = 'sheet-validation'
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
        if (!isValidEnquiryId(existingEnquiry[0])) {
          return jsonResponse({ success: false, message: 'The saved enquiry could not be verified.' })
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
      const targetRange = sheet.getRange(rowNumber, 1, 1, row.length)
      targetRange.getCell(1, 5).setNumberFormat('@')
      stage = 'row-write'
      targetRange.setValues([row])
      stage = 'row-verification'
      sheet.getRange(rowNumber, 2).setNumberFormat('yyyy-mm-dd hh:mm:ss')
      const savedRow = sheet.getRange(rowNumber, 1, 1, row.length).getValues()[0]
      if (
        savedRow[0] !== row[0] ||
        !(savedRow[1] instanceof Date) ||
        savedRow[2] !== row[2] ||
        savedRow[3] !== row[3] ||
        String(savedRow[4] ?? '').trim() !== String(row[4]).trim() ||
        savedRow[5] !== row[5] ||
        savedRow[6] !== row[6] ||
        savedRow[7] !== row[7] ||
        savedRow[8] !== row[8]
      ) {
        throw new Error('The saved enquiry row did not match the submitted details.')
      }
      return jsonResponse({ success: true, enquiryId: enquiryId })
    } finally {
      lock.releaseLock()
    }
  } catch (error) {
    console.error('Apps Script doPost failed:', {
      stage: stage,
      errorName: error instanceof Error ? error.name : 'UnknownError',
    })
    const submissionKey = event && event.postData && event.postData.contents
      ? getSubmissionKey(event.postData.contents)
      : ''
    const recoveredEnquiryId = submissionKey
      ? findConfirmedExistingSubmission(submissionKey, event.postData.contents)
      : null
    if (recoveredEnquiryId) {
      return jsonResponse({ success: true, enquiryId: recoveredEnquiryId })
    }

    const diagnosticError = stage === 'row-verification'
      ? 'The row was written but its saved values could not be verified.'
      : stage === 'row-write'
        ? 'The row write did not complete and no matching saved row was confirmed.'
        : 'An unexpected Apps Script or spreadsheet error occurred.'
    return jsonResponse({
      success: false,
      message: 'The enquiry could not be saved to the spreadsheet.',
      diagnosticError: diagnosticError,
    })
  }
}

function getSubmissionKey(postBody) {
  try {
    const data = JSON.parse(postBody)
    return data && typeof data.submissionKey === 'string' ? data.submissionKey.trim() : ''
  } catch {
    return ''
  }
}

function findConfirmedExistingSubmission(submissionKey, postBody) {
  let data
  try {
    data = JSON.parse(postBody)
  } catch {
    return null
  }

  const lock = LockService.getScriptLock()
  try {
    lock.waitLock(10000)
    const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SEEDSTONE_SPREADSHEET_ID')
    if (!spreadsheetId) return null
    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(ENQUIRY_SHEET_NAME)
    if (!sheet) return null
    const existingEnquiry = findExistingSubmission(sheet, submissionKey)
    if (
      !existingEnquiry ||
      !isValidEnquiryId(existingEnquiry[0]) ||
      !isSameSubmission(
        existingEnquiry,
        cleanText(data.studentName, 100),
        cleanText(data.parentName, 100),
        cleanText(data.mobile, 20),
        cleanText(data.grade, 20),
        cleanText(data.city, 80),
        submissionKey,
      )
    ) return null
    return existingEnquiry[0]
  } catch (error) {
    console.error('Apps Script saved-row recovery failed:', {
      errorName: error instanceof Error ? error.name : 'UnknownError',
    })
    return null
  } finally {
    if (lock.hasLock()) lock.releaseLock()
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

function isValidEnquiryId(value) {
  return typeof value === 'string' && /^SS-[A-F0-9]{12}$/.test(value)
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
