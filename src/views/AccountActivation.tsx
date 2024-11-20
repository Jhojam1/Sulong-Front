import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function AccountActivation() {
  const [isLoading, setIsLoading] = useState(false);
  const [activationCode, setActivationCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Implement activation logic here
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <KeyRound className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Activar Cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ingresa el código de activación que recibiste en tu correo electrónico
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Código de Activación"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value)}
              placeholder="Ingresa el código de 6 dígitos"
              required
            />

            <Button type="submit" isLoading={isLoading} className="w-full">
              Activar Cuenta
            </Button>

            <div className="text-center">
              <a href="/login" className="text-sm text-indigo-600 hover:text-indigo-500">
                Volver al inicio de sesión
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}