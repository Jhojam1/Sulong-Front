import React, { useRef, useEffect, useState } from 'react';
import { X, Upload } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Customer } from '../../types/Customer';
import { customerApi } from '../../services/Customer';

interface CustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Customer>, avatarFile?: File) => void;
    customer?: Customer;
    title: string;
}

export default function CustomerModal({ isOpen, onClose, onSubmit, customer, title }: CustomerModalProps) {
    const [formData, setFormData] = React.useState<Partial<Customer>>({
        fullName: '',
        numberIdentification: undefined,
        state: 'Activo',
        mail: '',
        password: '',
        role: undefined,
        numberPhone: ''
    });

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadCustomerData = async () => {
            if (customer) {
                setFormData({
                    fullName: customer.fullName,
                    numberIdentification: customer.numberIdentification,
                    state: customer.state,
                    mail: customer.mail,
                    password: customer.password,
                    role: customer.role,
                    numberPhone: customer.numberPhone || ''
                });

                try {
                    const avatarUrl = await customerApi.getAvatar(customer.id);
                    setAvatarPreview(avatarUrl);
                } catch (error) {
                    console.error('Error loading avatar:', error);
                    setAvatarPreview(null);
                }
            } else {
                setFormData({
                    fullName: '',
                    numberIdentification: undefined,
                    state: 'Activo',
                    mail: '',
                    password: '',
                    role: undefined,
                    numberPhone: ''
                });
                setAvatarPreview(null);
                setAvatarFile(null);
            }
        };

        if (isOpen) {
            loadCustomerData();
        }

        return () => {
            // Cleanup preview URL when modal closes
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [customer, isOpen]);

    if (!isOpen) return null;

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            // Revoke previous preview URL if exists
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
            const newPreviewUrl = URL.createObjectURL(file);
            setAvatarPreview(newPreviewUrl);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData, avatarFile || undefined);
        onClose();
    };

    const handleClose = () => {
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose}></div>
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all">
                    <div className="absolute right-4 top-4">
                        <button onClick={handleClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center">
                            <div className="relative">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                                        <Upload className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 border border-gray-200"
                                >
                                    <Upload className="h-4 w-4 text-gray-600" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre Completo
                                </label>
                                <Input
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Número de Identificación
                                </label>
                                <Input
                                    type="number"
                                    value={formData.numberIdentification || ''}
                                    onChange={(e) => setFormData({ ...formData, numberIdentification: parseInt(e.target.value) })}
                                    className="w-full"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Correo Electrónico
                                </label>
                                <Input
                                    type="email"
                                    value={formData.mail}
                                    onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
                                    className="w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Teléfono
                                </label>
                                <Input
                                    type="tel"
                                    value={formData.numberPhone}
                                    onChange={(e) => setFormData({ ...formData, numberPhone: e.target.value })}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {!customer && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contraseña
                                </label>
                                <Input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full"
                                    required
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Estado
                                </label>
                                <select
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rol
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Seleccione un rol</option>
                                    <option value="Administrador">Administrador</option>
                                    <option value="Usuario">Usuario</option>
                                    <option value="Cajero">Cajero</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button variant="secondary" onClick={handleClose} className="w-24">
                                Cancelar
                            </Button>
                            <Button type="submit" className="w-24">
                                {customer ? 'Actualizar' : 'Crear'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}