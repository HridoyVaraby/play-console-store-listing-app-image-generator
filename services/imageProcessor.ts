import { DeviceConfig } from '../types';

export const processImage = (file: File, config: DeviceConfig): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = config.width;
                canvas.height = config.height;
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    return reject(new Error('Could not get canvas context'));
                }

                // A new canvas is transparent by default, so no background fill is needed.

                // Calculate aspect ratios
                const canvasAspect = config.width / config.height;
                const imageAspect = img.width / img.height;

                let drawWidth, drawHeight, x, y;

                if (imageAspect > canvasAspect) {
                    // Image is wider than canvas aspect ratio (letterbox)
                    drawWidth = config.width;
                    drawHeight = config.width / imageAspect;
                    x = 0;
                    y = (config.height - drawHeight) / 2;
                } else {
                    // Image is taller than or equal to canvas aspect ratio (pillarbox)
                    drawHeight = config.height;
                    drawWidth = config.height * imageAspect;
                    y = 0;
                    x = (config.width - drawWidth) / 2;
                }
                
                ctx.drawImage(img, x, y, drawWidth, drawHeight);

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Canvas toBlob returned null'));
                    }
                }, 'image/png'); // Use PNG for transparency
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};
