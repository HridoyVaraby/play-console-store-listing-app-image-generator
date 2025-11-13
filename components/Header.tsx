
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center py-10 px-4 border-b border-gray-800">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                <span className="text-blue-500">Play</span>Shot<span className="text-green-500">Gen</span>
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                Instantly generate Google Play Store compliant screenshots for all device types.
            </p>
        </header>
    );
};
