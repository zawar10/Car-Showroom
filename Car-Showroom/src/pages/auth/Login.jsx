import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { HERO_CAR_IMAGE } from '../../services/localStorageService'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: 'admin@udevs.com', password: 'Admin@123' })
  const [error, setError] = useState('')
  const submit = (event) => {
    event.preventDefault()
    const result = login(form.email, form.password)
    if (!result.ok) return setError(result.message)
    const role = result.user.role
    navigate(role === 'Customer' ? '/customer/dashboard' : `/${role === 'Admin' ? 'admin' : role === 'Sales Manager' ? 'sales' : 'inventory'}/dashboard`)
  }
  return <main className="login-page" style={{ backgroundImage: `linear-gradient(90deg,rgba(5,5,5,.95),rgba(5,5,5,.35)),url(${HERO_CAR_IMAGE})` }}><div className="login-copy"><small>PREMIUM AUTOMOTIVE SHOWROOM</small><h1>AUTOVISTA</h1><p>Driven by excellence.<br />Defined by performance.</p></div><form className="login-card" onSubmit={submit}><small>SECURE ACCESS</small><h2>Welcome back</h2><p className="muted">Sign in to your showroom command center.</p><label>Email<input type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /></label><label>Password<input type="password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} /></label>{error && <div className="error">{error}</div>}<button className="primary full">Sign in <ChevronRight size={16} /></button><small className="muted">Demo: admin@udevs.com / Admin@123</small></form></main>
}
