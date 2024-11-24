// Tipos para las entidades
export interface User {
    id: number;
    fullName: string;
    numberIdentification: number;
    state: string;
    mail: string;
    numberPhone: string;
    role: string;
    company: {
        id: number;
        name: string;
    };
}

export interface Dish {
    id: number;
    name: string;
    description: string;
    price: string;
    state: string;
    amount: number;
    maxDailyAmount: number;
    ordersToday: number;
    lastUpdatedDate: string;
    image: string;
}

export interface Headquarter {
    id: number;
    name: string;
    state: string;
}

export interface Order {
    id: number;
    user: User;
    dish: Dish;
    fechaPedido: string;
    state: string;
    observation: string;
    headquarter: Headquarter;
}

export type OrderStatus = 'Pendiente' | 'Entregado' | 'Cancelado';