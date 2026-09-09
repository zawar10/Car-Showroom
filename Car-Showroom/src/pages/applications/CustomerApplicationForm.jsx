import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/Ui';
import { createApplicationApi, getVehiclesApi } from '../../services/workflowApi';
import { formatCurrencyPKR } from '../../utils/formatters';

export default function CustomerApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getVehiclesApi(true).then((vehicles) => {
      const match = vehicles.find((item) => item.legacyId === id || String(item.id) === id);
      setVehicle(match || null);
      setSelectedColor(match?.colors?.[0] || '');
    }).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load vehicle.'));
  }, [id]);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await createApplicationApi({ vehicleId: vehicle.id, selectedColor, remarks });
      navigate('/my-applications');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to submit application.');
    } finally { setSaving(false); }
  };

  if (error && !vehicle) return <><PageHeader title="Apply for vehicle" text="Application unavailable." /><div className="error" role="alert">{error}</div></>;
  if (!vehicle) return <section className="panel empty"><p>Loading vehicle...</p></section>;
  return <><PageHeader title="Apply for vehicle" text={`${vehicle.make} ${vehicle.model} ${vehicle.variant}`} /><form className="panel form" onSubmit={submit}><h3>{vehicle.make} {vehicle.model}</h3><p>{formatCurrencyPKR(vehicle.sellingPrice)} · {vehicle.year}</p><label>Selected color<select required value={selectedColor} onChange={(event) => setSelectedColor(event.target.value)}>{(vehicle.colors || []).map((color) => <option key={color}>{color}</option>)}</select></label><label>Remarks<textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Add any relevant notes" /></label>{error && <div className="error" role="alert">{error}</div>}<button className="primary" disabled={saving}>{saving ? 'Submitting...' : 'Submit application'}</button></form></>;
}
