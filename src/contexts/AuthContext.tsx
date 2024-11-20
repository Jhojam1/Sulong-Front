import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: 'admin' | 'user' | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:8080/api/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setUser(parsedUser);
        setUserRole(parsedUser.role);
        
        // Restaurar el header de autorización
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        // Si hay un error al parsear, limpiar el localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/authenticate`, {
        user: email,
        password: password
      });

      const { token, authorities } = response.data;
      
      // Determinar el rol basado en las authorities
      const role = authorities.includes('Administrador') ? 'admin' : 'user';
      
      // Crear objeto de usuario
      const userData = {
        email,
        role,
        token
      };

      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Actualizar estado
      setIsAuthenticated(true);
      setUser(userData);
      setUserRole(role);

      // Configurar el token para futuras peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data);
      }
      throw new Error('Error de autenticación');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}