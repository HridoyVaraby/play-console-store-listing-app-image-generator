import { ProcessedImage, ImageComparisonData, PixelDifference } from '../types';

export class ImageComparisonService {
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

  async compareImages(original: ProcessedImage, processed: ProcessedImage): Promise<ImageComparisonData> {
    try {
      const [originalData, processedData] = await Promise.all([
        this.imageToImageData(original.blob),
        this.imageToImageData(processed.blob)
      ]);

      const differences = this.findPixelDifferences(originalData, processedData);
      const similarity = this.calculateSimilarity(originalData, processedData);

      return {
        id: this.generateId(),
        original,
        processed,
        similarity,
        differences,
        createdAt: new Date()
      };
    } catch (error) {
      throw new Error(`Image comparison failed: ${error}`);
    }
  }

  async createDiffImage(original: ProcessedImage, processed: ProcessedImage): Promise<Blob> {
    const [originalData, processedData] = await Promise.all([
      this.imageToImageData(original.blob),
      this.imageToImageData(processed.blob)
    ]);

    const diffData = this.createDifferenceVisualization(originalData, processedData);
    
    this.canvas.width = diffData.width;
    this.canvas.height = diffData.height;
    this.ctx.putImageData(diffData, 0, 0);

    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create diff image blob'));
        }
      }, 'image/png');
    });
  }

  private async imageToImageData(blob: Blob): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(blob);
      
      img.onload = () => {
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ctx.drawImage(img, 0, 0);
        const imageData = this.ctx.getImageData(0, 0, img.width, img.height);
        URL.revokeObjectURL(url);
        resolve(imageData);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image for comparison'));
      };
      
      img.src = url;
    });
  }

  private findPixelDifferences(original: ImageData, processed: ImageData): PixelDifference[] {
    const differences: PixelDifference[] = [];
    const threshold = 10; // Color difference threshold

    const minWidth = Math.min(original.width, processed.width);
    const minHeight = Math.min(original.height, processed.height);

    for (let y = 0; y < minHeight; y++) {
      for (let x = 0; x < minWidth; x++) {
        const originalIdx = (y * original.width + x) * 4;
        const processedIdx = (y * processed.width + x) * 4;

        const originalColor = {
          r: original.data[originalIdx],
          g: original.data[originalIdx + 1],
          b: original.data[originalIdx + 2],
          a: original.data[originalIdx + 3]
        };

        const processedColor = {
          r: processed.data[processedIdx],
          g: processed.data[processedIdx + 1],
          b: processed.data[processedIdx + 2],
          a: processed.data[processedIdx + 3]
        };

        const colorDistance = this.calculateColorDistance(originalColor, processedColor);

        if (colorDistance > threshold) {
          differences.push({
            x,
            y,
            originalColor: `rgba(${originalColor.r}, ${originalColor.g}, ${originalColor.b}, ${originalColor.a})`,
            processedColor: `rgba(${processedColor.r}, ${processedColor.g}, ${processedColor.b}, ${processedColor.a})`
          });
        }
      }
    }

    return differences;
  }

  private calculateSimilarity(original: ImageData, processed: ImageData): number {
    const minWidth = Math.min(original.width, processed.width);
    const minHeight = Math.min(original.height, processed.height);
    let totalDistance = 0;
    let pixelCount = 0;

    for (let y = 0; y < minHeight; y++) {
      for (let x = 0; x < minWidth; x++) {
        const originalIdx = (y * original.width + x) * 4;
        const processedIdx = (y * processed.width + x) * 4;

        const originalColor = {
          r: original.data[originalIdx],
          g: original.data[originalIdx + 1],
          b: original.data[originalIdx + 2],
          a: original.data[originalIdx + 3]
        };

        const processedColor = {
          r: processed.data[processedIdx],
          g: processed.data[processedIdx + 1],
          b: processed.data[processedIdx + 2],
          a: processed.data[processedIdx + 3]
        };

        const colorDistance = this.calculateColorDistance(originalColor, processedColor);
        totalDistance += colorDistance;
        pixelCount++;
      }
    }

    const averageDistance = totalDistance / pixelCount;
    const maxPossibleDistance = 441.67; // Maximum possible color distance
    const normalizedDistance = Math.min(averageDistance / maxPossibleDistance, 1);
    
    return Math.round((1 - normalizedDistance) * 10000) / 100; // Percentage with 2 decimal places
  }

  private calculateColorDistance(color1: {r: number, g: number, b: number, a: number}, color2: {r: number, g: number, b: number, a: number}): number {
    const dr = color1.r - color2.r;
    const dg = color1.g - color2.g;
    const db = color1.b - color2.b;
    const da = color1.a - color2.a;

    return Math.sqrt(dr * dr + dg * dg + db * db + da * da);
  }

  private createDifferenceVisualization(original: ImageData, processed: ImageData): ImageData {
    const width = Math.max(original.width, processed.width);
    const height = Math.max(original.height, processed.height);
    const diffData = new ImageData(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        
        const originalIdx = (y * original.width + x) * 4;
        const processedIdx = (y * processed.width + x) * 4;

        const hasOriginal = x < original.width && y < original.height;
        const hasProcessed = x < processed.width && y < processed.height;

        if (hasOriginal && hasProcessed) {
          // Calculate difference
          const originalColor = {
            r: original.data[originalIdx],
            g: original.data[originalIdx + 1],
            b: original.data[originalIdx + 2]
          };

          const processedColor = {
            r: processed.data[processedIdx],
            g: processed.data[processedIdx + 1],
            b: processed.data[processedIdx + 2]
          };

          const diff = Math.abs(originalColor.r - processedColor.r) +
                      Math.abs(originalColor.g - processedColor.g) +
                      Math.abs(originalColor.b - processedColor.b);

          // Create visual difference (red for differences)
          diffData.data[idx] = diff; // R
          diffData.data[idx + 1] = 0; // G
          diffData.data[idx + 2] = 0; // B
          diffData.data[idx + 3] = 255; // A
        } else {
          // Areas that don't exist in one image (show as blue)
          diffData.data[idx] = 0; // R
          diffData.data[idx + 1] = 0; // G
          diffData.data[idx + 2] = 255; // B
          diffData.data[idx + 3] = 255; // A
        }
      }
    }

    return diffData;
  }

  private generateId(): string {
    return `comparison_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate comparison report
  generateComparisonReport(comparison: ImageComparisonData): string {
    const report = [
      'Image Comparison Report',
      '========================',
      `Generated: ${comparison.createdAt.toLocaleString()}`,
      `Similarity: ${comparison.similarity}%`,
      `Total Differences: ${comparison.differences.length}`,
      '',
      'Original Image:',
      `- Path: ${comparison.original.path}`,
      `- Size: ${comparison.original.blob.size} bytes`,
      '',
      'Processed Image:',
      `- Path: ${comparison.processed.path}`,
      `- Size: ${comparison.processed.blob.size} bytes`,
      `- Processing Time: ${comparison.processed.processingTime}ms`,
      '',
      'Filters Applied:',
      comparison.processed.filtersApplied ? 
        Object.entries(comparison.processed.filtersApplied)
          .map(([key, value]) => `- ${key}: ${value}`)
          .join('\n') : 'None',
      '',
      'Top 10 Pixel Differences:',
      ...comparison.differences.slice(0, 10).map(diff => 
        `- Position (${diff.x}, ${diff.y}): ${diff.originalColor} → ${diff.processedColor}`
      )
    ];

    return report.join('\n');
  }

  // Export comparison data as JSON
  exportComparisonData(comparison: ImageComparisonData): string {
    return JSON.stringify({
      id: comparison.id,
      similarity: comparison.similarity,
      differences: comparison.differences,
      original: {
        path: comparison.original.path,
        size: comparison.original.blob.size
      },
      processed: {
        path: comparison.processed.path,
        size: comparison.processed.blob.size,
        processingTime: comparison.processed.processingTime,
        filtersApplied: comparison.processed.filtersApplied
      },
      createdAt: comparison.createdAt.toISOString()
    }, null, 2);
  }
}