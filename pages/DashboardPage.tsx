import React, { useState, useCallback, useEffect } from 'react';
import { SimpleImageUploader } from '../components/simpleimageuploader';
import { UploadedFile, ProcessedImage, DeviceConfig } from '../types';
import { DEVICE_CONFIGS } from '../constants';
import { processImage } from '../services/simpleImageProcessor';
import { generateZip } from '../services/zipService';
import { DownloadIcon, LoaderIcon, EyeIcon, XIcon } from '../components/Icons';

const DashboardPage: React.FC = () => {
    const [portraitFiles, setPortraitFiles] = useState<UploadedFile[]>([]);
    const [landscapeFiles, setLandscapeFiles] = useState<UploadedFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [processedFileCount, setProcessedFileCount] = useState(0);
    const [totalFileCount, setTotalFileCount] = useState(0);
    const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleGenerateClick = useCallback(async () => {
        if (portraitFiles.length === 0 && landscapeFiles.length === 0) {
            setError("Please upload at least one image.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setDownloadUrl(null);
        setProcessedImages([]);
        setProcessedFileCount(0);
        
        // Track filenames to handle duplicates
        const filenameTracker = new Map<string, number>();
        
        const totalPortraitTargets = portraitFiles.length * 2; // phone, tablet
        const totalLandscapeTargets = landscapeFiles.length * 2; // 10inch, chromebook
        setTotalFileCount(totalPortraitTargets + totalLandscapeTargets);

        const processingPromises: Promise<ProcessedImage>[] = [];

        const createProcessPromise = (file: UploadedFile, config: DeviceConfig) => {
             return processImage(file.file, config).then(blob => {
                setProcessedFileCount(prev => prev + 1);
                const originalFileName = file.file.name;
                const fileNameWithoutExtension = originalFileName.substring(0, originalFileName.lastIndexOf('.')) || originalFileName;
                
                // Handle duplicate filenames
                const basePath = `${config.folder}/${fileNameWithoutExtension}`;
                let finalPath = `${basePath}.png`;
                
                if (filenameTracker.has(finalPath)) {
                    let counter = filenameTracker.get(finalPath)!;
                    counter++;
                    filenameTracker.set(finalPath, counter);
                    finalPath = `${basePath}_${counter}.png`;
                } else {
                    filenameTracker.set(finalPath, 0);
                }

                return {
                    path: finalPath,
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
            const processedImagesResult = await Promise.all(processingPromises);
            setProcessedImages(processedImagesResult);
            const url = await generateZip(processedImagesResult);
            setDownloadUrl(url);
        } catch (err) {
            console.error("Processing failed:", err);
            let errorMessage = "An error occurred during image processing. ";
            
            if (err instanceof Error) {
                if (err.message.includes('corrupted')) {
                    errorMessage = "Some images appear to be corrupted or in an unsupported format. Please check your files and try again.";
                } else if (err.message.includes('exceeds')) {
                    errorMessage = "Some files exceed the maximum size limit. Please ensure all images are under 10MB.";
                } else if (err.message.includes('format')) {
                    errorMessage = "Some files are in an unsupported format. Please use PNG, JPG, or JPEG files only.";
                } else {
                    errorMessage += err.message;
                }
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [portraitFiles, landscapeFiles]);

    const handleDownloadSingle = useCallback((image: ProcessedImage) => {
        const url = URL.createObjectURL(image.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = image.path.replace(/\//g, '_');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, []);

    const canGenerate = (portraitFiles.length > 0 || landscapeFiles.length > 0) && !isLoading;

    // Cleanup blob URLs when component unmounts or when new images are generated
    useEffect(() => {
        return () => {
            if (downloadUrl) {
                URL.revokeObjectURL(downloadUrl);
            }
        };
    }, [downloadUrl]);

    return (
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
                <SimpleImageUploader
                    title="Phone + Tablet"
                    description="Upload screenshots for Phone and 7-inch Tablet devices."
                    onFilesChange={setPortraitFiles}
                    maxFiles={20}
                    maxFileSize={10}
                    acceptedFormats={['image/png', 'image/jpeg', 'image/jpg']}
                    multiple={true}
                />
                <SimpleImageUploader
                    title="10-inch Tablet + Chromebook"
                    description="Upload screenshots for 10-inch Tablet and Chromebook devices."
                    onFilesChange={setLandscapeFiles}
                    maxFiles={20}
                    maxFileSize={10}
                    acceptedFormats={['image/png', 'image/jpeg', 'image/jpg']}
                    multiple={true}
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

            {processedImages.length > 0 && !isLoading && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Generated Screenshots</h2>
                    
                    {/* Group images by device folder */}
                    {Object.entries(
                        processedImages.reduce((acc, img) => {
                            const folder = img.path.split('/')[0];
                            if (!acc[folder]) acc[folder] = [];
                            acc[folder].push(img);
                            return acc;
                        }, {} as Record<string, ProcessedImage[]>)
                    ).map(([folder, images]) => {
                        // Get device config for dimensions
                        const deviceConfig = Object.values(DEVICE_CONFIGS).find(c => c.folder === folder);
                        const displayName = folder === '10inch' ? '10-inch Tablet' : 
                                          deviceConfig?.name || folder.charAt(0).toUpperCase() + folder.slice(1);
                        
                        return (
                            <div key={folder} className="mb-10">
                                <div className="flex items-baseline gap-3 mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                        {displayName}
                                    </h3>
                                    {deviceConfig && (
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {deviceConfig.width}×{deviceConfig.height}
                                        </span>
                                    )}
                                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                        ({images.length} {images.length === 1 ? 'image' : 'images'})
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {images.map((image, idx) => {
                                        const imageUrl = URL.createObjectURL(image.blob);
                                        const fileName = image.path.split('/').pop() || 'image.png';
                                        
                                        return (
                                            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                                                <div className="relative group">
                                                    <img
                                                        src={imageUrl}
                                                        alt={fileName}
                                                        className="w-full h-48 object-contain bg-gray-50 dark:bg-gray-900 p-2"
                                                    />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => setPreviewImage(imageUrl)}
                                                            className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                                                            title="Preview"
                                                        >
                                                            <EyeIcon className="w-5 h-5 text-gray-800" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownloadSingle(image)}
                                                            className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                                                            title="Download"
                                                        >
                                                            <DownloadIcon className="w-5 h-5 text-gray-800" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate" title={fileName}>
                                                        {fileName}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {(image.blob.size / 1024).toFixed(2)} KB
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Preview Modal */}
            {previewImage && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-colors z-10"
                            title="Close"
                        >
                            <XIcon className="w-6 h-6 text-gray-800" />
                        </button>
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </main>
    );
};

export default DashboardPage;
