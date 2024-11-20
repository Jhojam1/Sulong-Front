import React, { useState } from 'react';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (step === 1) {
        // Simular envío de código
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess('Código de verificación enviado a tu correo');
        setStep(2);
      } else if (step === 2) {
        // Simular verificación de código
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStep(3);
      } else {
        // Simular cambio de contraseña
        if (newPassword !== confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess('Contraseña actualizada correctamente');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error: any) {
      setError(error.message || 'Ocurrió un error. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/login" className="flex items-center text-sm text-indigo-600 mb-6 hover:text-indigo-500">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver al inicio de sesión
        </Link>
        
        <div className="flex justify-center">
          <KeyRound className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Recuperar Contraseña
        </h2>
        {error && (
          <p className="mt-2 text-center text-sm text-red-600">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-2 text-center text-sm text-green-600">
            {success}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Ingresa tu correo electrónico y te enviaremos las instrucciones
                </p>
                <Input
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Ingresa el código de verificación que enviamos a tu correo
                </p>
                <Input
                  label="Código de verificación"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </>
            )}

            {step === 3 && (
              <>
                <Input
                  label="Nueva contraseña"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Input
                  label="Confirmar contraseña"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full">
              {step === 1 && 'Enviar instrucciones'}
              {step === 2 && 'Verificar código'}
              {step === 3 && 'Cambiar contraseña'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}