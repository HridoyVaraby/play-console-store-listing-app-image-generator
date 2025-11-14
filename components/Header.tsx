import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
    ];

    return (
        <header className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg z-50 border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="text-center">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                                <span className="text-blue-600 dark:text-blue-500">Varabit</span> PlayShot<span className="text-green-600 dark:text-green-500">Gen</span>
                            </h1>
                            <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
                                by Varabit
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-medium transition-colors ${
                                    isActive(link.path)
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            to="/dashboard"
                            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full transition-colors shadow-md"
                        >
                            Get Started
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block py-2 px-4 text-sm font-medium transition-colors ${
                                    isActive(link.path)
                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            to="/dashboard"
                            onClick={() => setIsMenuOpen(false)}
                            className="block mt-4 mx-4 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-center font-medium rounded-full transition-colors"
                        >
                            Get Started
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
};