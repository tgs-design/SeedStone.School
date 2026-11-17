export type FormState = {
  studentName: string
  parentName: string
  mobile: string
  grade: string
  city: string
}

export type FormErrors = Partial<Record<keyof FormState, string>>

const grades = Array.from({ length: 8 }, (_, index) => `Class ${index + 1}`)

function isValidMobileNumber(value: string) {
  return /^(?:\+?91[\s-]?)?[6-9]\d{9}$/.test(value)
}

export function getSubmittedValues(fields: FormData): FormState {
  const selectedCity = String(fields.get('city') ?? '').trim()
  return {
    studentName: String(fields.get('studentName') ?? '').trim(),
    parentName: String(fields.get('parentName') ?? '').trim(),
    mobile: String(fields.get('mobile') ?? '').trim(),
    grade: String(fields.get('grade') ?? '').trim(),
    city: selectedCity.toLowerCase() === 'other'
      ? String(fields.get('otherCity') ?? '').trim()
      : selectedCity,
  }
}

export function validateForm(values: FormState): FormErrors {
  const nextErrors: FormErrors = {}
  if (!values.studentName) nextErrors.studentName = 'Enter the student’s name.'
  if (!values.parentName) nextErrors.parentName = 'Enter the parent or guardian’s name.'
  if (!values.mobile) nextErrors.mobile = 'Enter a mobile number.'
  else if (!isValidMobileNumber(values.mobile)) nextErrors.mobile = 'Enter a valid 10-digit Indian mobile number, with or without +91.'
  if (!grades.includes(values.grade)) nextErrors.grade = 'Select a valid interested grade.'
  if (!values.city) nextErrors.city = 'Enter a city.'
  return nextErrors
}
