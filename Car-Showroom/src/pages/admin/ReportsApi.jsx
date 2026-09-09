import { useEffect, useState } from 'react';
import { BarChart3, Package, TrendingUp } from 'lucide-react';
import { PageHeader, StatCard } from '../../components/common/Ui';
import { getDashboardApi, getVehiclesApi } from '../../services/businessApi';
import { calculateProfit, calculateProfitMargin } from '../../utils/calculations';
import { formatCurrencyPKR } from '../../utils/formatters';

export default function ReportsApi() {
  const [dashboard, setDashboard] = useState(null); const [vehicles, setVehicles] = useState([]); const [error, setError] = useState('');
  useEffect(() => { Promise.all([getDashboardApi(), getVehiclesApi()]).then(([summary, items]) => { setDashboard(summary); setVehicles(items); }).catch(requestError => setError(requestError.response?.data?.message || 'Unable to load reports.')); }, []);
  if (error) return <><PageHeader title="Reports" text="Live inventory and finance reports." /><div className="error">{error}</div></>;
  if (!dashboard) return <section className="panel empty"><p>Loading reports...</p></section>;
  return <><PageHeader title="Reports" text="Live inventory and finance reports." /><div className="stats"><StatCard label="Inventory value" value={formatCurrencyPKR(vehicles.reduce((sum, vehicle) => sum + Number(vehicle.sellingPrice) * Number(vehicle.stock), 0))} Icon={TrendingUp} /><StatCard label="Revenue collected" value={formatCurrencyPKR(dashboard.totalRevenue)} Icon={BarChart3} /><StatCard label="Outstanding balance" value={formatCurrencyPKR(dashboard.outstandingBalance)} Icon={Package} /></div><section className="panel table"><table><thead><tr><th>Vehicle</th><th>Purchase</th><th>Selling</th><th>Profit</th><th>Margin</th></tr></thead><tbody>{vehicles.map(vehicle => <tr key={vehicle.id}><td>{vehicle.make} {vehicle.model}<small>{vehicle.variant}</small></td><td>{formatCurrencyPKR(vehicle.purchaseRate)}</td><td>{formatCurrencyPKR(vehicle.sellingPrice)}</td><td>{formatCurrencyPKR(calculateProfit(vehicle.sellingPrice, vehicle.purchaseRate))}</td><td>{calculateProfitMargin(vehicle.sellingPrice, vehicle.purchaseRate).toFixed(1)}%</td></tr>)}</tbody></table></section></>;
}
