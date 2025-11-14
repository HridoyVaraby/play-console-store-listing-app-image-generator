import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            <span className="text-blue-600 dark:text-blue-500">Varabit</span> PlayShot<span className="text-green-600 dark:text-green-500">Gen</span>
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                            Professional screenshot generator for Google Play Store. Create beautiful, compliant screenshots for all Android device types in seconds.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Developed with ❤️ by{' '}
                            <a
                                href="https://varabit.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                            >
                                Varabit
                            </a>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Open for hire/work
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/privacy-policy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms-of-service" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/cookie-policy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Cookie Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/refund-policy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright Bar */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        © {currentYear} <a href="https://varabit.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Varabit</a>. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
