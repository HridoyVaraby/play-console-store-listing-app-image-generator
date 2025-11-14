import { GalleryImage } from '../components/ImageGallery';

export interface DownloadOptions {
  format: 'png' | 'jpg' | 'svg';
  quality?: number; // For JPG compression (0.1 to 1.0)
}

export class ImageDownloadService {
  private static instance: ImageDownloadService;

  private constructor() {}

  public static getInstance(): ImageDownloadService {
    if (!ImageDownloadService.instance) {
      ImageDownloadService.instance = new ImageDownloadService();
    }
    return ImageDownloadService.instance;
  }

  /**
   * Download an image in the specified format
   */
  public async downloadImage(image: GalleryImage, options: DownloadOptions): Promise<void> {
    try {
      const blob = await this.convertToFormat(image, options);
      const url = URL.createObjectURL(blob);
      const filename = this.generateFilename(image.title, options.format);
      
      this.triggerDownload(url, filename);
      
      // Clean up the URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Download failed:', error);
      throw new Error(`Failed to download image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert image to specified format
   */
  private async convertToFormat(image: GalleryImage, options: DownloadOptions): Promise<Blob> {
    // If the image is already in the desired format and we have the blob, use it
    if (image.format === options.format && image.blob) {
      return image.blob;
    }

    // For SVG format, we need to handle it specially
    if (options.format === 'svg') {
      if (image.format === 'svg') {
        return image.blob || this.dataURLToBlob(image.src);
      }
      throw new Error('Cannot convert raster images to SVG format');
    }

    // For other formats, use canvas conversion
    return this.convertWithCanvas(image, options);
  }

  /**
   * Convert image using HTML Canvas
   */
  private async convertWithCanvas(image: GalleryImage, options: DownloadOptions): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Set canvas dimensions
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the image
          ctx.drawImage(img, 0, 0);

          // Convert to desired format
          const mimeType = this.getMimeType(options.format);
          const quality = options.format === 'jpg' ? (options.quality || 0.9) : undefined;

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Canvas conversion failed'));
              }
            },
            mimeType,
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = image.src;
    });
  }

  /**
   * Convert data URL to Blob
   */
  private dataURLToBlob(dataURL: string): Blob {
    const parts = dataURL.split(',');
    const byteString = atob(parts[1]);
    const mimeString = parts[0].split(':')[1].split(';')[0];
    
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  }

  /**
   * Get MIME type for format
   */
  private getMimeType(format: string): string {
    switch (format) {
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'svg':
        return 'image/svg+xml';
      default:
        return 'image/png';
    }
  }

  /**
   * Generate filename with format extension
   */
  private generateFilename(title: string, format: string): string {
    // Clean the title for filename use
    const cleanTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50); // Limit length
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const extension = format === 'jpg' ? 'jpg' : format;
    
    return `${cleanTitle}-${timestamp}.${extension}`;
  }

  /**
   * Trigger browser download
   */
  private triggerDownload(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Get file size in human readable format
   */
  public static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Validate image format conversion compatibility
   */
  public static isFormatCompatible(sourceFormat: string, targetFormat: string): boolean {
    // SVG can only be converted to raster formats, not vice versa
    if (sourceFormat === 'svg' && targetFormat !== 'svg') {
      return true;
    }
    
    // Raster images cannot be converted to SVG
    if (sourceFormat !== 'svg' && targetFormat === 'svg') {
      return false;
    }
    
    // All other conversions are supported
    return true;
  }
}

export const imageDownloadService = ImageDownloadService.getInstance();