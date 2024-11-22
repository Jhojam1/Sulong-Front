import React, { useState, useEffect } from 'react';
import { Users, Search, Edit2, Mail, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import CreateUserModal from '../components/CreateUserModal';
import { userService } from '../services/userService';
import type { User } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (userRole !== 'admin') {
      navigate('/unauthorized');
      return;
    }

    loadUsers();
  }, [isAuthenticated, userRole, navigate]);

  const loadUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleCreateUser = async (userData: any) => {
    try {
      await userService.createUser(userData);
      loadUsers();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const toggleStatus = async (id: number, currentState: string) => {
    try {
      const newState = currentState === 'Activo' ? 'Inactivo' : 'Activo';
      await userService.updateUser(id, { state: newState });
      loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const filteredUsers = users.filter((user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">
            Usuarios
          </h1>
          <div className="flex space-x-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Input
                  placeholder="Buscar usuarios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Users className="h-5 w-5 mr-2" />
              Nuevo Usuario
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
              <div
                  key={user.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={userService.getAvatarUrl(user.id)}
                        alt={user.fullName}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
                        }}
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.fullName}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {user.numberIdentification}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {user.mail}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {user.role}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="secondary" size="sm">
                      <Edit2 className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center"
                        onClick={() => toggleStatus(user.id, user.state)}
                    >
                  <span
                      className={`h-3 w-3 rounded-full ${
                          user.state === 'Activo' ? 'bg-green-500' : 'bg-red-500'
                      } mr-2`}
                  ></span>
                      {user.state}
                    </Button>
                  </div>
                </div>
              </div>
          ))}
        </div>

        <CreateUserModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateUser}
        />
      </div>
  );
}