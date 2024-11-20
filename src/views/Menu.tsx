import React, { useState } from 'react';
import { PlusCircle, Search, ShoppingCart, Edit2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { MenuItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SAMPLE_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Mote de queso',
    description: 'Mote de queso, chicharron, arroz, aguacate',
    price: 12,
    category: 'Almuerzo',
    image: 'https://lamatriarca.com/wp-content/uploads/2022/12/mote-de-queso.webp',
    available: true,
  },
  {
    id: '2',
    name: 'Posta Cartagenera',
    description: 'Carne, arroz de coco, patacon',
    price: 14,
    category: 'Almuerzo',
    image: 'https://cloudfront-us-east-1.images.arcpublishing.com/elespectador/QSBBDWHRRFAGHI5VLSLY4NDTXY.jpg',
    available: true,
  },
  {
    id: '3',
    name: 'Bandeja Paisa',
    description: 'Arroz, huevo, aguacate, chicharron, frijoles, chorizo',
    price: 18,
    category: 'Almuerzo',
    image: 'https://cdn.colombia.com/gastronomia/2011/08/02/bandeja-paisa-1616-1.gif',
    available: true,
  },
  {
    id: '4',
    name: 'Asado de cerdo',
    description: 'Asado, ensalada',
    price: 12,
    category: 'Almuerzo',
    image: 'https://media-cdn.tripadvisor.com/media/photo-s/13/01/61/00/cerdo-asado-pollo-a-la.jpg',
    available: true,
  },
  {
    id: '5',
    name: 'Arepas fritas con huevo',
    description: 'Arepa de maiz rellena de huevo',
    price: 7,
    category: 'Desayuno',
    image: 'https://cdn.colombia.com/gastronomia/2011/08/05/arepa-de-huevo-1572-1.gif',
    available: true,
  },
  {
    id: '6',
    name: 'Papitas Lays',
    description: 'Papitas fritas',
    price: 2,
    category: 'Snack',
    image: 'https://www.lays.com/sites/lays.com/files/2020-11/sour-cream.jpg',
    available: true,
  },
];

const LOCATIONS = [
  { id: '1', name: 'Sede Concepcion' },
  { id: '2', name: 'Sede Zaragocilla' },
  { id: '3', name: 'Sede Pie de la popa' },
];

export default function Menu() {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [orderLocation, setOrderLocation] = useState('');
  const [orderObservations, setOrderObservations] = useState('');

  const handleOrder = (item: MenuItem) => {
    setSelectedItem(item);
    setShowOrderModal(true);
  };

  const handleSubmitOrder = () => {
    setShowOrderModal(false);
    setSelectedItem(null);
    setOrderLocation('');
    setOrderObservations('');
  };

  const handleEdit = (itemId: string) => {
    navigate(`/menu/edit/${itemId}`);
  };

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">
            Menú del Día
          </h1>
          <div className="flex space-x-4 w-full sm:w-auto">
            {userRole === 'admin' && (
                <>
                  <div className="relative flex-grow sm:flex-grow-0">
                    <Input placeholder="Buscar en el menú..." className="pl-10" />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <Button onClick={() => navigate('/menu/new')}>
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Nuevo Plato
                  </Button>
                </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_MENU_ITEMS.map((item) => (
              <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl hover:translate-y-2"
              >
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <span className="text-lg font-bold text-indigo-600">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="mt-2 text-gray-600 text-sm">{item.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                <span
                    className={`px-2 py-1 text-xs rounded-full ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {item.available ? 'Disponible' : 'Agotado'}
                </span>
                    {userRole === 'admin' ? (
                        <Button variant="secondary" size="sm" onClick={() => handleEdit(item.id)}>
                          <Edit2 className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                    ) : (
                        item.available && (
                            <Button onClick={() => handleOrder(item)}>
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Ordenar
                            </Button>
                        )
                    )}
                  </div>
                </div>
              </div>
          ))}
        </div>

        {showOrderModal && selectedItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h2 className="text-xl font-semibold mb-4">Realizar Pedido</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sede</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={orderLocation}
                        onChange={(e) => setOrderLocation(e.target.value)}
                        required
                    >
                      <option value="">Seleccionar sede</option>
                      {LOCATIONS.map(location => (
                          <option key={location.id} value={location.id}>
                            {location.name}
                          </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                        value={orderObservations}
                        onChange={(e) => setOrderObservations(e.target.value)}
                        placeholder="Instrucciones especiales para su pedido..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSubmitOrder} disabled={!orderLocation}>
                      Confirmar Pedido
                    </Button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}