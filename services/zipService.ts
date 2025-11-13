
import { ProcessedImage } from '../types';

// Let TypeScript know that JSZip is available on the window object
declare global {
    interface Window {
        JSZip: any;
    }
}

export const generateZip = (images: ProcessedImage[]): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            const zip = new window.JSZip();

            images.forEach(image => {
                zip.file(image.path, image.blob);
            });
            
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            resolve(url);

        } catch (error) {
            console.error('Failed to create zip file:', error);
            reject(error);
        }
    });
};
