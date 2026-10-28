import { useContext } from 'react'
import { DemoStateContext } from './DemoStateContext'

export function useDemoState() {
  const context = useContext(DemoStateContext)
  if (!context) throw new Error('useDemoState must be used inside DemoStateProvider.')
  return context
}
