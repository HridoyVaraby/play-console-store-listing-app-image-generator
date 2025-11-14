import { DeviceConfig, ImageFilters, ImageMetadata, ProcessedImage } from '../types';
import EXIF from 'exif-js';
import ColorThief from 'color-thief';

export class AdvancedImageProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private colorThief: ColorThief;

  constructor() {
    this.canvas = document.createElement('canvas');
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    this.ctx = context;
    this.colorThief = new ColorThief();
  }

  async processImageWithFilters(
    file: File,
    config: DeviceConfig,
    filters: ImageFilters,
    options: {
      preserveMetadata?: boolean;
      outputFormat?: 'png' | 'jpeg' | 'webp';
      quality?: number;
    } = {}
  ): Promise<ProcessedImage> {
    const startTime = Date.now();
    
    try {
      const img = await this.loadImage(file);
      const metadata = await this.extractMetadata(img, file);
      
      // Set canvas dimensions
      this.canvas.width = config.width;
      this.canvas.height = config.height;

      // Apply filters and draw image
      this.applyFilters(filters);
      this.drawImageWithFit(img, config);

      // Apply additional effects
      if (filters.blur > 0) {
        this.applyBlur(filters.blur);
      }
      
      if (filters.sharpen > 0) {
        this.applySharpen(filters.sharpen);
      }

      // Convert to blob
      const blob = await this.canvasToBlob(
        options.outputFormat || 'png',
        options.quality || 0.9
      );

      const processingTime = Date.now() - startTime;

      return {
        path: `${config.folder}/${file.name}`,
        blob,
        originalFile: file.name,
        deviceConfig: config,
        processingTime,
        filtersApplied: filters
      };
    } catch (error) {
      throw new Error(`Image processing failed: ${error}`);
    }
  }

  private loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private async extractMetadata(img: HTMLImageElement, file: File): Promise<ImageMetadata> {
    const metadata: ImageMetadata = {
      width: img.width,
      height: img.height,
      size: file.size,
      type: file.type
    };

    // Extract EXIF data
    try {
      const exifData = await this.getExifData(img);
      if (exifData) {
        metadata.exif = exifData;
      }
    } catch (error) {
      console.warn('Failed to extract EXIF data:', error);
    }

    // Extract dominant colors
    try {
      if (img.complete && img.naturalHeight !== 0) {
        const colors = this.colorThief.getPalette(img, 5);
        metadata.dominantColors = colors.map((color: number[]) => 
          `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        );
      }
    } catch (error) {
      console.warn('Failed to extract dominant colors:', error);
    }

    return metadata;
  }

  private getExifData(img: HTMLImageElement): Promise<any> {
    return new Promise((resolve) => {
      EXIF.getData(img, function(this: any) {
        const allMetaData = EXIF.getAllTags(this);
        resolve(allMetaData);
      });
    });
  }

  private applyFilters(filters: ImageFilters): void {
    const filterStrings: string[] = [];

    // Brightness
    if (filters.brightness !== 100) {
      filterStrings.push(`brightness(${filters.brightness}%)`);
    }

    // Contrast
    if (filters.contrast !== 100) {
      filterStrings.push(`contrast(${filters.contrast}%)`);
    }

    // Saturation
    if (filters.saturation !== 100) {
      filterStrings.push(`saturate(${filters.saturation}%)`);
    }

    // Hue rotation
    if (filters.hue !== 0) {
      filterStrings.push(`hue-rotate(${filters.hue}deg)`);
    }

    // Sepia
    if (filters.sepia > 0) {
      filterStrings.push(`sepia(${filters.sepia}%)`);
    }

    // Grayscale
    if (filters.grayscale) {
      filterStrings.push('grayscale(100%)');
    }

    // Invert
    if (filters.invert) {
      filterStrings.push('invert(100%)');
    }

    this.ctx.filter = filterStrings.join(' ') || 'none';
  }

  private drawImageWithFit(img: HTMLImageElement, config: DeviceConfig): void {
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

    this.ctx.drawImage(img, x, y, drawWidth, drawHeight);
  }

  private applyBlur(amount: number): void {
    if (amount <= 0) return;

    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    const radius = Math.round(amount);

    // Simple box blur implementation
    const blurred = this.boxBlur(data, this.canvas.width, this.canvas.height, radius);
    imageData.data.set(blurred);
    this.ctx.putImageData(imageData, 0, 0);
  }

  private applySharpen(amount: number): void {
    if (amount <= 0) return;

    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Sharpen convolution kernel
    const kernel = [
      0, -1 * amount, 0,
      -1 * amount, 4 * amount + 1, -1 * amount,
      0, -1 * amount, 0
    ];

    const sharpened = this.convolve(data, width, height, kernel);
    imageData.data.set(sharpened);
    this.ctx.putImageData(imageData, 0, 0);
  }

  private boxBlur(data: Uint8ClampedArray, width: number, height: number, radius: number): Uint8ClampedArray {
    const output = new Uint8ClampedArray(data.length);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, a = 0;
        let count = 0;

        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const ny = y + dy;
            const nx = x + dx;

            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
              const idx = (ny * width + nx) * 4;
              r += data[idx];
              g += data[idx + 1];
              b += data[idx + 2];
              a += data[idx + 3];
              count++;
            }
          }
        }

        const idx = (y * width + x) * 4;
        output[idx] = r / count;
        output[idx + 1] = g / count;
        output[idx + 2] = b / count;
        output[idx + 3] = a / count;
      }
    }

    return output;
  }

  private convolve(data: Uint8ClampedArray, width: number, height: number, kernel: number[]): Uint8ClampedArray {
    const output = new Uint8ClampedArray(data.length);
    const kernelSize = Math.sqrt(kernel.length);
    const half = Math.floor(kernelSize / 2);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, a = 0;

        for (let ky = 0; ky < kernelSize; ky++) {
          for (let kx = 0; kx < kernelSize; kx++) {
            const ny = y + ky - half;
            const nx = x + kx - half;

            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
              const idx = (ny * width + nx) * 4;
              const weight = kernel[ky * kernelSize + kx];
              
              r += data[idx] * weight;
              g += data[idx + 1] * weight;
              b += data[idx + 2] * weight;
              a += data[idx + 3] * weight;
            }
          }
        }

        const idx = (y * width + x) * 4;
        output[idx] = Math.min(255, Math.max(0, r));
        output[idx + 1] = Math.min(255, Math.max(0, g));
        output[idx + 2] = Math.min(255, Math.max(0, b));
        output[idx + 3] = Math.min(255, Math.max(0, a));
      }
    }

    return output;
  }

  private canvasToBlob(format: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas toBlob returned null'));
        }
      }, `image/${format}`, quality);
    });
  }

  // Utility method to create filter presets
  static createFilterPreset(name: string): ImageFilters {
    const presets: Record<string, ImageFilters> = {
      'vintage': {
        brightness: 110,
        contrast: 120,
        saturation: 80,
        blur: 0,
        sharpen: 0,
        hue: 0,
        sepia: 30,
        grayscale: false,
        invert: false
      },
      'black-white': {
        brightness: 100,
        contrast: 130,
        saturation: 0,
        blur: 0,
        sharpen: 20,
        hue: 0,
        sepia: 0,
        grayscale: true,
        invert: false
      },
      'vivid': {
        brightness: 105,
        contrast: 110,
        saturation: 150,
        blur: 0,
        sharpen: 10,
        hue: 0,
        sepia: 0,
        grayscale: false,
        invert: false
      },
      'soft': {
        brightness: 95,
        contrast: 90,
        saturation: 90,
        blur: 1,
        sharpen: 0,
        hue: 0,
        sepia: 0,
        grayscale: false,
        invert: false
      }
    };

    return presets[name] || {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      sharpen: 0,
      hue: 0,
      sepia: 0,
      grayscale: false,
      invert: false
    };
  }
}