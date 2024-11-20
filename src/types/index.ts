export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'user';
  status: 'pending' | 'active' | 'inactive';
  avatar?: string;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}