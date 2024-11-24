import React, { useState } from 'react';
import { MapPin, Plus, X, Check, Pencil, Save } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Headquarter, EntityState } from "../../types/Setting";

interface HeadquarterSectionProps {
    headquarters: Headquarter[];
    newHeadquarter: Headquarter;
    onNewHeadquarterChange: (headquarter: Headquarter) => void;
    onSubmit: (e: React.FormEvent) => void;
    onToggleState: (headquarter: Headquarter) => void;
    onUpdateHeadquarter?: (id: number, name: string) => Promise<void>;
}

const defaultHeadquarter: Headquarter = {
    name: '',
    state: 'Activo'
};

export default function HeadquarterSection({
                                               headquarters = [],
                                               newHeadquarter = defaultHeadquarter,
                                               onNewHeadquarterChange,
                                               onSubmit,
                                               onToggleState,
                                               onUpdateHeadquarter,
                                           }: HeadquarterSectionProps) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");

    const handleEdit = (headquarter: Headquarter) => {
        if (headquarter?.id) {
            setEditingId(headquarter.id);
            setEditName(headquarter.name);
        }
    };

    const handleSave = async (id: number) => {
        if (onUpdateHeadquarter && editName.trim()) {
            await onUpdateHeadquarter(id, editName);
            setEditingId(null);
            setEditName("");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onNewHeadquarterChange({
            ...newHeadquarter,
            name: e.target.value
        });
    };

    return (
        <div className="w-full">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
                Gestión de Sedes
            </h2>

            <form onSubmit={onSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Agregar Nueva Sede</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                        type="text"
                        placeholder="Nombre de la sede"
                        value={newHeadquarter?.name || ''}
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
                <h3 className="text-sm font-medium text-gray-900">Sedes Registradas</h3>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {headquarters.map((headquarter) => (
                        <div
                            key={headquarter.id}
                            className={`p-4 rounded-lg border transition-all duration-200 ${
                                headquarter.state === 'Activo'
                                    ? 'bg-white border-gray-200 hover:shadow-md'
                                    : 'bg-gray-50 border-gray-300'
                            }`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                    {editingId === headquarter.id ? (
                                        <Input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="flex-1"
                                            autoFocus
                                        />
                                    ) : (
                                        <span className="font-medium truncate">{headquarter.name}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {editingId === headquarter.id ? (
                                        <Button
                                            onClick={() => headquarter.id && handleSave(headquarter.id)}
                                            variant="success"
                                            size="sm"
                                            className="px-2"
                                        >
                                            <Save className="h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => handleEdit(headquarter)}
                                            variant="secondary"
                                            size="sm"
                                            className="px-2"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => onToggleState(headquarter)}
                                        variant={headquarter.state === 'Activo' ? 'danger' : 'success'}
                                        size="sm"
                                        className="px-2"
                                        title={headquarter.state === 'Activo' ? 'Desactivar' : 'Activar'}
                                    >
                                        {headquarter.state === 'Activo' ? (
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