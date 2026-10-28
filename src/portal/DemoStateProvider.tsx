import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { DemoRole, EnquiryStatus } from './demoTypes'
import { DemoStateContext } from './DemoStateContext'
import type { DemoEnquiry, DemoState, DemoStateContextValue, DemoUser } from './DemoStateContext'

const STORAGE_KEY = 'seedstone-learning-demo-v1'
const initialActivity = {
  title: 'Pattern detective',
  instructions: 'Look for the rule in a number sequence, then explain what you noticed.',
}

const initialUsers: DemoUser[] = [
  { id: 'student-sample', name: 'Aarav Mehta (sample)', role: 'student', group: 'Classes 6–8' },
  { id: 'parent-sample', name: 'Mira Mehta (sample)', role: 'parent', group: 'Guardian' },
  { id: 'teacher-sample', name: 'Riya Shah (sample)', role: 'teacher', group: 'Learning guide' },
  { id: 'counsellor-sample', name: 'Dev Patel (sample)', role: 'counsellor', group: 'Admissions demo' },
  { id: 'admin-sample', name: 'Samira Rao (sample)', role: 'admin', group: 'School operations demo' },
  { id: 'student-sample-2', name: 'Ishaan Kapoor (sample)', role: 'student', group: 'Classes 6–8' },
]

const initialEnquiries: DemoEnquiry[] = [
  { id: 'enquiry-1', family: 'Demo family A', classGroup: 'Classes 6–8', topic: 'Learning approach', status: 'New', note: '', followUp: '' },
  { id: 'enquiry-2', family: 'Demo family B', classGroup: 'Classes 1–5', topic: 'Programme details', status: 'Contacted', note: 'Sample note only.', followUp: '' },
  { id: 'enquiry-3', family: 'Demo family C', classGroup: 'Classes 9–10', topic: 'Class availability', status: 'Follow-up', note: '', followUp: '' },
]

function createInitialState(): DemoState {
  return {
    session: null,
    completedActivities: [],
    points: 0,
    activity: initialActivity,
    feedback: {},
    enquiries: initialEnquiries,
    users: initialUsers,
  }
}

const validRoles: DemoRole[] = ['student', 'parent', 'teacher', 'counsellor', 'admin']
const validStatuses: EnquiryStatus[] = ['New', 'Contacted', 'Follow-up', 'Closed']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readStoredState(): DemoState {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return createInitialState()

    const parsed: unknown = JSON.parse(stored)
    if (!isRecord(parsed)) return createInitialState()

    const session = validRoles.includes(parsed.session as DemoRole) ? parsed.session as DemoRole : null
    const completedActivities = Array.isArray(parsed.completedActivities)
      ? parsed.completedActivities.filter((item): item is string => typeof item === 'string')
      : []
    const points = typeof parsed.points === 'number' && Number.isFinite(parsed.points) ? Math.max(0, parsed.points) : 0
    const activity = isRecord(parsed.activity)
      && typeof parsed.activity.title === 'string'
      && typeof parsed.activity.instructions === 'string'
      ? { title: parsed.activity.title, instructions: parsed.activity.instructions }
      : initialActivity
    const feedback = isRecord(parsed.feedback)
      ? Object.fromEntries(Object.entries(parsed.feedback).filter((entry): entry is [string, string] => typeof entry[1] === 'string'))
      : {}
    const enquiries = Array.isArray(parsed.enquiries) ? parsed.enquiries.filter((item): item is DemoEnquiry =>
      isRecord(item)
      && typeof item.id === 'string'
      && typeof item.family === 'string'
      && typeof item.classGroup === 'string'
      && typeof item.topic === 'string'
      && validStatuses.includes(item.status as EnquiryStatus)
      && typeof item.note === 'string'
      && typeof item.followUp === 'string',
    ) : initialEnquiries
    const users = Array.isArray(parsed.users) ? parsed.users.filter((item): item is DemoUser =>
      isRecord(item)
      && typeof item.id === 'string'
      && typeof item.name === 'string'
      && validRoles.includes(item.role as DemoRole)
      && typeof item.group === 'string',
    ) : initialUsers

    return { session, completedActivities, points, activity, feedback, enquiries, users }
  } catch {
    return createInitialState()
  }
}

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(readStoredState)
  const [persistenceAvailable, setPersistenceAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    void Promise.resolve().then(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
        setPersistenceAvailable(true)
      } catch {
        setPersistenceAvailable(false)
      }
    })
  }, [state])

  const value = useMemo<DemoStateContextValue>(() => ({
    ...state,
    persistenceAvailable,
    signInAs: (role) => setState((current) => ({ ...current, session: role })),
    signOut: () => setState((current) => ({ ...current, session: null })),
    completeActivity: (id) => setState((current) => current.completedActivities.includes(id)
      ? current
      : { ...current, completedActivities: [...current.completedActivities, id], points: current.points + 20 }),
    updateActivity: (activity) => setState((current) => ({ ...current, activity })),
    saveFeedback: (id, feedback) => setState((current) => ({ ...current, feedback: { ...current.feedback, [id]: feedback } })),
    updateEnquiry: (id, update) => setState((current) => ({
      ...current,
      enquiries: current.enquiries.map((enquiry) => enquiry.id === id ? { ...enquiry, ...update } : enquiry),
    })),
    updateUser: (id, name) => setState((current) => ({
      ...current,
      users: current.users.map((user) => user.id === id ? { ...user, name } : user),
    })),
    resetDemo: () => setState(createInitialState()),
  }), [state, persistenceAvailable])

  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>
}
