import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import { PageHeader, Status, EmptyState } from '../../components/common/Ui';
import { getVehiclesApi } from '../../services/businessApi';
import { formatCurrencyPKR } from '../../utils/formatters';
import { HERO_CAR_IMAGE } from '../../services/localStorageService';

export default function ShowroomApi() {
  const [vehicles, setVehicles] = useState([]); const [query, setQuery] = useState(''); const [error, setError] = useState('');
  useEffect(() => { getVehiclesApi({ available: 'true' }).then(setVehicles).catch(requestError => setError(requestError.response?.data?.message || 'Unable to load showroom.')); }, []);
  const filtered = vehicles.filter(vehicle => `${vehicle.make} ${vehicle.model} ${vehicle.variant}`.toLowerCase().includes(query.toLowerCase()));
  return <><section className="hero" style={{ backgroundImage: `linear-gradient(90deg,rgba(5,5,5,.9),rgba(5,5,5,.2)),url(${HERO_CAR_IMAGE})` }}><small>DRIVEN BY PERFORMANCE</small><h1>Find your<br /><em>next statement.</em></h1><p>Precision-crafted vehicles for the roads ahead.</p><a className="primary" href="#collection">Explore collection <ChevronRight size={16} /></a></section><PageHeader title="The collection" text="Vehicles with presence, selected for the road ahead." /><div className="toolbar"><div className="search"><Search size={16} /><input placeholder="Search the collection" value={query} onChange={event => setQuery(event.target.value)} /></div></div>{error && <div className="error" role="alert">{error}</div>}{!filtered.length ? <section className="panel"><EmptyState text="No available vehicles found." /></section> : <div className="cards">{filtered.map(vehicle => <article className="car-card" key={vehicle.id}><div className="car-img"><img src={vehicle.images?.[0] || HERO_CAR_IMAGE} alt={`${vehicle.make} ${vehicle.model}`} /><Status value={vehicle.status} /></div><div className="car-copy"><small>{vehicle.year} · {vehicle.transmission} · {vehicle.fuel}</small><h3>{vehicle.make} {vehicle.model}</h3><p>{vehicle.variant}</p><strong>{formatCurrencyPKR(vehicle.sellingPrice)}</strong><Link to={`/showroom/${vehicle.legacyId || vehicle.id}`}>View details <ChevronRight size={15} /></Link></div></article>)}</div>}</>;
}
