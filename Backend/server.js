require('dotenv').config();
const bcrypt = require('bcrypt');
const app = require('./app');
const sequelize = require('./config/db');
const { User, Vehicle, Supplier, Setting } = require('./models');

const PORT = process.env.PORT || 5000;

const demoUsers = [
  { name: 'Adeel Khan', email: 'admin@udevs.com', password: 'Admin@123', role: 'Admin' },
  { name: 'Maya Siddiqui', email: 'sales@udevs.com', password: 'Sales@123', role: 'Sales Manager' },
  { name: 'Hamza Qureshi', email: 'inventory@udevs.com', password: 'Inventory@123', role: 'Inventory Manager' },
  { name: 'Sara Ahmed', email: 'customer@udevs.com', password: 'Customer@123', role: 'Customer' },
];

const demoVehicles = [
  ['BMW', '3 Series', 'M Sport', 2025, 18500000, 15000000, 4, 'Petrol', 'Automatic'],
  ['BMW', 'X5', 'xDrive40i', 2025, 28500000, 23500000, 2, 'Petrol', 'Automatic'],
  ['Mercedes-Benz', 'C-Class', 'C200 AMG', 2024, 22000000, 18200000, 3, 'Petrol', 'Automatic'],
  ['Audi', 'A6', 'S Line', 2025, 24500000, 20500000, 1, 'Petrol', 'Automatic'],
  ['Toyota', 'Corolla Grande', 'X', 2024, 7800000, 6500000, 8, 'Petrol', 'Automatic'],
  ['Toyota', 'Camry', 'Hybrid', 2024, 16500000, 14000000, 4, 'Hybrid', 'Automatic'],
  ['Honda', 'Civic', 'RS Turbo', 2025, 9900000, 8200000, 5, 'Petrol', 'CVT'],
  ['Honda', 'City', 'Aspire Pro', 2024, 6200000, 5250000, 0, 'Petrol', 'CVT'],
  ['Hyundai', 'Tucson', 'Ultimate', 2025, 11800000, 9800000, 3, 'Petrol', 'Automatic'],
  ['KIA', 'Sportage', 'AWD Signature', 2024, 12500000, 10400000, 2, 'Petrol', 'Automatic'],
  ['KIA', 'Sorento', '3.5L AWD', 2023, 17500000, 14800000, 1, 'Petrol', 'Automatic'],
  ['MG', 'HS', 'Exclusive', 2024, 9200000, 7800000, 4, 'Petrol', 'Automatic'],
  ['Toyota', 'Land Cruiser', '300 ZX', 2025, 52000000, 45500000, 1, 'Petrol', 'Automatic'],
];
const demoSuppliers = [
  { companyName: 'Prime Auto Imports', contactPerson: 'Noman Ali', email: 'hello@primeauto.demo', city: 'Lahore', status: 'Active' },
  { companyName: 'Elite Motors Trading', contactPerson: 'Hira Malik', email: 'sales@elitemotors.demo', city: 'Karachi', status: 'Active' },
  { companyName: 'Velocity Auto Traders', contactPerson: 'Usman Tariq', email: 'team@velocity.demo', city: 'Islamabad', status: 'Active' },
];

async function seedDemoUsers() {
  for (const demoUser of demoUsers) {
    const existingUser = await User.findOne({ where: { email: demoUser.email } });
    if (existingUser) continue;

    await User.create({
      name: demoUser.name,
      email: demoUser.email,
      password: await bcrypt.hash(demoUser.password, 10),
      role: demoUser.role,
    });
  }
}

async function seedDemoVehicles() {
  const existingVehicles = await Vehicle.findAll({ order: [['id', 'ASC']] });
  if (existingVehicles.length) {
    for (const [index, vehicle] of existingVehicles.entries()) {
      if (!vehicle.legacyId) await vehicle.update({ legacyId: `CAR-${String(index + 1).padStart(3, '0')}` });
    }
    return;
  }
  await Vehicle.bulkCreate(demoVehicles.map(([make, model, variant, year, sellingPrice, purchaseRate, stock, fuel, transmission], index) => ({
    legacyId: `CAR-${String(index + 1).padStart(3, '0')}`, make, model, variant, year, sellingPrice, purchaseRate, stock,
    fuel, transmission, status: stock > 0 ? 'AVAILABLE' : 'SOLD',
    colors: ['Black', 'White'], images: [],
  })));
}

async function seedBusinessData() {
  if (!(await Supplier.count())) await Supplier.bulkCreate(demoSuppliers);
  await Setting.findOrCreate({ where: { key: 'lowStockThreshold' }, defaults: { value: 5 } });
  await Setting.findOrCreate({ where: { key: 'displayMode' }, defaults: { value: 'premium' } });
}

(async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected');

    await sequelize.sync({ alter: true });
    console.log('Database synced');

    await seedDemoUsers();
    console.log('Demo users ready');
    await seedDemoVehicles();
    console.log('Demo vehicles ready');
    await seedBusinessData();
    console.log('Business data ready');

    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Startup failed:', error);
    process.exit(1);
  }
})();

module.exports = { app, sequelize, User };
