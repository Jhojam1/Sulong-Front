import React, { useEffect, useState } from 'react';
import { Check, X, Search } from 'lucide-react';
import { Role, TempUser } from "../types/user";
import { userService } from "../services/userTempService";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import toast from 'react-hot-toast';

export default function PendingUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingUsers, setPendingUsers] = useState<TempUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    loadTempUsers();
  }, []);

  const loadTempUsers = async () => {
    try {
      const users = await userService.getTempUsers();
      setPendingUsers(users);
    } catch (error) {
      toast.error('Error al cargar usuarios pendientes');
      console.error('Error loading temp users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (user: TempUser) => {
    setProcessing(user.id);
    try {
      // Registrar el usuario en el sistema principal
      await userService.registerUser({
        fullName: user.fullName,
        numberIdentification: user.numberIdentification,
        mail: user.mail,
        password: user.password,
        numberPhone: user.numberPhone,
        role: user.role,
        state: 'Activo'
      });

      // Solo eliminar el usuario temporal si el registro fue exitoso
      await userService.deleteTempUser(user.id);

      // Actualizar la lista
      setPendingUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
      toast.success('Usuario registrado exitosamente');
    } catch (error: any) {
      const errorMessage = error.message || 'Error al registrar el usuario';
      toast.error(errorMessage);
      console.error('Error accepting user:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (userId: number) => {
    setProcessing(userId);
    try {
      await userService.deleteTempUser(userId);
      setPendingUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      toast.success('Usuario rechazado');
    } catch (error) {
      toast.error('Error al rechazar el usuario');
      console.error('Error rejecting user:', error);
    } finally {
      setProcessing(null);
    }
  };

  const filteredUsers = pendingUsers.filter(user =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleLabel = (role: Role) => {
    const labels = {
      [Role.Administrador]: 'Administrador',
      [Role.Usuario]: 'Usuario',
      [Role.Cajero]: 'Cajero'
    };
    return labels[role] || role;
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    );
  }

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
                Identificación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No hay usuarios pendientes
                  </td>
                </tr>
            ) : (
                filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.mail}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.numberIdentification}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.numberPhone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getRoleLabel(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="mr-2"
                            onClick={() => handleAccept(user)}
                            disabled={processing === user.id}
                        >
                          {processing === user.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-1" />
                          ) : (
                              <Check className="h-4 w-4 mr-1" />
                          )}
                          Aceptar
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleReject(user.id)}
                            disabled={processing === user.id}
                        >
                          {processing === user.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-1" />
                          ) : (
                              <X className="h-4 w-4 mr-1" />
                          )}
                          Rechazar
                        </Button>
                      </td>
                    </tr>
                ))
            )}
            </tbody>
          </table>
        </div>
      </div>
  );
}