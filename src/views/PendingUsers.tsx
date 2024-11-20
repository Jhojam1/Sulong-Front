import React from 'react';
import { Check, X, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  registrationDate: Date;
}

const SAMPLE_PENDING_USERS: PendingUser[] = [
  {
    id: 'P001',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    registrationDate: new Date('2024-03-10')
  },
  {
    id: 'P002',
    name: 'María García',
    email: 'maria@example.com',
    registrationDate: new Date('2024-03-09')
  }
];

export default function PendingUsers() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleAccept = (userId: string) => {
    // Implementar lógica de aceptación
    console.log('Aceptar usuario:', userId);
  };

  const handleReject = (userId: string) => {
    // Implementar lógica de rechazo
    console.log('Rechazar usuario:', userId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">
          Usuarios Pendientes de Aprobación
        </h1>
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Buscar usuarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Registro
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {SAMPLE_PENDING_USERS.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.registrationDate.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleAccept(user.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Aceptar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleReject(user.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Rechazar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}