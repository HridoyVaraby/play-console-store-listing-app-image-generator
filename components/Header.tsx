import React from 'react';

interface HeaderProps {
    theme?: 'light' | 'dark';
}

export const Header: React.FC<HeaderProps> = () => {
    return (
        <header className="app-header sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg z-20 border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-4">
                        <div className="text-center">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                                <span className="text-blue-600 dark:text-blue-500">Play</span>Shot<span className="text-green-600 dark:text-green-500">Gen</span>
                            </h1>
                            <p className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
                                Professional screenshot generator for Google Play Store
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};