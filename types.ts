
export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  metadata?: ImageMetadata;
  processedImages?: ProcessedImage[];
}

export interface DeviceConfig {
    width: number;
    height: number;
    folder: string;
    name?: string;
    description?: string;
    custom?: boolean;
}

export interface ProcessedImage {
    path: string;
    blob: Blob;
    originalFile?: string;
    deviceConfig?: DeviceConfig;
    processingTime?: number;
}

export interface ImageMetadata {
  width: number;
  height: number;
  size: number;
  type: string;
  exif?: any;
  colorProfile?: string;
  dominantColors?: string[];
}

export interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sharpen: number;
  hue: number;
  sepia: number;
  grayscale: boolean;
  invert: boolean;
}

export interface ProcessingQueueItem {
  id: string;
  file: UploadedFile;
  deviceConfigs: DeviceConfig[];
  priority: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: ProcessedImage[];
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface BatchProcessingOptions {
  parallelProcessing: boolean;
  maxConcurrency: number;
  compressionLevel: number;
  outputFormat: 'png' | 'jpeg' | 'webp';
  quality: number;
  preserveMetadata: boolean;
}

export interface ImageComparisonData {
  id: string;
  original: ProcessedImage;
  processed: ProcessedImage;
  similarity: number;
  differences: PixelDifference[];
  createdAt: Date;
}

export interface PixelDifference {
  x: number;
  y: number;
  originalColor: string;
  processedColor: string;
}

export interface ExportOptions {
  format: 'zip' | 'pdf' | 'individual';
  compression: number;
  includeMetadata: boolean;
  cloudStorage?: CloudStorageConfig;
}

export interface CloudStorageConfig {
  provider: 'aws' | 'gcp' | 'azure';
  bucket: string;
  region: string;
  accessKey: string;
  secretKey: string;
}

export interface AnalyticsEvent {
  id: string;
  type: 'image_processed' | 'batch_completed' | 'export_generated' | 'error_occurred';
  timestamp: Date;
  data: any;
  userId?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  defaultFilters: ImageFilters;
  defaultExportOptions: ExportOptions;
  notifications: boolean;
  autoSave: boolean;
  compressionLevel: number;
  customDevices: DeviceConfig[];
}

export interface SearchFilters {
  query: string;
  dateRange?: [Date, Date];
  deviceTypes: string[];
  fileTypes: string[];
  sizeRange?: [number, number];
  tags: string[];
}

export interface ProcessedImageWithMetadata extends ProcessedImage {
  metadata: ImageMetadata;
  searchIndex: string[];
}
