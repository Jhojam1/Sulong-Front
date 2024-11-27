import React, { useEffect, useState } from 'react';
import { Check, X, Search, ChevronDown } from 'lucide-react';
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
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

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
      const userToRegister = {
        id: user.id,
        fullName: user.fullName,
        numberIdentification: Number(user.numberIdentification), // Convertir a Long
        state: 'Activo',
        mail: user.mail,
        password: user.password,
        role: user.role,
        numberPhone: user.numberPhone,
        company: user.company || null // Asegurarse de que company esté presente
      };

      console.log('Objeto enviado a registerUser:', userToRegister);

      await userService.registerUser(userToRegister);
      await userService.deleteTempUser(user.id);
      setPendingUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
      toast.success('Usuario registrado exitosamente');
    } catch (error: any) {
      const errorMessage = error.message || 'Error al registrar el usuario';
      toast.error(errorMessage);
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
    } finally {
      setProcessing(null);
    }
  };

  const filteredUsers = pendingUsers.filter(user =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleLabel = (role: string) => {
    if (!role) return 'No especificado';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  const toggleRow = (userId: number) => {
    setExpandedRow(expandedRow === userId ? null : userId);
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    );
  }

  return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Usuarios Pendientes
          </h1>
          <div className="relative w-full sm:w-64">
            <Input
                placeholder="Buscar usuarios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identificación</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                    No hay usuarios pendientes
                  </td>
                </tr>
            ) : (
                filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.mail}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.numberIdentification}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.numberPhone}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getRoleLabel(user.role)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleAccept(user)}
                              disabled={processing === user.id}
                          >
                            {processing === user.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
                            ) : (
                                <Check className="h-4 w-4" />
                            )}
                            <span className="ml-1 hidden sm:inline">Aceptar</span>
                          </Button>
                          <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleReject(user.id)}
                              disabled={processing === user.id}
                          >
                            {processing === user.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
                            ) : (
                                <X className="h-4 w-4" />
                            )}
                            <span className="ml-1 hidden sm:inline">Rechazar</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                ))
            )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredUsers.length === 0 ? (
              <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
                No hay usuarios pendientes
              </div>
          ) : (
              filteredUsers.map((user) => (
                  <div key={user.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div
                        className="p-4 cursor-pointer flex justify-between items-center"
                        onClick={() => toggleRow(user.id)}
                    >
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{user.fullName}</h3>
                        <p className="text-sm text-gray-500">{user.mail}</p>
                      </div>
                      <ChevronDown
                          className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${
                              expandedRow === user.id ? 'rotate-180' : ''
                          }`}
                      />
                    </div>

                    <div className={`px-4 pb-4 ${expandedRow === user.id ? 'block' : 'hidden'}`}>
                      <div className="space-y-2 mb-4">
                        <div>
                          <label className="text-xs text-gray-500">Identificación</label>
                          <p className="text-sm text-gray-900">{user.numberIdentification}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Teléfono</label>
                          <p className="text-sm text-gray-900">{user.numberPhone}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Rol</label>
                          <p className="text-sm text-gray-900">{getRoleLabel(user.role)}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleAccept(user)}
                            disabled={processing === user.id}
                        >
                          {processing === user.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2" />
                          ) : (
                              <Check className="h-4 w-4 mr-2" />
                          )}
                          Aceptar
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleReject(user.id)}
                            disabled={processing === user.id}
                        >
                          {processing === user.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2" />
                          ) : (
                              <X className="h-4 w-4 mr-2" />
                          )}
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  </div>
              ))
          )}
        </div>
      </div>
  );
}