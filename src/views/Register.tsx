import React, { useState, useEffect } from 'react';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Company, Role } from '../types/UserRegister';
import { companyApi } from '../services/Company';
import { userApi } from '../services/UserRegister';

export default function Register() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    numberIdentification: '',
    mail: '',
    password: '',
    confirmPassword: '',
    numberPhone: '',
    companyId: '',
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const companiesData = await companyApi.getAllCompanies();
      setCompanies(companiesData);
    } catch (error) {
      setError('Error al cargar las empresas');
      console.error('Error loading companies:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        fullName: formData.fullName,
        numberIdentification: parseInt(formData.numberIdentification),
        state: 'INACTIVE',
        mail: formData.mail,
        password: formData.password,
        numberPhone: formData.numberPhone,
        role: Role.Usuario,
        company: {
          id: parseInt(formData.companyId)
        }
      };

      console.log('Datos a enviar:', userData);
      await userApi.registerUser(userData);
      navigate('/login');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al registrar usuario');
    } finally {
      setLoading(false);
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
            <UserPlus className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear una cuenta
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                  label="Nombre completo"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
              />

              <Input
                  label="Número de identificación"
                  type="number"
                  value={formData.numberIdentification}
                  onChange={(e) => setFormData({ ...formData, numberIdentification: e.target.value })}
                  required
              />

              <Input
                  label="Correo electrónico"
                  type="email"
                  value={formData.mail}
                  onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
                  required
              />

              <Input
                  label="Teléfono"
                  type="tel"
                  value={formData.numberPhone}
                  onChange={(e) => setFormData({ ...formData, numberPhone: e.target.value })}
                  required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Empresa
                </label>
                <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={formData.companyId}
                    onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                    required
                >
                  <option value="">Seleccione una empresa</option>
                  {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                  ))}
                </select>
              </div>

              <Input
                  label="Contraseña"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
              />

              <Input
                  label="Confirmar contraseña"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
              />

              <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
              >
                {loading ? 'Registrando...' : 'Registrarse'}
              </Button>

              <p className="text-center text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Inicia sesión
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
  );
}