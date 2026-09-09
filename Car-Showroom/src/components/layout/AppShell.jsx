import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, Car, ClipboardList, LayoutDashboard, LogOut, Menu, Package, Settings, Users, X } from 'lucide-react'
import { useAuth } from '../../context/useAuth'

const navigation = {
  Admin: [['/admin/dashboard', 'Dashboard', LayoutDashboard], ['/admin/cars', 'Cars', Car], ['/admin/suppliers', 'Suppliers', Package], ['/admin/customers', 'Customers', Users], ['/admin/applications', 'Applications', ClipboardList], ['/admin/users', 'Users', Users], ['/admin/reports', 'Reports', Package], ['/admin/settings', 'Settings', Settings]],
  'Sales Manager': [['/sales/dashboard', 'Dashboard', LayoutDashboard], ['/showroom', 'Showroom', Car], ['/sales/applications', 'Applications', ClipboardList], ['/sales/customers', 'Customers', Users]],
  'Inventory Manager': [['/inventory/dashboard', 'Dashboard', LayoutDashboard], ['/inventory/cars', 'Cars', Car], ['/admin/suppliers', 'Suppliers', Package], ['/admin/reports', 'Reports', Package]],
  Customer: [['/customer/dashboard', 'Dashboard', LayoutDashboard], ['/showroom', 'Showroom', Car], ['/my-applications', 'My Applications', ClipboardList], ['/profile', 'Profile', Users]],
}

export function AppShell({ children }) {
  const { session, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const links = navigation[session.role] || navigation.Admin
  return <div className="shell"><aside className={open ? 'sidebar open' : 'sidebar'}><div className="brand"><b>AV</b><strong>AUTOVISTA<small>Driven by excellence.</small></strong></div><nav>{links.map(([path, label, Icon]) => <Link className={location.pathname.startsWith(path) ? 'active' : ''} to={path} key={path} onClick={() => setOpen(false)}><Icon size={17} />{label}</Link>)}</nav><Link to="/notifications" className="logout"><Bell size={17} />Notifications</Link><button className="logout" onClick={logout}><LogOut size={17} />Log out</button></aside>{open && <button className="close-nav" onClick={() => setOpen(false)}><X /></button>}<div className="main"><header><button className="menu" onClick={() => setOpen(true)}><Menu /></button><span className="muted">AUTOVISTA / {session.role}</span><span className="user">{session.name}</span></header><main className="content">{children}</main></div></div>
}
