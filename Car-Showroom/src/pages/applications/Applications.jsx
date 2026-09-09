import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { PageHeader, Status } from '../../components/common/Ui';
import { getApplicationsApi, getManagersApi, assignManagerApi, updateApplicationStatusApi } from '../../services/workflowApi';
import { formatCurrencyPKR, formatDate } from '../../utils/formatters';

export default function Applications() {
  const { session } = useAuth();
  const [applications, setApplications] = useState([]);
  const [managers, setManagers] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const items = await getApplicationsApi(status ? { status } : {});
        const eligibleManagers = session.role === 'Admin' ? await getManagersApi() : [];
        if (!active) return;
        setApplications(items);
        setManagers(eligibleManagers);
        setError('');
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || requestError.message || 'Unable to load applications.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [session.role, status]);

  const filtered = applications.filter((application) => `${application.applicationNumber} ${application.customer?.name} ${application.vehicle?.make} ${application.vehicle?.model}`.toLowerCase().includes(query.toLowerCase()));
  const changeStatus = async (application, nextStatus) => {
    try { await updateApplicationStatusApi(application.id, { status: nextStatus }); window.location.reload(); } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to update application.'); }
  };
  const assignManager = async (application, managerId) => {
    if (!managerId) return;
    try { await assignManagerApi(application.id, Number(managerId)); window.location.reload(); } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to assign manager.'); }
  };

  return <>
    <PageHeader title="Applications" text="Review, approve, assign, and monitor customer applications." />
    <div className="toolbar"><div className="search"><Search size={16} /><input placeholder="Search applications" value={query} onChange={(event) => setQuery(event.target.value)} /></div><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option>{['PENDING', 'APPROVED', 'REJECTED', 'ASSIGNED', 'IN_PROCESS', 'VEHICLE_SELECTED', 'FINANCE_SETUP', 'PAYMENT_IN_PROGRESS', 'READY_FOR_DELIVERY', 'COMPLETED'].map((item) => <option key={item}>{item}</option>)}</select></div>
    {error && <div className="error user-alert" role="alert">{error}</div>}
    {loading ? <section className="panel empty"><p>Loading applications...</p></section> : <section className="panel table"><table><thead><tr><th>Application</th><th>Customer</th><th>Vehicle</th><th>Manager</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead><tbody>{filtered.map((application) => <tr key={application.id}><td><Link to={`/${session.role === 'Admin' ? 'admin' : 'sales'}/applications/${application.id}`}><b>{application.applicationNumber}</b></Link></td><td>{application.customer?.name}<small>{application.customer?.email}</small></td><td>{application.vehicle?.make} {application.vehicle?.model}<small>{formatCurrencyPKR(application.vehicle?.sellingPrice)}</small></td><td>{application.manager?.name || <select defaultValue="" onChange={(event) => assignManager(application, event.target.value)}><option value="">Assign manager</option>{managers.map((manager) => <option key={manager.id} value={manager.id}>{manager.name}</option>)}</select>}</td><td><Status value={application.status} /></td><td>{formatDate(application.createdAt)}</td><td>{application.status === 'PENDING' && <><button className="secondary" onClick={() => changeStatus(application, 'APPROVED')}>Approve</button><button className="secondary" onClick={() => changeStatus(application, 'REJECTED')}>Reject</button></>}</td></tr>)}</tbody></table></section>}
  </>;
}
