import { AlertTriangle } from 'lucide-react'

export default function DeleteUserModal({ user, loading, onCancel, onConfirm }) {
  if (!user) return null
  return <div className="modal-backdrop"><section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="delete-user-title"><AlertTriangle size={24} color="#e10600" /><h3 id="delete-user-title">Delete {user.name}?</h3><p className="muted">This will permanently remove the account from user management.</p><button className="secondary" onClick={onCancel}>Cancel</button> <button className="primary" disabled={loading} onClick={onConfirm}>{loading ? 'Deleting...' : 'Delete user'}</button></section></div>
}
