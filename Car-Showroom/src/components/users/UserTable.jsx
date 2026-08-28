import { Edit3, Trash2 } from 'lucide-react'
import { EmptyState, Status } from '../common/Ui'

export default function UserTable({ users, loading, onEdit, onDelete }) {
  if (loading) return <section className="panel empty"><p>Loading users...</p></section>
  if (!users.length) return <section className="panel"><EmptyState text="No users found." /></section>
  return <section className="panel table"><table><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th /></tr></thead><tbody>{users.map(user => <tr key={user.id}><td><b>{user.name}</b><small>{user.id}</small></td><td>{user.email}</td><td>{user.role}</td><td><Status value={user.status} /></td><td className="actions"><button aria-label={`Edit ${user.name}`} onClick={() => onEdit(user)}><Edit3 size={16} /></button><button aria-label={`Delete ${user.name}`} onClick={() => onDelete(user)}><Trash2 size={16} /></button></td></tr>)}</tbody></table></section>
}
