import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Clock } from 'lucide-react';

interface GeneralSettingsProps {
    orderEndTime: string;
    onTimeChange: (time: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function GeneralSettings({
                                            orderEndTime,
                                            onTimeChange,
                                            onSubmit
                                        }: GeneralSettingsProps) {
    return (
        <div className="w-full">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
                Configuración General
            </h2>

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">
                        Horario de Pedidos
                    </h3>
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 max-w-xs">
                            <label htmlFor="orderEndTime" className="block text-sm font-medium text-gray-700 mb-1">
                                Hora de cierre
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    type="time"
                                    id="orderEndTime"
                                    value={orderEndTime}
                                    onChange={(e) => onTimeChange(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" variant="primary">
                        Guardar Cambios
                    </Button>
                </div>
            </form>
        </div>
    );
}