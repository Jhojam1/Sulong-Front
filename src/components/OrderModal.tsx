import Button from './ui/Button';

interface Location {
    id: string;
    name: string;
}

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: string;
    state: string;
    amount: number;
    maxDailyAmount: number;
    ordersToday: number;
    lastUpdatedDate: string;
    image: string;
}

interface OrderModalProps {
    selectedItem: MenuItem;
    locations: Location[];
    orderLocation: string;
    orderObservations: string;
    onLocationChange: (location: string) => void;
    onObservationsChange: (observations: string) => void;
    onClose: () => void;
    onSubmit: () => void;
}

export default function OrderModal({
                                       selectedItem,
                                       locations,
                                       orderLocation,
                                       orderObservations,
                                       onLocationChange,
                                       onObservationsChange,
                                       onClose,
                                       onSubmit
                                   }: OrderModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h2 className="text-xl font-semibold mb-4">Realizar Pedido</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sede</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={orderLocation}
                            onChange={(e) => onLocationChange(e.target.value)}
                            required
                        >
                            <option value="">Seleccionar sede</option>
                            {locations.map(location => (
                                <option key={location.id} value={location.id}>
                                    {location.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Observaciones
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            rows={3}
                            value={orderObservations}
                            onChange={(e) => onObservationsChange(e.target.value)}
                            placeholder="Instrucciones especiales para su pedido..."
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button variant="secondary" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button onClick={onSubmit} disabled={!orderLocation}>
                            Confirmar Pedido
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}