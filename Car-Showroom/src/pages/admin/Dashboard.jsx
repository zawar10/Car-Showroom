import { Car, ClipboardList, Package, TrendingUp } from 'lucide-react'
import { formatCurrencyPKR } from '../../utils/formatters'
import { calculateEstimatedProfit, calculateLowStock } from '../../utils/calculations'
import { getData, STORAGE_KEYS } from '../../services/localStorageService'
import { PageHeader, PanelTitle, StatCard, Status } from '../../components/common/Ui'

const records = (key) => getData(key) || []

export default function Dashboard() {
  const cars = records(STORAGE_KEYS.cars)
  const applications = records(STORAGE_KEYS.applications)
  const lowStock = calculateLowStock(cars)
  return <><PageHeader title="Command center" text="A live view of showroom performance and demand." /><div className="stats"><StatCard label="Total vehicles" value={cars.length} Icon={Car} /><StatCard label="Available stock" value={cars.filter(car => car.status === 'Available').length} Icon={Package} /><StatCard label="Pending applications" value={applications.filter(app => app.status === 'Pending').length} Icon={ClipboardList} /><StatCard label="Estimated profit" value={formatCurrencyPKR(calculateEstimatedProfit(cars))} Icon={TrendingUp} /></div><div className="two-col"><section className="panel"><PanelTitle title="Inventory pulse" /><div className="bars">{['Available', 'Reserved', 'Sold', 'Inactive'].map(status => <div className="bar" key={status}><span>{status}</span><i style={{ width: `${Math.max(8, cars.filter(car => car.status === status).length / cars.length * 100)}%` }} /><b>{cars.filter(car => car.status === status).length}</b></div>)}</div></section><section className="panel"><PanelTitle title="Low stock watchlist" />{lowStock.map(car => <div className="list" key={car.id}><b>{car.make} {car.model}</b><span>{car.stock} units · <Status value={car.status} /></span></div>)}</section></div></>
}
