export const calculateProfit = (sellingPrice, purchaseRate) => Number(sellingPrice || 0) - Number(purchaseRate || 0)
export const calculateProfitMargin = (sellingPrice, purchaseRate) => Number(sellingPrice) ? (calculateProfit(sellingPrice, purchaseRate) / Number(sellingPrice)) * 100 : 0
export const calculateInventoryValue = (cars) => cars.reduce((total, car) => total + Number(car.sellingPrice || 0) * Number(car.stock || 0), 0)
export const calculateEstimatedProfit = (cars) => cars.reduce((total, car) => total + calculateProfit(car.sellingPrice, car.purchaseRate) * Number(car.stock || 0), 0)
export const calculateLowStock = (cars, threshold = 5) => cars.filter((car) => car.stock <= threshold && car.status !== 'Sold')
