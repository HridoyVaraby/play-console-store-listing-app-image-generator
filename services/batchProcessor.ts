import { ProcessingQueueItem, BatchProcessingOptions, ProcessedImage, DeviceConfig } from '../types';
import { SimpleImageProcessor } from './simpleImageProcessor';
import { v4 as uuidv4 } from 'uuid';

export class BatchProcessor {
  private queue: ProcessingQueueItem[] = [];
  private isProcessing = false;
  private processor: SimpleImageProcessor;
  private onProgress?: (progress: number) => void;
  private onItemComplete?: (item: ProcessingQueueItem) => void;
  private onComplete?: (results: ProcessingQueueItem[]) => void;

  constructor() {
    this.processor = new SimpleImageProcessor();
  }

  setCallbacks(callbacks: {
    onProgress?: (progress: number) => void;
    onItemComplete?: (item: ProcessingQueueItem) => void;
    onComplete?: (results: ProcessingQueueItem[]) => void;
  }) {
    this.onProgress = callbacks.onProgress;
    this.onItemComplete = callbacks.onItemComplete;
    this.onComplete = callbacks.onComplete;
  }

  addToQueue(
    file: any,
    deviceConfigs: DeviceConfig[],
    priority: number = 0
  ): string {
    const id = uuidv4();
    const item: ProcessingQueueItem = {
      id,
      file,
      deviceConfigs,
      priority,
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    };

    this.queue.push(item);
    this.sortQueueByPriority();
    
    if (!this.isProcessing) {
      this.processQueue();
    }

    return id;
  }

  private sortQueueByPriority(): void {
    this.queue.sort((a, b) => {
      // Higher priority first
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      // Earlier created first if same priority
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const results: ProcessingQueueItem[] = [];

    while (this.queue.length > 0) {
      const item = this.queue.shift()!;
      
      if (item.status === 'pending') {
        try {
          item.status = 'processing';
          item.startedAt = new Date();
          
          const processedImages: ProcessedImage[] = [];
          
          // Process for each device configuration
          for (let i = 0; i < item.deviceConfigs.length; i++) {
            const config = item.deviceConfigs[i];
            
            try {
              const processedImage = await this.processor.processImage(
                item.file.file,
                config,
                {
                  outputFormat: 'png',
                  quality: 0.9,
                  paddingType: 'transparent',
                  addDeviceFrame: config.folder === 'xr' // Add frames only for XR devices
                }
              );
              
              processedImages.push(processedImage);
              
              // Update progress
              item.progress = ((i + 1) / item.deviceConfigs.length) * 100;
              
              if (this.onProgress) {
                const overallProgress = this.calculateOverallProgress();
                this.onProgress(overallProgress);
              }
              
            } catch (error) {
              console.error(`Failed to process image for device ${config.folder}:`, error);
              // Continue with other devices even if one fails
            }
          }
          
          item.result = processedImages;
          item.status = 'completed';
          item.completedAt = new Date();
          
          if (this.onItemComplete) {
            this.onItemComplete(item);
          }
          
        } catch (error) {
          item.status = 'failed';
          item.error = error instanceof Error ? error.message : 'Unknown error';
          item.completedAt = new Date();
        }
        
        results.push(item);
      }
    }

    this.isProcessing = false;
    
    if (this.onComplete) {
      this.onComplete(results);
    }
  }

  private calculateOverallProgress(): number {
    const totalItems = this.queue.length;
    if (totalItems === 0) return 100;
    
    const completedItems = this.queue.filter(item => 
      item.status === 'completed' || item.status === 'failed'
    ).length;
    
    const processingItems = this.queue.filter(item => item.status === 'processing');
    const processingProgress = processingItems.reduce((sum, item) => sum + item.progress, 0);
    
    return ((completedItems * 100) + processingProgress) / totalItems;
  }

  getQueueStatus(): {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    total: number;
  } {
    const status = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      total: this.queue.length
    };

    this.queue.forEach(item => {
      status[item.status]++;
    });

    return status;
  }

  cancelItem(id: string): boolean {
    const index = this.queue.findIndex(item => item.id === id);
    if (index !== -1 && this.queue[index].status === 'pending') {
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }

  cancelAll(): void {
    this.queue = this.queue.filter(item => item.status !== 'pending');
  }

  clearCompleted(): void {
    this.queue = this.queue.filter(item => 
      item.status !== 'completed' && item.status !== 'failed'
    );
  }

  // Batch processing with parallel execution
  async processBatchParallel(
    items: Array<{
      file: any;
      deviceConfigs: DeviceConfig[];
      filters: ImageFilters;
    }>,
    options: BatchProcessingOptions
  ): Promise<ProcessingQueueItem[]> {
    const results: ProcessingQueueItem[] = [];
    const chunks = this.chunkArray(items, options.maxConcurrency);

    for (const chunk of chunks) {
      const chunkPromises = chunk.map(item => 
        this.processSingleItem(item.file, item.deviceConfigs)
      );

      const chunkResults = await Promise.allSettled(chunkPromises);
      
      chunkResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          // Create failed item
          const failedItem: ProcessingQueueItem = {
            id: uuidv4(),
            file: chunk[index].file,
            deviceConfigs: chunk[index].deviceConfigs,
            priority: 0,
            status: 'failed',
            progress: 0,
            error: result.reason?.message || 'Processing failed',
            createdAt: new Date(),
            completedAt: new Date()
          };
          results.push(failedItem);
        }
      });

      if (this.onProgress) {
        const progress = (results.length / items.length) * 100;
        this.onProgress(progress);
      }
    }

    return results;
  }

  private async processSingleItem(
    file: any,
    deviceConfigs: DeviceConfig[]
  ): Promise<ProcessingQueueItem> {
    const id = uuidv4();
    const item: ProcessingQueueItem = {
      id,
      file,
      deviceConfigs,
      priority: 0,
      status: 'processing',
      progress: 0,
      createdAt: new Date(),
      startedAt: new Date()
    };

    try {
      const processedImages: ProcessedImage[] = [];
      
      for (const config of deviceConfigs) {
        const processedImage = await this.processor.processImage(
          file.file,
          config,
          {
            outputFormat: 'png',
            quality: 0.9,
            paddingType: 'transparent',
            addDeviceFrame: config.folder === 'xr' // Add frames only for XR devices
          }
        );
        processedImages.push(processedImage);
        
        item.progress = ((deviceConfigs.indexOf(config) + 1) / deviceConfigs.length) * 100;
      }

      item.result = processedImages;
      item.status = 'completed';
      item.completedAt = new Date();

    } catch (error) {
      item.status = 'failed';
      item.error = error instanceof Error ? error.message : 'Unknown error';
      item.completedAt = new Date();
    }

    return item;
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}