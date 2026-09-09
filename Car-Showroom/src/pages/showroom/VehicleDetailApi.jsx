import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PageHeader, Status } from '../../components/common/Ui';
import { getVehicleApi } from '../../services/businessApi';
import { formatCurrencyPKR } from '../../utils/formatters';
import { HERO_CAR_IMAGE } from '../../services/localStorageService';

export default function VehicleDetailApi() {
  const { id } = useParams(); const [vehicle, setVehicle] = useState(null); const [error, setError] = useState('');
  useEffect(() => { getVehicleApi(id).then(setVehicle).catch(requestError => setError(requestError.response?.data?.message || 'Vehicle not found.')); }, [id]);
  if (error) return <><PageHeader title="Vehicle" text="The requested vehicle is unavailable." /><div className="error" role="alert">{error}</div></>;
  if (!vehicle) return <section className="panel empty"><p>Loading vehicle...</p></section>;
  const available = vehicle.status === 'AVAILABLE' && vehicle.stock > 0;
  return <><PageHeader title={`${vehicle.make} ${vehicle.model}`} text={vehicle.variant} /><div className="details"><img src={vehicle.images?.[0] || HERO_CAR_IMAGE} alt={`${vehicle.make} ${vehicle.model}`} /><div><small>{vehicle.legacyId || vehicle.id} · {vehicle.year}</small><h1>{vehicle.make} {vehicle.model}</h1><p className="lead">{vehicle.description || 'A carefully selected vehicle from the AUTOVISTA collection.'}</p><strong className="price">{formatCurrencyPKR(vehicle.sellingPrice)}</strong><Status value={vehicle.status} /><div className="specs">{[['Fuel', vehicle.fuel], ['Transmission', vehicle.transmission], ['Mileage', vehicle.mileage], ['Engine', vehicle.engine], ['Colors', vehicle.colors?.join(', ')], ['Stock', vehicle.stock]].map(([label, value]) => <span key={label}>{label}<b>{value || '—'}</b></span>)}</div>{available && <Link className="primary" to={`/apply/${vehicle.legacyId || vehicle.id}`}>Apply for this vehicle <ChevronRight size={16} /></Link>}</div></div></>;
}
