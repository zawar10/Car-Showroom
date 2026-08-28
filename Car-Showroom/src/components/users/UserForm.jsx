import { useState } from 'react'
import { X } from 'lucide-react'

const emptyForm = { name: '', email: '', role: 'User', status: 'Active' }

export default function UserForm({ user, loading, users, onSubmit, onClose }) {
  const [form, setForm] = useState(user ? { name: user.name, email: user.email, role: user.role, status: user.status } : emptyForm)
  const [errors, setErrors] = useState({})
  const submit = event => {
    event.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email'
    if (users.some(item => item.email.toLowerCase() === form.email.trim().toLowerCase() && item.id !== user?.id)) nextErrors.email = 'Email already exists'
    if (!form.role) nextErrors.role = 'Role is required'
    if (!form.status) nextErrors.status = 'Status is required'
    if (Object.keys(nextErrors).length) return setErrors(nextErrors)
    onSubmit({ ...form, name: form.name.trim(), email: form.email.trim().toLowerCase() })
  }
  return <form className="panel form user-form" onSubmit={submit}>
    <div className="panel-title"><h3>{user ? 'Edit user' : 'Add user'}</h3><button type="button" className="icon-button" aria-label="Close form" onClick={onClose}><X size={17} /></button></div>
    <div className="form-grid">
      {['name', 'email'].map(field => <label key={field}>{field}<input type={field === 'email' ? 'email' : 'text'} value={form[field]} onChange={event => setForm({ ...form, [field]: event.target.value })} />{errors[field] && <small className="field-error">{errors[field]}</small>}</label>)}
      <label>Role<select value={form.role} onChange={event => setForm({ ...form, role: event.target.value })}><option>User</option><option>Admin</option></select>{errors.role && <small className="field-error">{errors.role}</small>}</label>
      <label>Status<select value={form.status} onChange={event => setForm({ ...form, status: event.target.value })}><option>Active</option><option>Inactive</option></select>{errors.status && <small className="field-error">{errors.status}</small>}</label>
    </div>
    <div><button className="secondary" type="button" onClick={onClose}>Cancel</button> <button className="primary" disabled={loading}>{loading ? 'Saving...' : user ? 'Update user' : 'Create user'}</button></div>
  </form>
}
