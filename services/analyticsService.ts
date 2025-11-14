import { AnalyticsEvent, UserPreferences } from '../types';
import localforage from 'localforage';

export class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];
  private userId: string;
  private storage: LocalForage;
  private sessionStart: Date;

  private constructor() {
    this.userId = this.generateUserId();
    this.sessionStart = new Date();
    this.storage = localforage.createInstance({
      name: 'playshotgen_analytics'
    });
    this.loadEvents();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateUserId(): string {
    const storedId = localStorage.getItem('playshotgen_user_id');
    if (storedId) {
      return storedId;
    }
    
    const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('playshotgen_user_id', newId);
    return newId;
  }

  async trackEvent(type: AnalyticsEvent['type'], data: any): Promise<void> {
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date(),
      data,
      userId: this.userId
    };

    this.events.push(event);
    
    // Store in local storage for persistence
    try {
      await this.storage.setItem(event.id, event);
    } catch (error) {
      console.warn('Failed to store analytics event:', error);
    }

    // Send to external analytics service if configured
    this.sendToExternalService(event);
  }

  private async loadEvents(): Promise<void> {
    try {
      const keys = await this.storage.keys();
      const events = await Promise.all(
        keys.map(key => this.storage.getItem(key))
      );
      this.events = events.filter(event => event !== null) as AnalyticsEvent[];
      
      // Sort by timestamp
      this.events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    } catch (error) {
      console.warn('Failed to load analytics events:', error);
    }
  }

  private sendToExternalService(event: AnalyticsEvent): void {
    // Placeholder for external analytics service integration
    // This could be Google Analytics, Mixpanel, Amplitude, etc.
    if (typeof gtag !== 'undefined') {
      gtag('event', event.type, {
        event_category: 'playshotgen',
        event_label: JSON.stringify(event.data),
        custom_map: {
          user_id: event.userId
        }
      });
    }

    // Send to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event);
    }
  }

  // Get analytics data
  getSessionStats() {
    const sessionEvents = this.events.filter(event => 
      event.timestamp >= this.sessionStart
    );

    return {
      sessionDuration: Date.now() - this.sessionStart.getTime(),
      imagesProcessed: sessionEvents.filter(e => e.type === 'image_processed').length,
      batchesCompleted: sessionEvents.filter(e => e.type === 'batch_completed').length,
      exportsGenerated: sessionEvents.filter(e => e.type === 'export_generated').length,
      errorsOccurred: sessionEvents.filter(e => e.type === 'error_occurred').length
    };
  }

  getUsageStats(timeRange: 'day' | 'week' | 'month' | 'year' = 'week') {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const filteredEvents = this.events.filter(event => 
      event.timestamp >= startDate
    );

    const stats = {
      totalImages: filteredEvents.filter(e => e.type === 'image_processed').length,
      totalBatches: filteredEvents.filter(e => e.type === 'batch_completed').length,
      totalExports: filteredEvents.filter(e => e.type === 'export_generated').length,
      totalErrors: filteredEvents.filter(e => e.type === 'error_occurred').length,
      averageProcessingTime: this.calculateAverageProcessingTime(filteredEvents),
      mostUsedDevice: this.getMostUsedDevice(filteredEvents),
      popularFilters: this.getPopularFilters(filteredEvents),
      peakUsageHour: this.getPeakUsageHour(filteredEvents)
    };

    return stats;
  }

  private calculateAverageProcessingTime(events: AnalyticsEvent[]): number {
    const processingEvents = events.filter(e => e.type === 'image_processed');
    if (processingEvents.length === 0) return 0;

    const totalTime = processingEvents.reduce((sum, event) => {
      return sum + (event.data.processingTime || 0);
    }, 0);

    return Math.round(totalTime / processingEvents.length);
  }

  private getMostUsedDevice(events: AnalyticsEvent[]): string {
    const deviceCounts: Record<string, number> = {};
    
    events.filter(e => e.type === 'image_processed').forEach(event => {
      const device = event.data.deviceConfig?.folder || 'unknown';
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });

    const sortedDevices = Object.entries(deviceCounts)
      .sort(([,a], [,b]) => b - a);

    return sortedDevices[0]?.[0] || 'unknown';
  }

  private getPopularFilters(events: AnalyticsEvent[]): Record<string, number> {
    const filterCounts: Record<string, number> = {};
    
    events.filter(e => e.type === 'image_processed').forEach(event => {
      const filters = event.data.filtersApplied;
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== false && value !== 0 && value !== 100) {
            const filterKey = `${key}:${value}`;
            filterCounts[filterKey] = (filterCounts[filterKey] || 0) + 1;
          }
        });
      }
    });

    return filterCounts;
  }

  private getPeakUsageHour(events: AnalyticsEvent[]): number {
    const hourCounts: Record<number, number> = {};
    
    events.forEach(event => {
      const hour = event.timestamp.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const sortedHours = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a);

    return parseInt(sortedHours[0]?.[0] || '0');
  }

  // Export analytics data
  async exportAnalytics(format: 'json' | 'csv' = 'json'): Promise<string> {
    if (format === 'csv') {
      return this.exportToCSV();
    }
    return this.exportToJSON();
  }

  private exportToJSON(): string {
    return JSON.stringify({
      userId: this.userId,
      exportDate: new Date().toISOString(),
      events: this.events,
      sessionStats: this.getSessionStats(),
      usageStats: {
        day: this.getUsageStats('day'),
        week: this.getUsageStats('week'),
        month: this.getUsageStats('month'),
        year: this.getUsageStats('year')
      }
    }, null, 2);
  }

  private exportToCSV(): string {
    const headers = ['ID', 'Type', 'Timestamp', 'User ID', 'Data'];
    const rows = this.events.map(event => [
      event.id,
      event.type,
      event.timestamp.toISOString(),
      event.userId || '',
      JSON.stringify(event.data)
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
  }

  // Clear old events
  async clearOldEvents(daysToKeep: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const eventsToKeep = this.events.filter(event => 
      event.timestamp >= cutoffDate
    );

    const eventsToRemove = this.events.filter(event => 
      event.timestamp < cutoffDate
    );

    // Remove from storage
    await Promise.all(
      eventsToRemove.map(event => this.storage.removeItem(event.id))
    );

    this.events = eventsToKeep;
  }

  // Track specific events
  trackImageProcessed(processingTime: number, deviceConfig: any, filtersApplied: any): void {
    this.trackEvent('image_processed', {
      processingTime,
      deviceConfig,
      filtersApplied
    });
  }

  trackBatchCompleted(totalImages: number, totalProcessingTime: number): void {
    this.trackEvent('batch_completed', {
      totalImages,
      totalProcessingTime,
      averageTimePerImage: totalProcessingTime / totalImages
    });
  }

  trackExportGenerated(format: string, fileSize: number, imageCount: number): void {
    this.trackEvent('export_generated', {
      format,
      fileSize,
      imageCount
    });
  }

  trackError(error: Error, context: string): void {
    this.trackEvent('error_occurred', {
      message: error.message,
      stack: error.stack,
      context
    });
  }
}