import { useEffect, useState } from 'react';
import { PageHeader, EmptyState } from '../../components/common/Ui';
import api from '../../services/userApi';

export default function CustomersApi() {
  const [customers, setCustomers] = useState(null); const [error, setError] = useState('');
  useEffect(() => { api.get('/account/customers').then(response => setCustomers(response.data?.data || [])).catch(requestError => setError(requestError.response?.data?.message || 'Unable to load customers.')); }, []);
  if (error) return <><PageHeader title="Customers" text="Customer accounts from PostgreSQL." /><div className="error">{error}</div></>;
  if (!customers) return <section className="panel empty"><p>Loading customers...</p></section>;
  return <><PageHeader title="Customers" text="Customer accounts from PostgreSQL." />{!customers.length ? <section className="panel"><EmptyState text="No customers found." /></section> : <section className="panel table"><table><thead><tr><th>Customer</th><th>Email</th><th>Phone</th><th>CNIC</th><th>Status</th></tr></thead><tbody>{customers.map(customer => <tr key={customer.id}><td><b>{customer.name}</b><small>#{customer.id}</small></td><td>{customer.email}</td><td>{customer.phone || '—'}</td><td>{customer.cnic || '—'}</td><td>{customer.status}</td></tr>)}</tbody></table></section>}</>;
}
