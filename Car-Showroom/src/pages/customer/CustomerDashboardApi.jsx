import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Car, Bell } from 'lucide-react';
import { PageHeader, StatCard, Status, EmptyState } from '../../components/common/Ui';
import { getApplicationsApi } from '../../services/workflowApi';
import { getVehiclesApi } from '../../services/businessApi';

export default function CustomerDashboardApi() {
  const [applications, setApplications] = useState(null); const [vehicles, setVehicles] = useState([]); const [error, setError] = useState('');
  useEffect(() => { Promise.all([getApplicationsApi(), getVehiclesApi({ available: 'true' })]).then(([items, available]) => { setApplications(items); setVehicles(available); }).catch(requestError => setError(requestError.response?.data?.message || 'Unable to load dashboard.')); }, []);
  if (error) return <><PageHeader title="Your dashboard" text="Your showroom activity." /><div className="error">{error}</div></>;
  if (!applications) return <section className="panel empty"><p>Loading dashboard...</p></section>;
  return <><PageHeader title="Your dashboard" text="Your applications and available vehicles from the backend." /><div className="stats"><StatCard label="Applications" value={applications.length} Icon={ClipboardList} /><StatCard label="Available vehicles" value={vehicles.length} Icon={Car} /><StatCard label="Latest status" value={applications[0]?.status || 'None'} Icon={Bell} /></div><section className="panel"><h3>Latest application</h3>{applications[0] ? <div className="application"><div><small>{applications[0].applicationNumber}</small><h3>{applications[0].vehicle?.make} {applications[0].vehicle?.model}</h3><p>Manager: {applications[0].manager?.name || 'Pending assignment'}</p></div><Status value={applications[0].status} /></div> : <EmptyState text="Submit an application from the showroom to begin." />}</section><PageHeader title="Available vehicles" text="Live inventory." /><div className="cards">{vehicles.slice(0, 3).map(vehicle => <article className="panel" key={vehicle.id}><h3>{vehicle.make} {vehicle.model}</h3><p>{vehicle.variant}</p><Link to={`/showroom/${vehicle.legacyId || vehicle.id}`}>View vehicle</Link></article>)}</div></>;
}
