import { createContext } from 'react'
import type { DemoRole, EnquiryStatus } from './demoTypes'

export type DemoUser = {
  id: string
  name: string
  role: DemoRole
  group: string
}

export type DemoEnquiry = {
  id: string
  family: string
  classGroup: string
  topic: string
  status: EnquiryStatus
  note: string
  followUp: string
}

export type DemoState = {
  session: DemoRole | null
  completedActivities: string[]
  points: number
  activity: { title: string; instructions: string }
  feedback: Record<string, string>
  enquiries: DemoEnquiry[]
  users: DemoUser[]
}

export type DemoStateContextValue = {
  session: DemoRole | null
  completedActivities: string[]
  points: number
  activity: { title: string; instructions: string }
  feedback: Record<string, string>
  enquiries: DemoEnquiry[]
  users: DemoUser[]
  persistenceAvailable: boolean | null
  signInAs: (role: DemoRole) => void
  signOut: () => void
  completeActivity: (id: string) => void
  updateActivity: (activity: { title: string; instructions: string }) => void
  saveFeedback: (id: string, value: string) => void
  updateEnquiry: (id: string, update: Partial<Pick<DemoEnquiry, 'status' | 'note' | 'followUp'>>) => void
  updateUser: (id: string, name: string) => void
  resetDemo: () => void
}

export const DemoStateContext = createContext<DemoStateContextValue | null>(null)
