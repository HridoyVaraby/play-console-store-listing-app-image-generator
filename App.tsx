import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { UploadedFile, ProcessedImage, DeviceConfig } from './types';
import { DEVICE_CONFIGS } from './constants';
import { processImage } from './services/imageProcessor';
import { generateZip } from './services/zipService';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DownloadIcon, LoaderIcon } from './components/Icons';
import { useTheme } from './hooks/useTheme';

const App: React.FC = () => {
    const [portraitFiles, setPortraitFiles] = useState<UploadedFile[]>([]);
    const [landscapeFiles, setLandscapeFiles] = useState<UploadedFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [processedFileCount, setProcessedFileCount] = useState(0);
    const [totalFileCount, setTotalFileCount] = useState(0);
    const [theme, toggleTheme] = useTheme();

    const handleGenerateClick = useCallback(async () => {
        if (portraitFiles.length === 0 && landscapeFiles.length === 0) {
            setError("Please upload at least one image.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setDownloadUrl(null);
        setProcessedFileCount(0);
        
        const totalPortraitTargets = portraitFiles.length * 2; // phone, tablet
        const totalLandscapeTargets = landscapeFiles.length * 2; // 10inch, chromebook
        setTotalFileCount(totalPortraitTargets + totalLandscapeTargets);

        const processingPromises: Promise<ProcessedImage>[] = [];

        const createProcessPromise = (file: UploadedFile, config: DeviceConfig) => {
             return processImage(file.file, config).then(blob => {
                setProcessedFileCount(prev => prev + 1);
                const originalFileName = file.file.name;
                const fileNameWithoutExtension = originalFileName.substring(0, originalFileName.lastIndexOf('.')) || originalFileName;

                return {
                    path: `${config.folder}/${fileNameWithoutExtension}.png`,
                    blob: blob,
                };
            });
        };

        portraitFiles.forEach(file => {
            processingPromises.push(createProcessPromise(file, DEVICE_CONFIGS.PHONE));
            processingPromises.push(createProcessPromise(file, DEVICE_CONFIGS.TABLET));
        });

        landscapeFiles.forEach(file => {
            processingPromises.push(createProcessPromise(file, DEVICE_CONFIGS.TABLET_10_INCH));
            processingPromises.push(createProcessPromise(file, DEVICE_CONFIGS.CHROMEBOOK));
        });

        try {
            const processedImages = await Promise.all(processingPromises);
            const url = await generateZip(processedImages);
            setDownloadUrl(url);
        } catch (err) {
            console.error("Processing failed:", err);
            setError("An error occurred during image processing. Please check the console.");
        } finally {
            setIsLoading(false);
        }
    }, [portraitFiles, landscapeFiles]);

    const canGenerate = (portraitFiles.length > 0 || landscapeFiles.length > 0) && !isLoading;

    return (
        <div className="flex flex-col min-h-screen font-sans">
            <Header theme={theme} toggleTheme={toggleTheme} />

            <main className="flex-grow container mx-auto px-4 py-8">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-500/20 dark:border-red-500 dark:text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
                            <svg className="fill-current h-6 w-6 text-red-500 dark:text-red-400" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                        </span>
                    </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ImageUploader
                        title="Phone & 7-inch Tablet Screenshots"
                        description="Upload portrait-oriented images (e.g., 9:16 aspect ratio)."
                        onFilesChange={setPortraitFiles}
                    />
                    <ImageUploader
                        title="10-inch Tablet & Chromebook Screenshots"
                        description="Upload landscape-oriented images (e.g., 16:10 aspect ratio)."
                        onFilesChange={setLandscapeFiles}
                    />
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={handleGenerateClick}
                        disabled={!canGenerate}
                        className={`inline-flex items-center justify-center px-8 py-4 font-bold text-lg rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50
                        ${canGenerate ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                    >
                        {isLoading ? (
                           <>
                                <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                Processing... ({processedFileCount}/{totalFileCount})
                           </>
                        ) : (
                            'Generate Screenshots'
                        )}
                    </button>
                </div>
                
                 {isLoading && totalFileCount > 0 && (
                    <div className="w-full max-w-xl mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(processedFileCount / totalFileCount) * 100}%` }}></div>
                    </div>
                )}

                {downloadUrl && !isLoading && (
                    <div className="mt-10 text-center p-8 bg-green-50 border border-green-300 dark:bg-gray-800/50 dark:border-green-500/30 rounded-lg max-w-md mx-auto">
                        <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">Success!</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Your screenshot package is ready for download.</p>
                        <a
                            href={downloadUrl}
                            download="playshotgen_screenshots.zip"
                            className="inline-flex items-center justify-center px-8 py-4 font-bold text-lg rounded-full transition-all duration-300 bg-green-600 hover:bg-green-700 text-white shadow-lg focus:outline-none focus:ring-4 focus:ring-green-500/50"
                        >
                            <DownloadIcon className="mr-3 h-6 w-6" />
                            Download .zip
                        </a>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default App;
