import { Edit2, Mail, Phone, MapPin } from 'lucide-react';
import {Customer} from "../../types/Customer.ts";
import {customerApi} from "../../services/Customer.ts";
import Button from "../ui/Button.tsx";

interface CustomerCardProps {
    customer: Customer;
    onStatusToggle: (id: number, currentState: string) => Promise<void>;
}

export default function CustomerCard({ customer, onStatusToggle }: CustomerCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
                <div className="flex items-center">
                    <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={customerApi.getAvatarUrl(customer.id)}
                        alt={customer.fullName}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
                        }}
                    />
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {customer.fullName}
                        </h3>
                        <p className="text-sm text-gray-500">Cliente #{customer.numberIdentification}</p>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {customer.mail}
                    </div>
                    {customer.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {customer.phone}
                        </div>
                    )}
                    {customer.address && (
                        <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {customer.address}
                        </div>
                    )}
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
                        onClick={() => onStatusToggle(customer.id, customer.state)}
                    >
            <span
                className={`h-3 w-3 rounded-full ${
                    customer.state === 'Activo' ? 'bg-green-500' : 'bg-red-500'
                } mr-2`}
            ></span>
                        {customer.state}
                    </Button>
                </div>
            </div>
        </div>
    );
}