export type DemoRole = 'student' | 'parent' | 'teacher' | 'counsellor' | 'admin'
export type EnquiryStatus = 'New' | 'Contacted' | 'Follow-up' | 'Closed'

export const demoRoleLabels: Record<DemoRole, string> = {
  student: 'Student',
  parent: 'Parent / Guardian',
  teacher: 'Teacher',
  counsellor: 'Counsellor / Admissions',
  admin: 'School administrator',
}

export function displayDemoClassGroup(group: string): string {
  const classNumbers = group.match(/classes?\s*(\d+)(?:\s*[–-]\s*(\d+))?/i)?.slice(1).map(Number)
  if (classNumbers?.some((classNumber) => classNumber > 8)) {
    return `Outside current scope · legacy demo value: ${group}`
  }
  return group
}
