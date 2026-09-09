import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader, Status } from '../../components/common/Ui';
import { createFinanceApi, getApplicationApi, getVehiclesApi, recordPaymentApi, selectVehicleApi, verifyCustomerApi } from '../../services/workflowApi';
import { formatCurrencyPKR, formatDate } from '../../utils/formatters';

export default function ApplicationDetail() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [vehicleId, setVehicleId] = useState('');
  const [finance, setFinance] = useState({ downPayment: '', duration: 12, frequency: 'MONTHLY' });
  const [payment, setPayment] = useState({ installmentId: '', amount: '', method: 'CASH', reference: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const [details, availableVehicles] = await Promise.all([getApplicationApi(id), getVehiclesApi(true)]);
      setApplication(details);
      setVehicles(availableVehicles);
      setVehicleId(String(details.vehicle?.id || ''));
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load application.'); }
  };
  useEffect(() => {
    let active = true;
    const loadApplication = async () => {
      try {
        const [details, availableVehicles] = await Promise.all([getApplicationApi(id), getVehiclesApi(true)]);
        if (!active) return;
        setApplication(details);
        setVehicles(availableVehicles);
        setVehicleId(String(details.vehicle?.id || ''));
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || 'Unable to load application.');
      }
    };
    loadApplication();
    return () => { active = false; };
  }, [id]);

  const action = async (request, successMessage) => {
    try { await request(); setMessage(successMessage); setError(''); await load(); } catch (requestError) { setError(requestError.response?.data?.message || 'Action failed.'); }
  };
  if (!application) return <section className="panel empty"><p>{error || 'Loading application...'}</p></section>;
  const installments = application.financePlan?.installments || [];

  return <><PageHeader title={application.applicationNumber} text="Application workflow and finance operations." />{error && <div className="error" role="alert">{error}</div>}{message && <div className="success" role="status">{message}</div>}<div className="two-col"><section className="panel"><h3>Application</h3><p>{application.customer?.name} · {application.customer?.email}</p><p>{application.customer?.phone || 'Phone not provided'} · {application.customer?.cnic || 'CNIC not provided'}</p><Status value={application.status} /><div className="specs"><span>Vehicle<b>{application.vehicle?.make} {application.vehicle?.model}</b></span><span>Price<b>{formatCurrencyPKR(application.vehicle?.sellingPrice)}</b></span><span>Verification<b>{application.verificationStatus}</b></span><span>Finance<b>{application.financeStatus}</b></span></div>{application.verificationStatus !== 'VERIFIED' && <button className="primary" onClick={() => action(() => verifyCustomerApi(application.id, 'VERIFIED'), 'Customer verified successfully.')}>Verify customer</button>}</section><section className="panel"><h3>Vehicle and finance</h3>{application.status === 'IN_PROCESS' && <><label>Confirm available vehicle<select value={vehicleId} onChange={(event) => setVehicleId(event.target.value)}><option value="">Select vehicle</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.make} {vehicle.model} · {formatCurrencyPKR(vehicle.sellingPrice)}</option>)}</select></label><button className="primary" disabled={!vehicleId} onClick={() => action(() => selectVehicleApi(application.id, Number(vehicleId)), 'Vehicle selected successfully.')}>Confirm vehicle</button></>}{['VEHICLE_SELECTED', 'IN_PROCESS'].includes(application.status) && !application.financePlan && <form className="form" onSubmit={(event) => { event.preventDefault(); action(() => createFinanceApi(application.id, finance), 'Finance plan created successfully.'); }}><label>Down payment<input type="number" min="0" required value={finance.downPayment} onChange={(event) => setFinance({ ...finance, downPayment: event.target.value })} /></label><label>Duration (months)<input type="number" min="1" required value={finance.duration} onChange={(event) => setFinance({ ...finance, duration: event.target.value })} /></label><label>Frequency<select value={finance.frequency} onChange={(event) => setFinance({ ...finance, frequency: event.target.value })}><option>MONTHLY</option><option>QUARTERLY</option></select></label><button className="primary">Create finance plan</button></form>}{application.financePlan && <><p>Financed: {formatCurrencyPKR(application.financePlan.financedAmount)}</p><p>Installment: {formatCurrencyPKR(application.financePlan.installmentAmount)} · {application.financePlan.frequency}</p></>}</section></div>{installments.length > 0 && <section className="panel table"><h3>Installments and payments</h3><table><thead><tr><th>#</th><th>Due date</th><th>Amount</th><th>Paid</th><th>Status</th><th>Payment</th></tr></thead><tbody>{installments.map((installment) => <tr key={installment.id}><td>{installment.number}</td><td>{formatDate(installment.dueDate)}</td><td>{formatCurrencyPKR(installment.amount)}</td><td>{formatCurrencyPKR(installment.paidAmount)}</td><td><Status value={installment.status} /></td><td>{installment.status !== 'PAID' && <button className="secondary" onClick={() => setPayment({ ...payment, installmentId: installment.id, amount: Number(installment.amount) - Number(installment.paidAmount) })}>Record payment</button>}</td></tr>)}</tbody></table>{payment.installmentId && <form className="form" onSubmit={(event) => { event.preventDefault(); action(() => recordPaymentApi(application.id, payment), 'Payment recorded successfully.'); }}><label>Amount<input type="number" min="0.01" required value={payment.amount} onChange={(event) => setPayment({ ...payment, amount: event.target.value })} /></label><label>Method<select value={payment.method} onChange={(event) => setPayment({ ...payment, method: event.target.value })}><option>CASH</option><option>BANK_TRANSFER</option><option>CARD</option></select></label><label>Reference<input value={payment.reference} onChange={(event) => setPayment({ ...payment, reference: event.target.value })} /></label><button className="primary">Save payment</button></form>}</section>}</>;
}
