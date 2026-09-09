import { useEffect, useState } from 'react'
import { Car, ClipboardList, Package, TrendingUp } from 'lucide-react'
import { formatCurrencyPKR } from '../../utils/formatters'
import { getDashboardApi } from '../../services/businessApi'
import { PageHeader, PanelTitle, StatCard, Status } from '../../components/common/Ui'

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => { let active = true; getDashboardApi().then(data => active && setDashboard(data)).catch(requestError => active && setError(requestError.response?.data?.message || 'Unable to load dashboard.')); return () => { active = false } }, [])
  if (error) return <><PageHeader title="Command center" text="Live showroom performance and demand." /><div className="error" role="alert">{error}</div></>
  if (!dashboard) return <section className="panel empty"><p>Loading dashboard...</p></section>
  const applications = dashboard.applications || {}
  return <><PageHeader title="Command center" text="Live showroom performance and demand." /><div className="stats"><StatCard label="Total vehicles" value={dashboard.totalVehicles} Icon={Car} /><StatCard label="Available stock" value={dashboard.availableVehicles} Icon={Package} /><StatCard label="Pending applications" value={applications.PENDING || 0} Icon={ClipboardList} /><StatCard label="Revenue collected" value={formatCurrencyPKR(dashboard.totalRevenue)} Icon={TrendingUp} /></div><div className="two-col"><section className="panel"><PanelTitle title="Application pulse" /><div className="bars">{['PENDING', 'APPROVED', 'ASSIGNED', 'COMPLETED', 'REJECTED'].map(status => <div className="bar" key={status}><span>{status}</span><i style={{ width: `${Math.max(8, Math.min(100, (applications[status] || 0) * 20))}%` }} /><b>{applications[status] || 0}</b></div>)}</div></section><section className="panel"><PanelTitle title="Financial position" /><div className="specs"><span>Customers<b>{dashboard.totalCustomers}</b></span><span>Outstanding<b>{formatCurrencyPKR(dashboard.outstandingBalance)}</b></span><span>Overdue installments<b>{dashboard.overdueInstallments}</b></span><span>Sold vehicles<b>{dashboard.soldVehicles}</b></span></div><Status value="Live" /></section></div></>
}
