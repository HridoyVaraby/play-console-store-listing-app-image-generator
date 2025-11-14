import React, { useState } from 'react';
import { DownloadIcon, EyeIcon, LoaderIcon } from './Icons';

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  dimensions: {
    width: number;
    height: number;
  };
  size: string;
  format: string;
  deviceType: string;
  blob?: Blob;
}

export interface ImageGalleryProps {
  images: GalleryImage[];
  onImageDownload: (image: GalleryImage, format: 'png' | 'jpg' | 'svg') => Promise<void>;
  isLoading?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  onImageDownload, 
  isLoading = false 
}) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [downloadingImages, setDownloadingImages] = useState<Set<string>>(new Set());

  const handleDownload = async (image: GalleryImage, format: 'png' | 'jpg' | 'svg') => {
    setDownloadingImages(prev => new Set(prev).add(`${image.id}-${format}`));
    try {
      await onImageDownload(image, format);
    } finally {
      setDownloadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${image.id}-${format}`);
        return newSet;
      });
    }
  };

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (isLoading) {
    return (
      <div className="gallery">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="gallery-item loading">
            <div className="gallery-item-image bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium">No images generated yet</p>
          <p className="text-sm">Upload some images and click "Generate Screenshots" to get started</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="gallery">
        {images.map((image) => (
          <div key={image.id} className="gallery-item">
            <img
              src={image.src}
              alt={image.alt}
              className="gallery-item-image"
              onClick={() => handleImageClick(image)}
            />
            
            <div className="gallery-item-overlay">
              <div className="gallery-item-info">
                <div className="gallery-item-title">{image.title}</div>
                <div className="gallery-item-meta">
                  {image.dimensions.width}×{image.dimensions.height} • {image.size} • {image.format.toUpperCase()}
                </div>
                <div className="gallery-item-meta">
                  {image.deviceType}
                </div>
              </div>
            </div>

            <div className="gallery-item-actions">
              <button
                className="gallery-item-action"
                onClick={() => handleImageClick(image)}
                title="View full size"
                aria-label={`View ${image.title} full size`}
              >
                <EyeIcon className="w-4 h-4" />
              </button>
              
              <div className="relative group">
                <button
                  className="gallery-item-action"
                  title="Download"
                  aria-label={`Download ${image.title}`}
                >
                  <DownloadIcon className="w-4 h-4" />
                </button>
                
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[120px]">
                  <div className="py-1">
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      onClick={() => handleDownload(image, 'png')}
                      disabled={downloadingImages.has(`${image.id}-png`)}
                    >
                      {downloadingImages.has(`${image.id}-png`) ? (
                        <LoaderIcon className="w-4 h-4 animate-spin" />
                      ) : (
                        <span className="w-4 h-4">PNG</span>
                      )}
                      Download PNG
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      onClick={() => handleDownload(image, 'jpg')}
                      disabled={downloadingImages.has(`${image.id}-jpg`)}
                    >
                      {downloadingImages.has(`${image.id}-jpg`) ? (
                        <LoaderIcon className="w-4 h-4 animate-spin" />
                      ) : (
                        <span className="w-4 h-4">JPG</span>
                      )}
                      Download JPG
                    </button>
                    {image.format === 'svg' && (
                      <button
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        onClick={() => handleDownload(image, 'svg')}
                        disabled={downloadingImages.has(`${image.id}-svg`)}
                      >
                        {downloadingImages.has(`${image.id}-svg`) ? (
                          <LoaderIcon className="w-4 h-4 animate-spin" />
                        ) : (
                          <span className="w-4 h-4">SVG</span>
                        )}
                        Download SVG
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2 transition-colors"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{selectedImage.title}</h3>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Dimensions:</span> {selectedImage.dimensions.width}×{selectedImage.dimensions.height}</p>
                <p><span className="font-medium">Size:</span> {selectedImage.size}</p>
                <p><span className="font-medium">Format:</span> {selectedImage.format.toUpperCase()}</p>
                <p><span className="font-medium">Device:</span> {selectedImage.deviceType}</p>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  className="btn btn-primary text-sm"
                  onClick={() => handleDownload(selectedImage, 'png')}
                  disabled={downloadingImages.has(`${selectedImage.id}-png`)}
                >
                  {downloadingImages.has(`${selectedImage.id}-png`) ? (
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                  ) : (
                    'Download PNG'
                  )}
                </button>
                <button
                  className="btn btn-secondary text-sm"
                  onClick={() => handleDownload(selectedImage, 'jpg')}
                  disabled={downloadingImages.has(`${selectedImage.id}-jpg`)}
                >
                  {downloadingImages.has(`${selectedImage.id}-jpg`) ? (
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                  ) : (
                    'Download JPG'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};