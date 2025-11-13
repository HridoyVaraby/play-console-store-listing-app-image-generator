import React from 'react';
import { GithubIcon } from './Icons';

export const Footer: React.FC = () => {
    return (
        <footer className="py-6 px-4 border-t border-gray-200 dark:border-gray-800 text-center">
            <div className="container mx-auto flex justify-center items-center space-x-4 text-gray-500 dark:text-gray-400">
                 <p className="text-sm">Built with ❤️ by an AI engineer.</p>
                 <a 
                    href="https://github.com/google/generative-ai-docs/tree/main/app-development/web-ai-samples/playshotgen" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    aria-label="View source code on GitHub"
                >
                    <GithubIcon className="w-5 h-5" />
                 </a>
            </div>
        </footer>
    );
};
