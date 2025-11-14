import { DeviceConfig, ProcessedImage } from '../types';

export interface ProcessingOptions {
  preserveMetadata?: boolean;
  outputFormat?: 'png' | 'jpeg' | 'webp';
  quality?: number;
  paddingType?: 'blur' | 'solid' | 'transparent';
  paddingColor?: string;
  addDeviceFrame?: boolean;
  deviceFrameColor?: string;
}

export class SimpleImageProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    this.ctx = context;
  }

  async processImage(
    file: File,
    config: DeviceConfig,
    options: ProcessingOptions = {}
  ): Promise<ProcessedImage> {
    const startTime = Date.now();
    
    try {
      const img = await this.loadImage(file);
      
      // Set canvas dimensions
      this.canvas.width = config.width;
      this.canvas.height = config.height;

      // Apply smart cropping and padding based on aspect ratio
      this.processImageWithSmartFit(img, config, options);

      // Add device frame if requested
      if (options.addDeviceFrame) {
        this.addDeviceFrameOverlay(config, options);
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
        processingTime
      };
    } catch (error) {
      throw new Error(`Image processing failed: ${error}`);
    }
  }

  private loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      // Check if file is corrupted or empty
      if (file.size === 0) {
        reject(new Error('File is empty or corrupted'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image - file may be corrupted or in an unsupported format'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  private processImageWithSmartFit(
    img: HTMLImageElement, 
    config: DeviceConfig, 
    options: ProcessingOptions
  ): void {
    const canvasAspect = config.width / config.height;
    const imageAspect = img.width / img.height;

    let drawWidth, drawHeight, x, y;

    // Calculate aspect ratio difference for smart cropping decision
    const aspectRatioDiff = Math.abs(imageAspect - canvasAspect) / canvasAspect;

    if (aspectRatioDiff > 0.5 && options.paddingType !== 'transparent') {
      // Significant aspect ratio difference - use padding instead of cropping
      this.applyPadding(config, options);
      
      // Fit image within the padded area
      if (imageAspect > canvasAspect) {
        drawWidth = config.width * 0.9; // 90% of canvas width
        drawHeight = drawWidth / imageAspect;
        x = config.width * 0.05; // 5% margin
        y = (config.height - drawHeight) / 2;
      } else {
        drawHeight = config.height * 0.9; // 90% of canvas height
        drawWidth = drawHeight * imageAspect;
        y = config.height * 0.05; // 5% margin
        x = (config.width - drawWidth) / 2;
      }
    } else {
      // Similar aspect ratios or transparent padding - use standard fit
      if (imageAspect > canvasAspect) {
        // Image is wider than canvas aspect ratio - fit to width
        drawWidth = config.width;
        drawHeight = config.width / imageAspect;
        x = 0;
        y = (config.height - drawHeight) / 2;
      } else {
        // Image is taller than or equal to canvas aspect ratio - fit to height
        drawHeight = config.height;
        drawWidth = config.height * imageAspect;
        y = 0;
        x = (config.width - drawWidth) / 2;
      }
      
      // Apply padding based on options
      this.applyPadding(config, options);
    }
    
    // Draw the image
    this.ctx.drawImage(img, x, y, drawWidth, drawHeight);
  }

  private applyPadding(config: DeviceConfig, options: ProcessingOptions): void {
    const paddingType = options.paddingType || 'transparent';
    
    switch (paddingType) {
      case 'solid':
        this.ctx.fillStyle = options.paddingColor || '#000000';
        this.ctx.fillRect(0, 0, config.width, config.height);
        break;
      case 'blur':
        // Create a blurred background - simplified version
        this.createBlurredBackground(config);
        break;
      case 'transparent':
      default:
        // Canvas is already transparent by default
        break;
    }
  }

  private createBlurredBackground(config: DeviceConfig): void {
    // Create a simple gradient background as a lightweight blur alternative
    const gradient = this.ctx.createLinearGradient(0, 0, config.width, config.height);
    gradient.addColorStop(0, '#2a2a2a');
    gradient.addColorStop(1, '#1a1a1a');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, config.width, config.height);
  }

  private addDeviceFrameOverlay(config: DeviceConfig, options: ProcessingOptions): void {
    const frameColor = options.deviceFrameColor || '#1a1a1a';
    const frameWidth = Math.min(config.width, config.height) * 0.02; // 2% of smallest dimension
    
    // Save current context state
    this.ctx.save();
    
    // Create device frame based on device type
    switch (config.folder) {
      case 'phone':
        this.drawPhoneFrame(frameColor, frameWidth);
        break;
      case 'tablet':
      case '10inch':
      case 'chromebook':
        this.drawTabletFrame(frameColor, frameWidth);
        break;
      case 'xr':
        if (config.name === 'Wear OS') {
          this.drawWearOSFrame(frameColor, frameWidth);
        } else if (config.name === 'Android TV') {
          this.drawTVFrame(frameColor, frameWidth);
        } else if (config.name === 'Android Auto') {
          this.drawAutoFrame(frameColor, frameWidth);
        }
        break;
    }
    
    // Restore context state
    this.ctx.restore();
  }

  private drawPhoneFrame(color: string, width: number): void {
    // Rounded rectangle frame for phones
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.lineJoin = 'round';
    
    const x = width/2;
    const y = width/2;
    const w = this.canvas.width - width;
    const h = this.canvas.height - width;
    const radius = width * 2;
    
    // Draw rounded rectangle manually for better compatibility
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + w - radius, y);
    this.ctx.arcTo(x + w, y, x + w, y + radius, radius);
    this.ctx.lineTo(x + w, y + h - radius);
    this.ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
    this.ctx.lineTo(x + radius, y + h);
    this.ctx.arcTo(x, y + h, x, y + h - radius, radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.arcTo(x, y, x + radius, y, radius);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private drawTabletFrame(color: string, width: number): void {
    // Simpler rectangular frame for tablets
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.strokeRect(width/2, width/2, this.canvas.width - width, this.canvas.height - width);
  }

  private drawWearOSFrame(color: string, width: number): void {
    // Circular frame for Wear OS
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = Math.min(centerX, centerY) - width;
    
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  private drawTVFrame(color: string, width: number): void {
    // Wide rectangular frame for TV
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.strokeRect(width/2, width/2, this.canvas.width - width, this.canvas.height - width);
  }

  private drawAutoFrame(color: string, width: number): void {
    // Car dashboard style frame for Auto
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.strokeRect(width/2, width/2, this.canvas.width - width, this.canvas.height - width);
    
    // Add a subtle inner border
    const innerWidth = width * 0.5;
    this.ctx.strokeStyle = '#333333';
    this.ctx.lineWidth = innerWidth;
    this.ctx.strokeRect(width + innerWidth/2, width + innerWidth/2, this.canvas.width - width - innerWidth, this.canvas.height - width - innerWidth);
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
}

// Export a simple function for backward compatibility
export const processImage = async (file: File, config: DeviceConfig): Promise<Blob> => {
  const processor = new SimpleImageProcessor();
  const result = await processor.processImage(file, config);
  return result.blob;
};