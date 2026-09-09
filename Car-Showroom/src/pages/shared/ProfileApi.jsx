import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/Ui';
import api from '../../services/userApi';

export default function ProfileApi() {
  const [profile, setProfile] = useState(null); const [error, setError] = useState('');
  useEffect(() => { api.get('/account/profile').then(response => setProfile(response.data?.data)).catch(requestError => setError(requestError.response?.data?.message || 'Unable to load profile.')); }, []);
  if (error) return <><PageHeader title="Profile" text="Your account details." /><div className="error">{error}</div></>;
  if (!profile) return <section className="panel empty"><p>Loading profile...</p></section>;
  return <><PageHeader title="Profile" text="Your account details from the backend." /><section className="panel profile"><div className="avatar">{profile.name?.slice(0, 2).toUpperCase()}</div><div><small>Account #{profile.id}</small><h2>{profile.name}</h2><p>{profile.email}</p><div className="specs"><span>Role<b>{profile.role}</b></span><span>Status<b>{profile.status}</b></span><span>CNIC<b>{profile.cnic || '—'}</b></span></div></div></section></>;
}
