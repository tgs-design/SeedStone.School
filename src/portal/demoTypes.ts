export type DemoRole = 'student' | 'parent' | 'teacher' | 'counsellor' | 'admin'
export type EnquiryStatus = 'New' | 'Contacted' | 'Follow-up' | 'Closed'

export const demoRoleLabels: Record<DemoRole, string> = {
  student: 'Student',
  parent: 'Parent / Guardian',
  teacher: 'Teacher',
  counsellor: 'Counsellor / Admissions',
  admin: 'School administrator',
}
