import React, { useRef, useEffect, useState } from 'react';
import { X, Upload } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import {Company, Customer} from "../../types/Customer.ts";
import {companyApi} from "../../services/Company.ts";
import {customerApi} from "../../services/Customer.ts";


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
        numberPhone: '',
        company: undefined
    });
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            if (!isOpen) return;
            setLoading(true);
            setError(null);

            try {
                const response = await companyApi.getAllCompanies();
                if (Array.isArray(response)) {
                    setCompanies(response);
                } else {
                    console.error('La respuesta no es un array:', response);
                    setCompanies([]);
                    setError('Error al cargar las empresas');
                }
            } catch (error) {
                console.error('Error fetching companies:', error);
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Error al cargar las empresas');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, [isOpen]);

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
                    numberPhone: customer.numberPhone || '',
                    company: customer.company
                });

                if (customer.id) {
                    try {
                        const avatarUrl = await customerApi.getAvatar(customer.id);
                        if (avatarUrl) {
                            const response = await fetch(avatarUrl);
                            if (response.ok) {
                                setAvatarPreview(avatarUrl);
                            }
                        }
                    } catch (error) {
                        console.error('Error loading avatar:', error);
                        setAvatarPreview(null);
                    }
                }
            } else {
                resetForm();
            }
        };

        if (isOpen) {
            loadCustomerData();
        }

        return () => {
            cleanupAvatarPreview();
        };
    }, [customer, isOpen]);

    const cleanupAvatarPreview = () => {
        if (avatarPreview && avatarPreview.startsWith('blob:')) {
            URL.revokeObjectURL(avatarPreview);
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            numberIdentification: undefined,
            state: 'Activo',
            mail: '',
            password: '',
            role: undefined,
            numberPhone: '',
            company: undefined
        });
        setAvatarPreview(null);
        setAvatarFile(null);
        setError(null);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!validTypes.includes(file.type)) {
                setError('Solo se permiten archivos de imagen (JPEG, PNG, GIF)');
                return;
            }

            if (file.size > maxSize) {
                setError('El archivo es demasiado grande. El tamaño máximo es 5MB');
                return;
            }

            cleanupAvatarPreview();
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await onSubmit(formData, avatarFile || undefined);
            handleClose();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Error al guardar los cambios');
            }
        }
    };

    const handleClose = () => {
        cleanupAvatarPreview();
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

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

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                            {error}
                        </div>
                    )}

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
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value as 'Activo' | 'Inactivo' })}
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Empresa
                            </label>
                            <select
                                value={formData.company?.id}
                                onChange={(e) => {
                                    const selectedCompany = companies.find(c => c.id === parseInt(e.target.value));
                                    setFormData({ ...formData, company: selectedCompany });
                                }}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={loading}
                            >
                                <option value="">Seleccione una empresa</option>
                                {Array.isArray(companies) && companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                            {loading && (
                                <p className="text-sm text-gray-500 mt-1">Cargando empresas...</p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button
                                variant="secondary"
                                onClick={handleClose}
                                className="w-24"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="w-24"
                                disabled={loading}
                            >
                                {customer ? 'Actualizar' : 'Crear'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}