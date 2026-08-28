export const STORAGE_KEYS = {
  users: 'udevs_users',
  session: 'udevs_session',
  cars: 'udevs_cars',
  suppliers: 'udevs_suppliers',
  customers: 'udevs_customers',
  applications: 'udevs_applications',
  notifications: 'udevs_notifications',
  activityLogs: 'udevs_activity_logs',
  settings: 'udevs_settings',
}

const heroImage = 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=2200&q=85'
const carImages = [
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
]

const users = [
  { id: 'USR-001', name: 'Adeel Khan', email: 'admin@udevs.com', password: 'Admin@123', role: 'Admin', status: 'Active' },
  { id: 'USR-002', name: 'Maya Siddiqui', email: 'sales@udevs.com', password: 'Sales@123', role: 'Sales Manager', status: 'Active' },
  { id: 'USR-003', name: 'Hamza Qureshi', email: 'inventory@udevs.com', password: 'Inventory@123', role: 'Inventory Manager', status: 'Active' },
  { id: 'USR-004', name: 'Sara Ahmed', email: 'customer@udevs.com', password: 'Customer@123', role: 'Customer', status: 'Active' },
]

const suppliers = [
  { id: 'SUP-001', companyName: 'Prime Auto Imports', contactPerson: 'Noman Ali', email: 'hello@primeauto.demo', phone: '03001112223', city: 'Lahore', status: 'Active', notes: 'European and Japanese imports.' },
  { id: 'SUP-002', companyName: 'Elite Motors Trading', contactPerson: 'Hira Malik', email: 'sales@elitemotors.demo', phone: '03002223334', city: 'Karachi', status: 'Active', notes: 'Premium SUVs.' },
  { id: 'SUP-003', companyName: 'Velocity Auto Traders', contactPerson: 'Usman Tariq', email: 'team@velocity.demo', phone: '03003334445', city: 'Islamabad', status: 'Active', notes: 'Executive sedans.' },
  { id: 'SUP-004', companyName: 'Metro Vehicle Imports', contactPerson: 'Ayan Raza', email: 'info@metrovehicle.demo', phone: '03004445556', city: 'Rawalpindi', status: 'Active', notes: 'Local distribution.' },
  { id: 'SUP-005', companyName: 'AutoHub Pakistan', contactPerson: 'Zoya Farooq', email: 'contact@autohub.demo', phone: '03005556667', city: 'Faisalabad', status: 'Inactive', notes: 'Awaiting renewal.' },
]

const carNames = [
  ['BMW', '3 Series', 'M Sport', 2025, 18500000, 15000000, 4, 'Petrol', 'Automatic', '12,000 km', '2.0L Turbo', ['Black', 'White', 'Blue'], 'SUP-003', 'Available'],
  ['BMW', 'X5', 'xDrive40i', 2025, 28500000, 23500000, 2, 'Petrol', 'Automatic', '8,500 km', '3.0L Twin Turbo', ['Black', 'Silver'], 'SUP-001', 'Reserved'],
  ['Mercedes-Benz', 'C-Class', 'C200 AMG', 2024, 22000000, 18200000, 3, 'Petrol', 'Automatic', '16,000 km', '1.5L Turbo', ['White', 'Graphite'], 'SUP-003', 'Available'],
  ['Audi', 'A6', 'S Line', 2025, 24500000, 20500000, 1, 'Petrol', 'Automatic', '6,200 km', '2.0L TFSI', ['Black', 'White'], 'SUP-001', 'Available'],
  ['Toyota', 'Corolla Grande', 'X', 2024, 7800000, 6500000, 8, 'Petrol', 'Automatic', '22,000 km', '1.8L', ['White', 'Silver', 'Black'], 'SUP-004', 'Available'],
  ['Toyota', 'Camry', 'Hybrid', 2024, 16500000, 14000000, 4, 'Hybrid', 'Automatic', '9,800 km', '2.5L Hybrid', ['White', 'Red'], 'SUP-004', 'Available'],
  ['Honda', 'Civic', 'RS Turbo', 2025, 9900000, 8200000, 5, 'Petrol', 'CVT', '7,500 km', '1.5L Turbo', ['Red', 'White', 'Black'], 'SUP-004', 'Available'],
  ['Honda', 'City', 'Aspire Pro', 2024, 6200000, 5250000, 0, 'Petrol', 'CVT', '25,000 km', '1.5L', ['White', 'Silver'], 'SUP-004', 'Sold'],
  ['Hyundai', 'Tucson', 'Ultimate', 2025, 11800000, 9800000, 3, 'Petrol', 'Automatic', '11,500 km', '2.0L', ['Black', 'Grey'], 'SUP-002', 'Available'],
  ['KIA', 'Sportage', 'AWD Signature', 2024, 12500000, 10400000, 2, 'Petrol', 'Automatic', '18,000 km', '2.0L', ['White', 'Blue'], 'SUP-002', 'Reserved'],
  ['KIA', 'Sorento', '3.5L AWD', 2023, 17500000, 14800000, 1, 'Petrol', 'Automatic', '31,000 km', '3.5L V6', ['Black', 'White'], 'SUP-002', 'Available'],
  ['MG', 'HS', 'Exclusive', 2024, 9200000, 7800000, 4, 'Petrol', 'Automatic', '14,000 km', '1.5L Turbo', ['Red', 'Black'], 'SUP-002', 'Inactive'],
  ['Toyota', 'Land Cruiser', '300 ZX', 2025, 52000000, 45500000, 1, 'Petrol', 'Automatic', '3,000 km', '3.5L V6', ['White', 'Black'], 'SUP-001', 'Available'],
]

const cars = carNames.map((car, index) => {
  const [make, model, variant, year, sellingPrice, purchaseRate, stock, fuel, transmission, mileage, engine, colors, supplierId, status] = car
  return { id: `CAR-${String(index + 1).padStart(3, '0')}`, make, model, variant, year, sellingPrice, purchaseRate, stock, fuel, transmission, mileage, engine, colors, supplierId, status, images: [carImages[index % carImages.length], carImages[(index + 1) % carImages.length]], description: `A meticulously selected ${make} ${model} with a refined ${variant} specification, prepared for the AUTOVISTA collection.` }
})

const customers = [
  { id: 'CUS-001', name: 'Sara Ahmed', email: 'customer@udevs.com', phone: '03001234567', cnic: '35202-1234567-8', address: 'Gulberg III', city: 'Lahore', status: 'Active' },
  { id: 'CUS-002', name: 'Bilal Hassan', email: 'bilal.demo@example.com', phone: '03011234567', cnic: '35202-2345678-9', address: 'DHA Phase 5', city: 'Karachi', status: 'Active' },
  { id: 'CUS-003', name: 'Mariam Rauf', email: 'mariam.demo@example.com', phone: '03121234567', cnic: '61101-3456789-0', address: 'F-7 Markaz', city: 'Islamabad', status: 'Active' },
  { id: 'CUS-004', name: 'Omar Shah', email: 'omar.demo@example.com', phone: '03211234567', cnic: '37405-4567890-1', address: 'Cantt', city: 'Rawalpindi', status: 'Active' },
]

const applications = [
  { id: 'APP-2026-0001', customerId: 'CUS-002', customerName: 'Bilal Hassan', carId: 'CAR-002', carName: 'BMW X5', color: 'Black', date: '2026-08-05', updatedAt: '2026-08-08', status: 'Approved', notes: 'Executive purchase.' },
  { id: 'APP-2026-0002', customerId: 'CUS-003', customerName: 'Mariam Rauf', carId: 'CAR-007', carName: 'Honda Civic', color: 'Red', date: '2026-08-09', updatedAt: '2026-08-09', status: 'Pending', notes: '' },
  { id: 'APP-2026-0003', customerId: 'CUS-004', customerName: 'Omar Shah', carId: 'CAR-010', carName: 'KIA Sportage', color: 'White', date: '2026-07-21', updatedAt: '2026-07-25', status: 'Reserved', notes: '' },
  { id: 'APP-2026-0004', customerId: 'CUS-001', customerName: 'Sara Ahmed', carId: 'CAR-003', carName: 'Mercedes-Benz C-Class', color: 'White', date: '2026-06-18', updatedAt: '2026-07-01', status: 'Completed', notes: '' },
  { id: 'APP-2026-0005', customerId: 'CUS-002', customerName: 'Bilal Hassan', carId: 'CAR-006', carName: 'Toyota Camry', color: 'Red', date: '2026-07-30', updatedAt: '2026-08-01', status: 'Rejected', notes: '' },
]

export const HERO_CAR_IMAGE = heroImage

export function getData(key) {
  try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
}
export function setData(key, data) { localStorage.setItem(key, JSON.stringify(data)); return data }
export function removeData(key) { localStorage.removeItem(key) }
export function clearData(key) { removeData(key) }
export function generateId(prefix) { return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 999)}` }

export function seedInitialData() {
  const seed = { [STORAGE_KEYS.users]: users, [STORAGE_KEYS.cars]: cars, [STORAGE_KEYS.suppliers]: suppliers, [STORAGE_KEYS.customers]: customers, [STORAGE_KEYS.applications]: applications, [STORAGE_KEYS.notifications]: [{ id: 'NOT-001', userId: 'USR-002', title: 'New application received', message: 'Mariam Rauf submitted a Honda Civic application.', read: false, createdAt: '2026-08-09' }], [STORAGE_KEYS.activityLogs]: [{ id: 'LOG-001', action: 'System initialized', entity: 'System', entityId: 'SYS', description: 'AUTOVISTA showroom data loaded.', userId: 'USR-001', timestamp: '2026-08-01T09:00:00' }], [STORAGE_KEYS.settings]: { lowStockThreshold: 5, displayMode: 'premium' } }
  Object.entries(seed).forEach(([key, value]) => {
    if (localStorage.getItem(key) === null) setData(key, value)
  })
  const storedUsers = getData(STORAGE_KEYS.users)
  if (!Array.isArray(storedUsers)) {
    setData(STORAGE_KEYS.users, users)
    return
  }
  const missingUsers = users.filter((seedUser) => !storedUsers.some((storedUser) => storedUser.email?.toLowerCase() === seedUser.email.toLowerCase()))
  if (missingUsers.length) setData(STORAGE_KEYS.users, [...storedUsers, ...missingUsers])
}
