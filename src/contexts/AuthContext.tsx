import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: 'admin' | 'user' | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user: any | null;
  getAuthHeaders: () => { Authorization: string } | {};
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:8080/api/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    console.log('=== Inicialización de AuthContext ===');
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        console.log('1. Token encontrado:', token);
        const parsedUser = JSON.parse(storedUser);
        console.log('2. Usuario almacenado:', parsedUser);

        setIsAuthenticated(true);
        setUser(parsedUser);
        setUserRole(parsedUser.role);

        console.log('3. Estado actualizado - Rol:', parsedUser.role);
      } catch (error) {
        console.error('Error al parsear usuario almacenado:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      console.log('No se encontró token o usuario en localStorage');
    }
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    console.log('=== getAuthHeaders ===');
    console.log('Token actual:', token);

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    console.log('Headers generados:', headers);

    return headers;
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('=== Intento de login ===');
      console.log('1. Email:', email);

      const response = await axios.post(`${API_URL}/authenticate`, {
        user: email,
        password: password,
      });

      console.log('2. Respuesta del servidor:', response.data);
      const { token, authorities, id } = response.data;
      console.log('3. ID del usuario recibido:', id);

      const role = authorities.includes('Administrador') ? 'admin' : 'user';

      const userData = {
        email,
        id, // Incluimos el id del usuario
        role,
        token,
      };

      console.log('4. Datos de usuario a almacenar:', userData);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setIsAuthenticated(true);
      setUser(userData);
      setUserRole(role);

      console.log('5. Estado actualizado - Role:', role);
    } catch (error: any) {
      console.error('Error en login:', error);
      if (error.response) {
        throw new Error(error.response.data);
      }
      throw new Error('Error de autenticación');
    }
  };

  const logout = () => {
    console.log('=== Ejecutando logout ===');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);

    console.log('Estado limpiado y localStorage limpiado');
  };

  return (
      <AuthContext.Provider
          value={{
            isAuthenticated,
            userRole,
            login,
            logout,
            user,
            getAuthHeaders,
          }}
      >
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
