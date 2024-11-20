import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <LogIn className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>
        {error && (
          <div className="mt-2 text-center text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Correo electrónico"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <Input
              label="Contraseña"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

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

            <Button type="submit" isLoading={isLoading} className="w-full">
              Iniciar Sesión
            </Button>

            <div className="mt-4 text-center">
              <Link to="/register" className="text-sm text-indigo-600 hover:text-indigo-500">
                ¿No tienes una cuenta? Regístrate
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link to="/activate" className="text-sm text-indigo-600 hover:text-indigo-500">
                ¿Necesitas activar tu cuenta?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}