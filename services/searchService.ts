import { SearchFilters, ProcessedImageWithMetadata, ProcessedImage } from '../types';
import Fuse from 'fuse.js';

export class SearchService {
  private static instance: SearchService;
  private processedImages: ProcessedImageWithMetadata[] = [];
  private fuse: Fuse<ProcessedImageWithMetadata>;

  private constructor() {
    this.initializeFuse();
  }

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  private initializeFuse(): void {
    const options = {
      includeScore: true,
      threshold: 0.3,
      keys: [
        { name: 'path', weight: 0.3 },
        { name: 'originalFile', weight: 0.3 },
        { name: 'searchIndex', weight: 0.2 },
        { name: 'metadata.dominantColors', weight: 0.1 },
        { name: 'deviceConfig.folder', weight: 0.1 }
      ]
    };

    this.fuse = new Fuse(this.processedImages, options);
  }

  addImages(images: ProcessedImageWithMetadata[]): void {
    this.processedImages.push(...images);
    this.initializeFuse(); // Reinitialize Fuse with new data
  }

  removeImages(imageIds: string[]): void {
    this.processedImages = this.processedImages.filter(img => 
      !imageIds.includes(img.path)
    );
    this.initializeFuse();
  }

  clearImages(): void {
    this.processedImages = [];
    this.initializeFuse();
  }

  search(filters: SearchFilters): ProcessedImageWithMetadata[] {
    let results = [...this.processedImages];

    // Text search
    if (filters.query && filters.query.trim()) {
      const searchResults = this.fuse.search(filters.query);
      results = searchResults.map(result => result.item);
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange.length === 2) {
      const [startDate, endDate] = filters.dateRange;
      results = results.filter(img => {
        if (!img.metadata) return false;
        
        const imgDate = new Date(img.metadata.size); // Using size as a proxy for date for now
        return imgDate >= startDate && imgDate <= endDate;
      });
    }

    // Device type filter
    if (filters.deviceTypes && filters.deviceTypes.length > 0) {
      results = results.filter(img => 
        img.deviceConfig && filters.deviceTypes.includes(img.deviceConfig.folder)
      );
    }

    // File type filter
    if (filters.fileTypes && filters.fileTypes.length > 0) {
      results = results.filter(img => {
        const extension = img.path.split('.').pop()?.toLowerCase();
        return extension && filters.fileTypes.includes(extension);
      });
    }

    // Size range filter
    if (filters.sizeRange && filters.sizeRange.length === 2) {
      const [minSize, maxSize] = filters.sizeRange;
      results = results.filter(img => 
        img.metadata && 
        img.metadata.size >= minSize && 
        img.metadata.size <= maxSize
      );
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(img => {
        const searchText = img.searchIndex.join(' ').toLowerCase();
        return filters.tags.some(tag => searchText.includes(tag.toLowerCase()));
      });
    }

    return results;
  }

  advancedSearch(options: {
    color?: string;
    width?: number;
    height?: number;
    aspectRatio?: number;
    processingTime?: number;
    hasFilters?: boolean;
    minSimilarity?: number;
  }): ProcessedImageWithMetadata[] {
    return this.processedImages.filter(img => {
      if (options.color && img.metadata?.dominantColors) {
        const hasColor = img.metadata.dominantColors.some(color => 
          color.toLowerCase().includes(options.color!.toLowerCase())
        );
        if (!hasColor) return false;
      }

      if (options.width && img.metadata) {
        if (img.metadata.width !== options.width) return false;
      }

      if (options.height && img.metadata) {
        if (img.metadata.height !== options.height) return false;
      }

      if (options.aspectRatio && img.metadata) {
        const actualRatio = img.metadata.width / img.metadata.height;
        if (Math.abs(actualRatio - options.aspectRatio) > 0.1) return false;
      }

      if (options.processingTime && img.processingTime) {
        if (img.processingTime > options.processingTime) return false;
      }

      if (options.hasFilters && img.filtersApplied) {
        const hasActiveFilters = Object.entries(img.filtersApplied).some(([key, value]) => {
          if (typeof value === 'boolean') return value;
          if (typeof value === 'number') return value !== 0 && value !== 100;
          return false;
        });
        if (!hasActiveFilters) return false;
      }

      return true;
    });
  }

  createSearchIndex(image: ProcessedImage): string[] {
    const index: string[] = [];

    // Add path components
    if (image.path) {
      const pathParts = image.path.split(/[/\\._-]/);
      index.push(...pathParts);
    }

    // Add original file name
    if (image.originalFile) {
      const fileParts = image.originalFile.split(/[/\\._-]/);
      index.push(...fileParts);
    }

    // Add device config info
    if (image.deviceConfig) {
      index.push(image.deviceConfig.folder);
      index.push(`${image.deviceConfig.width}x${image.deviceConfig.height}`);
      if (image.deviceConfig.name) {
        index.push(image.deviceConfig.name);
      }
      if (image.deviceConfig.description) {
        index.push(image.deviceConfig.description);
      }
    }

    // Add filter information
    if (image.filtersApplied) {
      Object.entries(image.filtersApplied).forEach(([key, value]) => {
        if (typeof value === 'boolean' && value) {
          index.push(key);
        } else if (typeof value === 'number' && value !== 0 && value !== 100) {
          index.push(`${key}${value}`);
        }
      });
    }

    // Add metadata information
    if (image.metadata) {
      index.push(`${image.metadata.width}x${image.metadata.height}`);
      index.push(image.metadata.type);
      
      if (image.metadata.dominantColors) {
        image.metadata.dominantColors.forEach(color => {
          index.push(color.toLowerCase());
        });
      }
    }

    return index.map(term => term.toLowerCase());
  }

  convertToSearchableImage(image: ProcessedImage): ProcessedImageWithMetadata {
    return {
      ...image,
      searchIndex: this.createSearchIndex(image),
      metadata: image.metadata || {
        width: 0,
        height: 0,
        size: image.blob.size,
        type: 'image/png'
      }
    };
  }

  getSearchSuggestions(query: string): string[] {
    const suggestions: string[] = [];
    const lowerQuery = query.toLowerCase();

    // Get unique terms from search indices
    const allTerms = new Set<string>();
    this.processedImages.forEach(img => {
      if (img.searchIndex) {
        img.searchIndex.forEach(term => allTerms.add(term));
      }
    });

    // Find matching terms
    Array.from(allTerms).forEach(term => {
      if (term.includes(lowerQuery) && term !== lowerQuery) {
        suggestions.push(term);
      }
    });

    return suggestions.slice(0, 10); // Limit to 10 suggestions
  }

  getFilterOptions(): {
    deviceTypes: string[];
    fileTypes: string[];
    dominantColors: string[];
    aspectRatios: number[];
  } {
    const deviceTypes = new Set<string>();
    const fileTypes = new Set<string>();
    const dominantColors = new Set<string>();
    const aspectRatios = new Set<number>();

    this.processedImages.forEach(img => {
      if (img.deviceConfig) {
        deviceTypes.add(img.deviceConfig.folder);
      }

      const extension = img.path.split('.').pop()?.toLowerCase();
      if (extension) {
        fileTypes.add(extension);
      }

      if (img.metadata?.dominantColors) {
        img.metadata.dominantColors.forEach(color => dominantColors.add(color));
      }

      if (img.metadata) {
        const ratio = Math.round((img.metadata.width / img.metadata.height) * 100) / 100;
        aspectRatios.add(ratio);
      }
    });

    return {
      deviceTypes: Array.from(deviceTypes).sort(),
      fileTypes: Array.from(fileTypes).sort(),
      dominantColors: Array.from(dominantColors).sort(),
      aspectRatios: Array.from(aspectRatios).sort((a, b) => a - b)
    };
  }

  getStatistics(): {
    totalImages: number;
    totalSize: number;
    averageSize: number;
    deviceDistribution: Record<string, number>;
    filterUsage: Record<string, number>;
    colorDistribution: Record<string, number>;
  } {
    const stats = {
      totalImages: this.processedImages.length,
      totalSize: 0,
      averageSize: 0,
      deviceDistribution: {} as Record<string, number>,
      filterUsage: {} as Record<string, number>,
      colorDistribution: {} as Record<string, number>
    };

    this.processedImages.forEach(img => {
      // Size statistics
      stats.totalSize += img.blob.size;

      // Device distribution
      if (img.deviceConfig) {
        const device = img.deviceConfig.folder;
        stats.deviceDistribution[device] = (stats.deviceDistribution[device] || 0) + 1;
      }

      // Filter usage
      if (img.filtersApplied) {
        Object.entries(img.filtersApplied).forEach(([key, value]) => {
          if (typeof value === 'boolean' && value) {
            stats.filterUsage[key] = (stats.filterUsage[key] || 0) + 1;
          } else if (typeof value === 'number' && value !== 0 && value !== 100) {
            const filterKey = `${key}:${value}`;
            stats.filterUsage[filterKey] = (stats.filterUsage[filterKey] || 0) + 1;
          }
        });
      }

      // Color distribution
      if (img.metadata?.dominantColors) {
        img.metadata.dominantColors.forEach(color => {
          stats.colorDistribution[color] = (stats.colorDistribution[color] || 0) + 1;
        });
      }
    });

    stats.averageSize = stats.totalImages > 0 ? Math.round(stats.totalSize / stats.totalImages) : 0;

    return stats;
  }
}