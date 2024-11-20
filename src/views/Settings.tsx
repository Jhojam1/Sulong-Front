import React, { useState } from 'react';
import { Save } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Settings() {
  const [settings, setSettings] = useState({
    orderEndTime: '20:00',
    // Agregar más configuraciones según sea necesario
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement settings update logic
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Configuración del Sistema
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora límite para realizar pedidos
            </label>
            <Input
              type="time"
              value={settings.orderEndTime}
              onChange={(e) => setSettings({ ...settings, orderEndTime: e.target.value })}
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Los usuarios no podrán realizar pedidos después de esta hora
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              <Save className="h-5 w-5 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}