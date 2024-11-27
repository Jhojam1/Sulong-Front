import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      // La redirección se maneja en App.tsx basada en el rol del usuario
    } catch (error: any) {
      setError(error.message || 'Credenciales inválidas. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center">
          {/* Imagen del logo */}
          <img
            src="Images/Sulong_icon.svg"  
            alt="Icono SULONG"
            className="h-18 w-15 object-contain"
          />
        </div>

        {/*Formulario*/}
        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
              Iniciar Sesión
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Campo de correo electrónico */}
              <Input
                label="Correo electrónico"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              {/* Campo de contraseña */}
              <Input
                label="Contraseña"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />

              {/* Recordarme y link de contraseña olvidada */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                    Recordarme
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/reset-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              {/* Botón de envío */}
              <Button type="submit" isLoading={isLoading} className="w-full">
                Iniciar Sesión
              </Button>

              {/* Enlaces adicionales */}
              <div className="mt-4 text-center">
                <Link to="/register" className="text-sm text-indigo-600 hover:text-indigo-500">
                  ¿No tienes una cuenta? Regístrate
                </Link>
              </div>

            

              {/* Mostrar errores si existen */}
              {error && (
                <div className="mt-2 text-center text-sm text-red-600">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
