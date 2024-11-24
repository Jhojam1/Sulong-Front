import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { MonthlySalesCount } from '../types/dashboard';

interface SalesChartProps {
    monthlySalesCount: MonthlySalesCount;
}

const monthNames: { [key: string]: string } = {
    '01': 'Ene', '02': 'Feb', '03': 'Mar', '04': 'Abr',
    '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Ago',
    '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dic'
};

export function SalesChart({ monthlySalesCount }: SalesChartProps) {
    const formatMonthlyData = () => {
        const currentYear = new Date().getFullYear();
        const data = [];

        // Create data for all months of the current year
        for (let month = 1; month <= 12; month++) {
            const monthStr = month.toString().padStart(2, '0');
            const key = `${currentYear}-${monthStr}`;
            data.push({
                month: monthNames[monthStr],
                sales: monthlySalesCount[key] || 0
            });
        }

        return data;
    };

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formatMonthlyData()}>
                    <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                        formatter={(value: number) => [`${value} pedidos`, 'Pedidos']}
                        labelFormatter={(label: string) => `Mes: ${label}`}
                    />
                    <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorSales)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}