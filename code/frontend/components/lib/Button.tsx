import React, { ButtonHTMLAttributes } from 'react';
import Spinner from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  variant = 'primary',
                                                  isLoading = false,
                                                  disabled,
                                                  className,
                                                  ...props
                                              }) => {
    const baseClasses = 'px-4 py-2 font-semibold rounded-lg transition duration-200 flex items-center justify-center';

    let variantClasses = '';
    switch (variant) {
        case 'primary':
            variantClasses = 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300';
            break;
        case 'secondary':
            variantClasses = 'bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:bg-gray-100';
            break;
        case 'danger':
            variantClasses = 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300';
            break;
    }

    return (
        <button
            className={`${baseClasses} ${variantClasses} ${className || ''}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <Spinner /> : children}
        </button>
    );
};
