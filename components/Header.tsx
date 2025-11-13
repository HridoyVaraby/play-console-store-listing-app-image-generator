import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
    return (
        <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10 border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <div className="text-center">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                            <span className="text-blue-600 dark:text-blue-500">Play</span>Shot<span className="text-green-600 dark:text-green-500">Gen</span>
                        </h1>
                        <p className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
                            Generate Play Store screenshots instantly.
                        </p>
                    </div>
                    <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
                </div>
            </div>
        </header>
    );
};