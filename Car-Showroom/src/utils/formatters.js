export const formatCurrencyPKR = (value) => `PKR ${Number(value || 0).toLocaleString('en-PK')}`
export const formatNumber = (value) => Number(value || 0).toLocaleString('en-PK')
export const formatDate = (value) => value ? new Intl.DateTimeFormat('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) : '—'
