export interface TopDish {
    name: string;
    quantity: number;
    totalSales: number;
}

export interface MonthlySalesCount {
    [key: string]: number;
}

export interface DashboardStats {
    totalSales: number;
    ordersToday: number;
    totalSalesToday: number;
    newCustomers: number;
    topSellingDishes: TopDish[];
    monthlySalesCount: MonthlySalesCount;
}