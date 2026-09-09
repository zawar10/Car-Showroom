import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { PageHeader, EmptyState } from '../../components/common/Ui';
import api from '../../services/userApi';

export default function NotificationsApi() {
  const [items, setItems] = useState(null); const [error, setError] = useState('');
  const load = () => api.get('/account/notifications').then(response => setItems(response.data?.data || [])).catch(requestError => setError(requestError.response?.data?.message || 'Unable to load notifications.'));
  useEffect(() => { load(); }, []);
  const read = async (id) => { await api.patch(`/account/notifications/${id}/read`); await load(); };
  if (error) return <><PageHeader title="Notifications" text="Your account updates." /><div className="error">{error}</div></>;
  if (!items) return <section className="panel empty"><p>Loading notifications...</p></section>;
  return <><PageHeader title="Notifications" text="Your account updates from the backend." />{!items.length ? <section className="panel"><EmptyState text="No notifications yet." /></section> : items.map(item => <article className="panel notification" key={item.id}><Bell size={18} /><div><b>{item.title}</b><p>{item.message}</p><small>{new Date(item.createdAt).toLocaleString()}</small></div>{!item.read && <button className="secondary" onClick={() => read(item.id)}>Mark read</button>}</article>)}</>;
}
