import { ExportOptions, ProcessedImage, CloudStorageConfig } from '../types';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

export class AdvancedExportService {
  private static instance: AdvancedExportService;

  private constructor() {}

  static getInstance(): AdvancedExportService {
    if (!AdvancedExportService.instance) {
      AdvancedExportService.instance = new AdvancedExportService();
    }
    return AdvancedExportService.instance;
  }

  async exportImages(
    images: ProcessedImage[],
    options: ExportOptions
  ): Promise<{ blob?: Blob; url?: string; error?: string }> {
    try {
      switch (options.format) {
        case 'zip':
          return await this.exportAsZip(images, options);
        case 'pdf':
          return await this.exportAsPDF(images, options);
        case 'individual':
          return await this.exportIndividual(images, options);
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Export failed' };
    }
  }

  private async exportAsZip(
    images: ProcessedImage[],
    options: ExportOptions
  ): Promise<{ blob: Blob }> {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // Add metadata if requested
    if (options.includeMetadata) {
      const metadata = {
        exportDate: new Date().toISOString(),
        totalImages: images.length,
        images: images.map(img => ({
          path: img.path,
          processingTime: img.processingTime,
          filtersApplied: img.filtersApplied,
          deviceConfig: img.deviceConfig
        }))
      };
      zip.file('metadata.json', JSON.stringify(metadata, null, 2));
    }

    // Add images
    for (const image of images) {
      const compressedBlob = await this.compressImage(image.blob, options.compression);
      zip.file(image.path, compressedBlob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    // Upload to cloud storage if configured
    if (options.cloudStorage) {
      const uploadResult = await this.uploadToCloudStorage(zipBlob, options.cloudStorage);
      if (uploadResult.url) {
        return { url: uploadResult.url, blob: zipBlob };
      }
    }

    return { blob: zipBlob };
  }

  private async exportAsPDF(
    images: ProcessedImage[],
    options: ExportOptions
  ): Promise<{ blob: Blob }> {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add title page
    pdf.setFontSize(20);
    pdf.text('Play Console App Image Package', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 50);
    pdf.text(`Total Images: ${images.length}`, 20, 60);

    // Add images
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      
      // Add new page for each image
      if (i > 0) {
        pdf.addPage();
      }

      // Convert blob to base64
      const base64 = await this.blobToBase64(image.blob);
      
      // Calculate image dimensions to fit page
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 20;
      const availableWidth = pageWidth - (margin * 2);
      const availableHeight = pageHeight - (margin * 2) - 40; // Leave space for text

      // Add image info
      pdf.setFontSize(10);
      pdf.text(`Image ${i + 1} of ${images.length}`, margin, margin - 5);
      pdf.text(`Path: ${image.path}`, margin, margin + 5);
      
      if (image.processingTime) {
        pdf.text(`Processing Time: ${image.processingTime}ms`, margin, margin + 15);
      }

      if (image.deviceConfig) {
        pdf.text(
          `Device: ${image.deviceConfig.width}x${image.deviceConfig.height}`, 
          margin, 
          margin + 25
        );
      }

      // Add image
      try {
        pdf.addImage(
          base64,
          'PNG',
          margin,
          margin + 35,
          availableWidth,
          availableHeight - 35,
          '',
          'FAST'
        );
      } catch (error) {
        console.warn('Failed to add image to PDF:', error);
        pdf.text('Failed to add image', margin, margin + 50);
      }
    }

    // Add metadata page if requested
    if (options.includeMetadata) {
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text('Metadata', 20, 30);
      
      pdf.setFontSize(10);
      let yPos = 50;
      
      images.forEach((image, index) => {
        if (yPos > 250) {
          pdf.addPage();
          yPos = 30;
        }
        
        pdf.text(`${index + 1}. ${image.path}`, 20, yPos);
        yPos += 10;
        
        if (image.processingTime) {
          pdf.text(`   Processing Time: ${image.processingTime}ms`, 20, yPos);
          yPos += 10;
        }
        
        if (image.filtersApplied) {
          pdf.text(`   Filters: ${JSON.stringify(image.filtersApplied)}`, 20, yPos);
          yPos += 15;
        } else {
          yPos += 10;
        }
      });
    }

    const pdfBlob = pdf.output('blob');
    return { blob: pdfBlob };
  }

  private async exportIndividual(
    images: ProcessedImage[],
    options: ExportOptions
  ): Promise<{ blob: Blob; url?: string }> {
    // For individual export, we'll create a zip with individual files
    // but with better organization
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // Organize by device type
    const organizedImages: Record<string, ProcessedImage[]> = {};
    
    images.forEach(image => {
      const deviceType = image.deviceConfig?.folder || 'unknown';
      if (!organizedImages[deviceType]) {
        organizedImages[deviceType] = [];
      }
      organizedImages[deviceType].push(image);
    });

    // Create folders and add images
    Object.entries(organizedImages).forEach(([deviceType, deviceImages]) => {
      const folder = zip.folder(deviceType);
      if (folder) {
        deviceImages.forEach(async (image) => {
          const compressedBlob = await this.compressImage(image.blob, options.compression);
          folder.file(image.path.split('/').pop() || 'image.png', compressedBlob);
        });
      }
    });

    // Add metadata
    if (options.includeMetadata) {
      const metadata = {
        exportDate: new Date().toISOString(),
        totalImages: images.length,
        organization: 'by-device-type',
        devices: Object.keys(organizedImages)
      };
      zip.file('metadata.json', JSON.stringify(metadata, null, 2));
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    // Upload to cloud storage if configured
    if (options.cloudStorage) {
      const uploadResult = await this.uploadToCloudStorage(zipBlob, options.cloudStorage);
      if (uploadResult.url) {
        return { url: uploadResult.url, blob: zipBlob };
      }
    }

    return { blob: zipBlob };
  }

  private async compressImage(blob: Blob, compressionLevel: number): Promise<Blob> {
    if (compressionLevel >= 100) return blob;

    try {
      // Use canvas-based compression
      const img = new Image();
      const url = URL.createObjectURL(blob);
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(url);
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0);
          
          const quality = compressionLevel / 100;
          canvas.toBlob(
            (compressedBlob) => {
              URL.revokeObjectURL(url);
              if (compressedBlob) {
                resolve(compressedBlob);
              } else {
                reject(new Error('Compression failed'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load image for compression'));
        };
        
        img.src = url;
      });
    } catch (error) {
      console.warn('Image compression failed, returning original:', error);
      return blob;
    }
  }

  private async uploadToCloudStorage(
    blob: Blob, 
    config: CloudStorageConfig
  ): Promise<{ url?: string; error?: string }> {
    try {
      // This is a placeholder implementation
      // In a real application, you would integrate with AWS S3, Google Cloud Storage, etc.
      
      const formData = new FormData();
      formData.append('file', blob);
      formData.append('provider', config.provider);
      formData.append('bucket', config.bucket);
      formData.append('region', config.region);

      // Simulate API call
      console.log('Uploading to cloud storage:', config.provider);
      
      // Return a mock URL for demonstration
      return {
        url: `https://${config.bucket}.${config.provider}.com/uploads/${Date.now()}.zip`
      };
    } catch (error) {
      return { 
        error: `Cloud storage upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Utility methods for different export formats
  async exportAsCSV(images: ProcessedImage[]): Promise<Blob> {
    const headers = ['Filename', 'Path', 'Size (bytes)', 'Processing Time (ms)', 'Device Type', 'Filters Applied'];
    const rows = images.map(image => [
      image.path.split('/').pop() || 'unknown',
      image.path,
      image.blob.size.toString(),
      image.processingTime?.toString() || '0',
      image.deviceConfig?.folder || 'unknown',
      image.filtersApplied ? JSON.stringify(image.filtersApplied) : 'none'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  async exportAsJSON(images: ProcessedImage[]): Promise<Blob> {
    const data = {
      exportDate: new Date().toISOString(),
      totalImages: images.length,
      images: images.map(image => ({
        path: image.path,
        size: image.blob.size,
        processingTime: image.processingTime,
        deviceConfig: image.deviceConfig,
        filtersApplied: image.filtersApplied,
        originalFile: image.originalFile
      }))
    };

    return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  }
}