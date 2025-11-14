import Compressor from 'compressorjs';
import { ProcessedImage } from '../types';

export interface CompressionOptions {
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  mimeType?: 'image/jpeg' | 'image/png' | 'image/webp';
  convertSize?: number;
  loose?: boolean;
  redressOrientation?: boolean;
  checkOrientation?: boolean;
}

export interface CompressionResult {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  quality: number;
  format: string;
}

export class ImageCompressionService {
  private static instance: ImageCompressionService;

  private constructor() {}

  static getInstance(): ImageCompressionService {
    if (!ImageCompressionService.instance) {
      ImageCompressionService.instance = new ImageCompressionService();
    }
    return ImageCompressionService.instance;
  }

  async compressImage(
    processedImage: ProcessedImage,
    options: CompressionOptions
  ): Promise<{ processedImage: ProcessedImage; result: CompressionResult }> {
    return new Promise((resolve, reject) => {
      new Compressor(processedImage.blob, {
        quality: options.quality / 100,
        maxWidth: options.maxWidth,
        maxHeight: options.maxHeight,
        mimeType: options.mimeType,
        convertSize: options.convertSize,
        loose: options.loose,
        redressOrientation: options.redressOrientation,
        checkOrientation: options.checkOrientation,
        success: (compressedBlob) => {
          const result: CompressionResult = {
            originalSize: processedImage.blob.size,
            compressedSize: compressedBlob.size,
            compressionRatio: Math.round(((processedImage.blob.size - compressedBlob.size) / processedImage.blob.size) * 100),
            quality: options.quality,
            format: compressedBlob.type
          };

          const newProcessedImage: ProcessedImage = {
            ...processedImage,
            blob: compressedBlob,
            path: processedImage.path.replace(/\.\w+$/, `.${compressedBlob.type.split('/')[1]}`)
          };

          resolve({ processedImage: newProcessedImage, result });
        },
        error: (error) => {
          reject(new Error(`Compression failed: ${error.message}`));
        }
      });
    });
  }

  async compressImages(
    processedImages: ProcessedImage[],
    options: CompressionOptions
  ): Promise<Array<{ processedImage: ProcessedImage; result: CompressionResult }>> {
    const results = await Promise.allSettled(
      processedImages.map(image => this.compressImage(image, options))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.warn(`Failed to compress image ${index}:`, result.reason);
        // Return original image with failed compression result
        return {
          processedImage: processedImages[index],
          result: {
            originalSize: processedImages[index].blob.size,
            compressedSize: processedImages[index].blob.size,
            compressionRatio: 0,
            quality: options.quality,
            format: processedImages[index].blob.type
          }
        };
      }
    });
  }

  getOptimalCompressionSettings(
    image: ProcessedImage,
    targetSizeKB: number,
    qualityPreference: 'high' | 'medium' | 'low' = 'medium'
  ): CompressionOptions {
    const currentSizeKB = image.blob.size / 1024;
    const targetRatio = targetSizeKB / currentSizeKB;

    let baseQuality = 90;
    let maxWidth: number | undefined;
    let maxHeight: number | undefined;

    switch (qualityPreference) {
      case 'high':
        baseQuality = 90;
        break;
      case 'medium':
        baseQuality = 75;
        break;
      case 'low':
        baseQuality = 60;
        break;
    }

    // Adjust quality based on target size
    if (targetRatio < 0.3) {
      baseQuality = Math.max(30, baseQuality - 40);
      maxWidth = 800;
      maxHeight = 800;
    } else if (targetRatio < 0.5) {
      baseQuality = Math.max(50, baseQuality - 25);
      maxWidth = 1200;
      maxHeight = 1200;
    } else if (targetRatio < 0.7) {
      baseQuality = Math.max(60, baseQuality - 15);
      maxWidth = 1600;
      maxHeight = 1600;
    }

    return {
      quality: baseQuality,
      maxWidth,
      maxHeight,
      mimeType: 'image/jpeg',
      loose: true,
      redressOrientation: true,
      checkOrientation: true
    };
  }

  async smartCompress(
    processedImage: ProcessedImage,
    targetSizeKB: number,
    qualityPreference: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<{ processedImage: ProcessedImage; result: CompressionResult }> {
    const settings = this.getOptimalCompressionSettings(
      processedImage,
      targetSizeKB,
      qualityPreference
    );

    return this.compressImage(processedImage, settings);
  }

  async batchSmartCompress(
    processedImages: ProcessedImage[],
    targetSizeKB: number,
    qualityPreference: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<Array<{ processedImage: ProcessedImage; result: CompressionResult }>> {
    return Promise.all(
      processedImages.map(image => 
        this.smartCompress(image, targetSizeKB, qualityPreference)
      )
    );
  }

  getCompressionPresets(): Record<string, CompressionOptions> {
    return {
      'web-optimized': {
        quality: 85,
        maxWidth: 1920,
        maxHeight: 1920,
        mimeType: 'image/webp',
        loose: true,
        redressOrientation: true,
        checkOrientation: true
      },
      'high-quality': {
        quality: 95,
        mimeType: 'image/png',
        loose: false,
        redressOrientation: true,
        checkOrientation: true
      },
      'small-size': {
        quality: 60,
        maxWidth: 800,
        maxHeight: 800,
        mimeType: 'image/jpeg',
        loose: true,
        redressOrientation: true,
        checkOrientation: true
      },
      'social-media': {
        quality: 80,
        maxWidth: 1200,
        maxHeight: 1200,
        mimeType: 'image/jpeg',
        loose: true,
        redressOrientation: true,
        checkOrientation: true
      }
    };
  }

  async compressWithPreset(
    processedImage: ProcessedImage,
    preset: keyof ReturnType<typeof this.getCompressionPresets>
  ): Promise<{ processedImage: ProcessedImage; result: CompressionResult }> {
    const presets = this.getCompressionPresets();
    const presetOptions = presets[preset];
    
    if (!presetOptions) {
      throw new Error(`Unknown preset: ${preset}`);
    }

    return this.compressImage(processedImage, presetOptions);
  }

  estimateCompressedSize(
    originalSize: number,
    quality: number,
    maxWidth?: number,
    maxHeight?: number
  ): number {
    // Rough estimation based on quality and dimensions
    let estimatedSize = originalSize * (quality / 100);
    
    if (maxWidth || maxHeight) {
      // Assume size reduction proportional to area reduction
      const dimensionReductionFactor = 0.7; // Conservative estimate
      estimatedSize *= dimensionReductionFactor;
    }

    return Math.round(estimatedSize);
  }

  getCompressionReport(
    results: Array<{ processedImage: ProcessedImage; result: CompressionResult }>
  ): {
    totalOriginalSize: number;
    totalCompressedSize: number;
    totalSavings: number;
    averageCompressionRatio: number;
    largestSaving: CompressionResult;
    smallestSaving: CompressionResult;
  } {
    const totalOriginalSize = results.reduce((sum, r) => sum + r.result.originalSize, 0);
    const totalCompressedSize = results.reduce((sum, r) => sum + r.result.compressedSize, 0);
    const totalSavings = totalOriginalSize - totalCompressedSize;
    const averageCompressionRatio = results.reduce((sum, r) => sum + r.result.compressionRatio, 0) / results.length;

    const sortedBySavings = [...results].sort((a, b) => 
      b.result.compressionRatio - a.result.compressionRatio
    );

    return {
      totalOriginalSize,
      totalCompressedSize,
      totalSavings,
      averageCompressionRatio: Math.round(averageCompressionRatio * 100) / 100,
      largestSaving: sortedBySavings[0]?.result || results[0]?.result,
      smallestSaving: sortedBySavings[sortedBySavings.length - 1]?.result || results[0]?.result
    };
  }

  validateCompressionOptions(options: CompressionOptions): boolean {
    if (options.quality < 1 || options.quality > 100) {
      throw new Error('Quality must be between 1 and 100');
    }

    if (options.maxWidth && options.maxWidth < 1) {
      throw new Error('Max width must be positive');
    }

    if (options.maxHeight && options.maxHeight < 1) {
      throw new Error('Max height must be positive');
    }

    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (options.mimeType && !validMimeTypes.includes(options.mimeType)) {
      throw new Error(`Invalid mime type. Must be one of: ${validMimeTypes.join(', ')}`);
    }

    return true;
  }
}