import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// El token JWT ya está siendo manejado globalmente por AuthContext
// a través de axios.defaults.headers.common['Authorization']

export const getDashboardStats = async () => {
    try {
        const [orders, users, dishes] = await Promise.all([
            axios.get(`${API_BASE_URL}/Order/getOrder`),
            axios.get(`${API_BASE_URL}/User/getUser`),
            axios.get(`${API_BASE_URL}/Dish/getDish`)
        ]);

        const today = new Date().toISOString().split('T')[0];

        // Calcular estadísticas
        const totalSales = orders.data.reduce((acc: number, order: any) => {
            if (order.state === 'Entregado') {
                const price = parseFloat(order.dish.price.replace('$', ''));
                return acc + (isNaN(price) ? 0 : price);
            }
            return acc;
        }, 0);

        const ordersToday = orders.data.filter((order: any) =>
            order.fechaPedido?.split('T')[0] === today
        ).length;

        const newCustomers = users.data.filter((user: any) =>
            user.state === 'Activo'
        ).length;

        const completedOrders = orders.data.filter((order: any) =>
            order.state === 'Entregado'
        );

        const averageTicket = completedOrders.length > 0
            ? totalSales / completedOrders.length
            : 0;

        // Top productos vendidos
        const productSales = orders.data.reduce((acc: any, order: any) => {
            if (order.state === 'Entregado' && order.dish) {
                const dishId = order.dish.id;
                if (!acc[dishId]) {
                    acc[dishId] = {
                        name: order.dish.name,
                        count: 0,
                        price: order.dish.price,
                        total: 0
                    };
                }
                acc[dishId].count++;
                const price = parseFloat(order.dish.price.replace('$', ''));
                acc[dishId].total += isNaN(price) ? 0 : price;
            }
            return acc;
        }, {});

        const topProducts = Object.values(productSales)
            .sort((a: any, b: any) => b.count - a.count)
            .slice(0, 5)
            .map((product: any) => ({
                ...product,
                averagePrice: (product.total / product.count).toFixed(2)
            }));

        return {
            stats: {
                totalSales: totalSales.toFixed(2),
                ordersToday,
                newCustomers,
                averageTicket: averageTicket.toFixed(2)
            },
            topProducts,
            rawData: {
                orders: orders.data,
                users: users.data,
                dishes: dishes.data
            }
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
};