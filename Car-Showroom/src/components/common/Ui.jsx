import { ChevronRight } from 'lucide-react'

export function PageHeader({ title, text, action }) {
  return <div className="page-header"><div><small>AUTOVISTA / {title}</small><h2>{title}</h2><p className="muted">{text}</p></div>{action}</div>
}

export function Status({ value }) {
  return <span className={`status ${value.toLowerCase()}`}>{value}</span>
}

export function PanelTitle({ title, action = 'Live' }) {
  return <div className="panel-title"><h3>{title}</h3><span className="muted">{action}</span></div>
}

export function StatCard({ label, value, Icon }) {
  return <div className="stat"><Icon size={18} /><strong>{value}</strong><span>{label}</span></div>
}

export function EmptyState({ text }) {
  return <div className="empty"><p className="muted">{text}</p></div>
}

export function PrimaryLink({ to, children }) {
  return <a className="primary" href={to}>{children}<ChevronRight size={16} /></a>
}
