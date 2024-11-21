import React from 'react';
import Input from './ui/Input';

interface DishFormFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
    isTextArea?: boolean;
    isSelect?: boolean;
    options?: { value: string; label: string }[];
    min?: string;
}

export default function DishFormField({
                                          label,
                                          name,
                                          type = 'text',
                                          value,
                                          onChange,
                                          placeholder,
                                          required = true,
                                          className = '',
                                          isTextArea = false,
                                          isSelect = false,
                                          options = [],
                                          min,
                                      }: DishFormFieldProps) {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            {isTextArea ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder={placeholder}
                />
            ) : isSelect ? (
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <Input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                    min={min}
                />
            )}
        </div>
    );
}