import React, { useState, useEffect } from 'react';
import { Camera, Save } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

import { toast } from 'react-hot-toast';
import {customerApi} from "../services/Customer.ts";
import {UpdateUserDto, User} from "../types/user.ts";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<UpdateUserDto>({
    fullName: '',
    mail: '',
    numberPhone: '',
    currentPassword: '',
    newPassword: '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await customerApi.getAllCustomers();
      if (userData && userData.length > 0) {
        const currentUser = userData[0]; // Assuming this returns the current user's data
        setUser(currentUser);
        setFormData({
          fullName: currentUser.fullName,
          mail: currentUser.mail,
          numberPhone: currentUser.numberPhone,
          currentPassword: '',
          newPassword: '',
        });

        // Load avatar
        try {
          const avatarUrl = await customerApi.getAvatar(currentUser.id);
          setAvatarPreview(avatarUrl);
        } catch (error) {
          // Use default avatar if no custom avatar exists
          setAvatarPreview('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');
        }
      }
    } catch (error) {
      toast.error('Error al cargar los datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      if (file.size > 1024 * 1024) { // 1MB limit
        toast.error('La imagen debe ser menor a 1MB');
        return;
      }

      try {
        await customerApi.uploadAvatar(user.id, file);
        const newAvatarUrl = await customerApi.getAvatar(user.id);
        setAvatarPreview(newAvatarUrl);
        toast.success('Avatar actualizado correctamente');
      } catch (error) {
        toast.error('Error al actualizar el avatar');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const updateData: UpdateUserDto = {
        fullName: formData.fullName,
        mail: formData.mail,
        numberPhone: formData.numberPhone,
      };

      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await customerApi.saveCustomer({
        id: user.id,
        ...updateData,
      });

      toast.success('Perfil actualizado correctamente');

      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
      }));
    } catch (error) {
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>;
  }

  return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Mi Perfil
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                    src={avatarPreview}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover"
                />
                <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 cursor-pointer hover:bg-indigo-700"
                >
                  <Camera className="h-4 w-4 text-white" />
                  <input
                      id="avatar-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Foto de Perfil</h3>
                <p className="text-sm text-gray-500">
                  JPG o PNG. Máximo 1MB
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                  label="Nombre Completo"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
              />

              <Input
                  label="Email"
                  type="email"
                  value={formData.mail}
                  onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
                  required
              />

              <Input
                  label="Teléfono"
                  value={formData.numberPhone}
                  onChange={(e) => setFormData({ ...formData, numberPhone: e.target.value })}
                  required
              />

              {/* Password change section */}
              <Input
                  label="Contraseña Actual"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  placeholder="Dejar en blanco si no desea cambiar"
              />

              {formData.currentPassword && (
                  <Input
                      label="Nueva Contraseña"
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      required={!!formData.currentPassword}
                  />
              )}
            </div>

            <div className="flex justify-end">
              <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2"
              >
                {isSubmitting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                ) : (
                    <Save className="h-5 w-5" />
                )}
                <span>Guardar Cambios</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
  );
}