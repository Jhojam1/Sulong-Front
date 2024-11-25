import React, { useState } from 'react';
import { Building2, Plus, X, Check, Pencil, Save } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import {Company} from "../../types/Setting.ts";

interface CompanySectionProps {
    companies: Company[];
    newCompany: Company;
    onNewCompanyChange: (company: Company) => void;
    onSubmit: (e: React.FormEvent) => void;
    onToggleState: (company: Company) => void;
    onUpdateCompany?: (id: number, name: string) => Promise<void>;
}

const defaultCompany: Company = {
    name: '',
    state: 'Activo'
};

export default function CompanySection({
                                           companies = [],
                                           newCompany = defaultCompany,
                                           onNewCompanyChange,
                                           onSubmit,
                                           onToggleState,
                                           onUpdateCompany,
                                       }: CompanySectionProps) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");

    const handleEdit = (company: Company) => {
        if (company.id) {
            setEditingId(company.id);
            setEditName(company.name);
        }
    };

    const handleSave = async (id: number) => {
        if (onUpdateCompany && editName.trim()) {
            await onUpdateCompany(id, editName);
            setEditingId(null);
            setEditName("");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onNewCompanyChange({
            ...newCompany,
            name: e.target.value
        });
    };

    return (
        <div className="w-full">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
                Gestión de Empresas
            </h2>

            <form onSubmit={onSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Agregar Nueva Empresa</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                        type="text"
                        placeholder="Nombre de la empresa"
                        value={newCompany?.name || ''}
                        onChange={handleChange}
                        required
                        className="flex-1"
                    />
                    <Button type="submit" variant="primary" className="whitespace-nowrap">
                        <Plus className="h-5 w-5 mr-2" />
                        Agregar
                    </Button>
                </div>
            </form>

            <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Empresas Registradas</h3>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {companies.map((company) => (
                        <div
                            key={company.id}
                            className={`p-4 rounded-lg border transition-all duration-200 ${
                                company.state === 'Activo'
                                    ? 'bg-white border-gray-200 hover:shadow-md'
                                    : 'bg-gray-50 border-gray-300'
                            }`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <Building2 className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                    {editingId === company.id ? (
                                        <Input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="flex-1"
                                            autoFocus
                                        />
                                    ) : (
                                        <span className="font-medium truncate">{company.name}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {editingId === company.id ? (
                                        <Button
                                            onClick={() => company.id && handleSave(company.id)}
                                            variant="success"
                                            size="sm"
                                            className="px-2"
                                        >
                                            <Save className="h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => handleEdit(company)}
                                            variant="secondary"
                                            size="sm"
                                            className="px-2"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => onToggleState(company)}
                                        variant={company.state === 'Activo' ? 'danger' : 'success'}
                                        size="sm"
                                        className="px-2"
                                        title={company.state === 'Activo' ? 'Desactivar' : 'Activar'}
                                    >
                                        {company.state === 'Activo' ? (
                                            <X className="h-4 w-4" />
                                        ) : (
                                            <Check className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}