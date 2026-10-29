import { ArrowRight, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDemoState } from '../portal/useDemoState'
import { demoRoleLabels } from '../portal/demoTypes'
import type { DemoRole } from '../portal/demoTypes'

export default function LoginPage() {
  const navigate = useNavigate()
  const { signInAs } = useDemoState()
  const [demoRole, setDemoRole] = useState<DemoRole>('student')

  const enterDemo = () => {
    signInAs(demoRole)
    navigate('/portal')
  }

  return (
    <section className="page-section auth-section">
      <div className="container auth-shell">
        <div className="auth-card">
          <p className="kicker">Classes 1–8 · Learning portal</p>
          <h1>Portal preview</h1>
          <p className="auth-subtext">Real login, signup, password reset, and learner accounts are not configured. Do not enter credentials or personal information here.</p>

          <section className="demo-login">
            <p className="portal-overline"><ShieldAlert size={15} aria-hidden="true" /> Fictional role-based demo</p>
            <p>Select a sample role to preview browser-only prototype screens. This does not authenticate a user or grant secure access.</p>
            <label htmlFor="demo-role">Demo role</label>
            <select id="demo-role" value={demoRole} onChange={(event) => setDemoRole(event.target.value as DemoRole)}>
              {Object.entries(demoRoleLabels).map(([role, label]) => <option value={role} key={role}>{label}</option>)}
            </select>
            <button type="button" className="primary-button full-width" onClick={enterDemo}>Open {demoRoleLabels[demoRole]} demo <ArrowRight size={17} aria-hidden="true" /></button>
          </section>
          <p className="form-note">The prototype uses fictional sample records stored in this browser. It is not connected to a school system, and role selection is not authentication or access control.</p>
        </div>
      </div>
    </section>
  )
}
