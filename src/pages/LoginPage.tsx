import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDemoState } from '../portal/useDemoState'
import { demoRoleLabels } from '../portal/demoTypes'
import type { DemoRole } from '../portal/demoTypes'

type AuthField = 'name' | 'email' | 'password'

export default function LoginPage() {
  const navigate = useNavigate()
  const { signInAs } = useDemoState()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [demoRole, setDemoRole] = useState<DemoRole>('student')
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<Partial<Record<AuthField, string>>>({})
  const [notice, setNotice] = useState('')

  const handleChange = (field: AuthField, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setNotice('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: Partial<Record<AuthField, string>> = {}

    if (mode === 'signup' && !formData.name.trim()) {
      nextErrors.name = 'Name is required for sign up.'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email or mobile is required.'
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setNotice('')
      return
    }

    setNotice('Authentication is a frontend prototype. No account was created and no login was attempted.')
  }

  const enterDemo = () => {
    signInAs(demoRole)
    navigate('/portal')
  }

  return (
    <section className="page-section auth-section">
      <div className="container auth-shell">
        <div className="auth-card">
          <div className="auth-toggle" role="group" aria-label="Authentication mode">
            <button type="button" aria-pressed={mode === 'login'} className={mode === 'login' ? 'tab active' : 'tab'} onClick={() => { setMode('login'); setErrors({}); setNotice('') }}>
              Login
            </button>
            <button type="button" aria-pressed={mode === 'signup'} className={mode === 'signup' ? 'tab active' : 'tab'} onClick={() => { setMode('signup'); setErrors({}); setNotice('') }}>
              Signup
            </button>
          </div>

          <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="auth-subtext">Frontend prototype only. No real authentication is active yet.</p>

          <section className="demo-login">
            <p className="portal-overline">Explore a role-based demo</p>
            <p>Choose a fictional role to explore its sample workspace. This is not a secure login.</p>
            <label htmlFor="demo-role">Demo role</label>
            <select id="demo-role" value={demoRole} onChange={(event) => setDemoRole(event.target.value as DemoRole)}>
              {Object.entries(demoRoleLabels).map(([role, label]) => <option value={role} key={role}>{label}</option>)}
            </select>
            <button type="button" className="primary-button full-width" onClick={enterDemo}>Explore as {demoRoleLabels[demoRole]}</button>
          </section>

          <div className="auth-divider"><span>or use the prototype form</span></div>
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {mode === 'signup' ? (
              <div className="input-group">
                <label htmlFor="auth-name">Name</label>
                <input id="auth-name" type="text" autoComplete="name" value={formData.name} onChange={(event) => handleChange('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'auth-name-error' : undefined} />
                {errors.name ? <span id="auth-name-error" className="field-error">{errors.name}</span> : null}
              </div>
            ) : null}

            <div className="input-group">
              <label htmlFor="auth-email">Email or mobile</label>
              <input id="auth-email" type="text" autoComplete="username" value={formData.email} onChange={(event) => handleChange('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'auth-email-error' : undefined} />
              {errors.email ? <span id="auth-email-error" className="field-error">{errors.email}</span> : null}
            </div>

            <div className="input-group password-field">
              <label htmlFor="auth-password">Password</label>
              <div className="password-input-wrap">
                <input id="auth-password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={formData.password} onChange={(event) => handleChange('password', event.target.value)} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'auth-password-error' : undefined} />
                <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password ? <span id="auth-password-error" className="field-error">{errors.password}</span> : null}
            </div>

            {mode === 'login' ? <button type="button" className="text-button" onClick={() => { setErrors({}); setNotice('Password reset is not available in this frontend prototype yet.') }}>Forgot password?</button> : null}
            {notice ? <p className="auth-subtext" role="status">{notice}</p> : null}

            <button type="submit" className="primary-button full-width">{mode === 'login' ? 'Login' : 'Sign up'}</button>
          </form>
        </div>
      </div>
    </section>
  )
}
