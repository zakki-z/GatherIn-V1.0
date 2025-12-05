import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
    return (
        <div className="flex flex-col space-y-1 w-full">
            {label && (
                <label htmlFor={props.id || props.name} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none transition duration-150 
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
          ${className || ''}`}
                {...props}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};
