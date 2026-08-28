import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { PageHeader } from '../../components/common/Ui'
import DeleteUserModal from '../../components/users/DeleteUserModal'
import UserForm from '../../components/users/UserForm'
import UserTable from '../../components/users/UserTable'
import { createUser, deleteUser, fetchUsers, updateUser } from '../../redux/users/userActions'
import { clearUserError, clearUserSuccess } from '../../redux/users/userSlice'
import { selectUsers, selectUsersError, selectUsersLoading, selectUsersSuccess } from '../../redux/users/userSelectors'

export default function Users() {
  const dispatch = useDispatch()
  const users = useSelector(selectUsers)
  const loading = useSelector(selectUsersLoading)
  const error = useSelector(selectUsersError)
  const success = useSelector(selectUsersSuccess)
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deletingUser, setDeletingUser] = useState(null)
  useEffect(() => { dispatch(fetchUsers()) }, [dispatch])
  useEffect(() => { if (!success) return undefined; const timer = setTimeout(() => dispatch(clearUserSuccess()), 2500); return () => clearTimeout(timer) }, [dispatch, success])
  const filteredUsers = users.filter(user => `${user.name} ${user.email} ${user.role} ${user.status}`.toLowerCase().includes(query.toLowerCase()))
  const saveUser = payload => { const action = editingUser ? updateUser({ id: editingUser.id, payload }) : createUser(payload); dispatch(action).unwrap().then(() => { setFormOpen(false); setEditingUser(null) }).catch(() => {}) }
  const removeUser = () => { dispatch(deleteUser(deletingUser.id)).unwrap().then(() => setDeletingUser(null)).catch(() => {}) }
  const editUser = user => { dispatch(clearUserError()); setEditingUser(user); setFormOpen(true) }
  return <>
    <PageHeader title="User management" text="Control showroom access, roles, and account status." action={<button className="primary" onClick={() => { setEditingUser(null); setFormOpen(true) }}><Plus size={16} /> Add user</button>} />
    <div className="toolbar"><div className="search"><Search size={16} /><input placeholder="Search users" value={query} onChange={event => setQuery(event.target.value)} /></div><span className="muted">{filteredUsers.length} account{filteredUsers.length === 1 ? '' : 's'}</span></div>
    {error && <div className="error user-alert" role="alert">{error}<button onClick={() => dispatch(clearUserError())}>Dismiss</button></div>}
    {success && <div className="success user-alert" role="status">Operation completed.</div>}
    {formOpen && <UserForm key={editingUser?.id || 'new'} user={editingUser} users={users} loading={loading} onSubmit={saveUser} onClose={() => { setFormOpen(false); setEditingUser(null) }} />}
    <UserTable users={filteredUsers} loading={loading && !formOpen} onEdit={editUser} onDelete={setDeletingUser} />
    <DeleteUserModal user={deletingUser} loading={loading} onCancel={() => setDeletingUser(null)} onConfirm={removeUser} />
  </>
}
