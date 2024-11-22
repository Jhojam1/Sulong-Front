import { Edit2, Mail, Phone, User } from 'lucide-react';
import { Customer } from "../../types/Customer.ts";
import { customerApi } from "../../services/Customer.ts";
import Button from "../ui/Button.tsx";
import { useState, useEffect } from 'react';

interface CustomerCardProps {
    customer: Customer;
    onStatusToggle: (id: number, currentState: string) => Promise<void>;
    onEdit: () => void;
}

export default function CustomerCard({ customer, onStatusToggle, onEdit }: CustomerCardProps) {
    const [imageError, setImageError] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string>('');

    useEffect(() => {
        const loadImage = async () => {
            try {
                const objectUrl = await customerApi.getAvatar(customer.id);
                setAvatarUrl(objectUrl);
                setImageError(false);
            } catch (error) {
                console.error('Error loading avatar:', error);
                setImageError(true);
            }
        };

        if (customer.id) {
            loadImage();
        }

        // Cleanup function to revoke object URL
        return () => {
            if (avatarUrl) {
                URL.revokeObjectURL(avatarUrl);
            }
        };
    }, [customer.id]);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
                <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-gray-100 flex items-center justify-center bg-gray-50">
                        {!imageError && avatarUrl ? (
                            <img
                                className="h-full w-full object-cover"
                                src={avatarUrl}
                                alt={customer.fullName}
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <User className="h-6 w-6 text-gray-400" />
                        )}
                    </div>
                    <div className="ml-4 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {customer.fullName}
                        </h3>
                        <p className="text-sm text-gray-500">Cliente #{customer.numberIdentification}</p>
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate">{customer.mail}</span>
                    </div>
                    {customer.numberPhone && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{customer.numberPhone}</span>
                        </div>
                    )}
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="secondary" size="sm" onClick={onEdit} className="hover:bg-gray-100">
                        <Edit2 className="h-4 w-4 mr-1" />
                        Editar
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center hover:bg-gray-100"
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