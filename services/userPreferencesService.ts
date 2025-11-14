export interface UserPreferences {
  // General settings
  language: string;
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  autoProcess: boolean;
  
  // Processing settings
  processing: {
    defaultFormat: string;
    compressionQuality: number;
    maxWidth: number;
    maxHeight: number;
    parallelTasks: number;
    enableGPUAcceleration: boolean;
    memoryLimit: number; // MB
  };
  
  // Export settings
  export: {
    defaultFormat: string;
    quality: number;
    includeMetadata: boolean;
    cloudStorageEnabled: boolean;
    cloudStorageProvider: string;
    pdfQuality: 'low' | 'medium' | 'high';
    watermark: {
      enabled: boolean;
      text: string;
      position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
      opacity: number;
      fontSize: number;
    };
  };
  
  // Device settings
  devices: {
    favoriteDevices: string[];
    recentDevices: string[];
    customDevices: DeviceConfig[];
  };
  
  // Template settings
  templates: {
    favoriteTemplates: string[];
    recentTemplates: string[];
    autoSaveTemplates: boolean;
    defaultCategory: string;
  };
  
  // Analytics settings
  analytics: {
    enabled: boolean;
    dataCollection: boolean;
    shareAnalytics: boolean;
    retentionDays: number;
  };
  
  // Notification settings
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    soundEnabled: boolean;
    desktopNotifications: boolean;
    processingComplete: boolean;
    batchComplete: boolean;
    exportComplete: boolean;
    errorAlerts: boolean;
  };
  
  // UI settings
  ui: {
    sidebarCollapsed: boolean;
    showTooltips: boolean;
    enableAnimations: boolean;
    fontSize: 'small' | 'medium' | 'large';
    compactMode: boolean;
    showPreview: boolean;
    autoPreview: boolean;
  };
  
  // Advanced settings
  advanced: {
    debugMode: boolean;
    experimentalFeatures: boolean;
    enableBeta: boolean;
    customCSS: string;
    performanceMode: boolean;
    cacheEnabled: boolean;
    cacheSize: number; // MB
  };
  
  // Privacy settings
  privacy: {
    shareUsageData: boolean;
    allowCookies: boolean;
    rememberMe: boolean;
    sessionTimeout: number; // minutes
    dataRetention: number; // days
  };
  
  // Keyboard shortcuts
  shortcuts: {
    enabled: boolean;
    customShortcuts: Record<string, string>;
  };
  
  // Recent activity
  recentActivity: {
    recentFiles: string[];
    recentExports: string[];
    recentSearches: string[];
    lastUsedDevice: string;
    lastUsedTemplate: string;
  };
  
  // Version info
  version: string;
  lastUpdated: string;
  migrationVersion: number;
}

export interface DeviceConfig {
  id: string;
  name: string;
  width: number;
  height: number;
  pixelDensity: number;
  category: string;
  description?: string;
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  subscription: {
    type: 'free' | 'pro' | 'enterprise';
    expiresAt: string;
    features: string[];
  };
  usage: {
    totalImagesProcessed: number;
    totalStorageUsed: number;
    monthlyQuota: number;
    quotaResetDate: string;
  };
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'en',
  theme: 'auto',
  autoSave: true,
  autoProcess: false,
  
  processing: {
    defaultFormat: 'webp',
    compressionQuality: 85,
    maxWidth: 2048,
    maxHeight: 2048,
    parallelTasks: 4,
    enableGPUAcceleration: true,
    memoryLimit: 512
  },
  
  export: {
    defaultFormat: 'png',
    quality: 90,
    includeMetadata: false,
    cloudStorageEnabled: false,
    cloudStorageProvider: 'none',
    pdfQuality: 'high',
    watermark: {
      enabled: false,
      text: '',
      position: 'bottom-right',
      opacity: 0.5,
      fontSize: 16
    }
  },
  
  devices: {
    favoriteDevices: [],
    recentDevices: [],
    customDevices: []
  },
  
  templates: {
    favoriteTemplates: [],
    recentTemplates: [],
    autoSaveTemplates: true,
    defaultCategory: 'general'
  },
  
  analytics: {
    enabled: true,
    dataCollection: true,
    shareAnalytics: false,
    retentionDays: 90
  },
  
  notifications: {
    emailNotifications: false,
    pushNotifications: true,
    soundEnabled: true,
    desktopNotifications: true,
    processingComplete: true,
    batchComplete: true,
    exportComplete: true,
    errorAlerts: true
  },
  
  ui: {
    sidebarCollapsed: false,
    showTooltips: true,
    enableAnimations: true,
    fontSize: 'medium',
    compactMode: false,
    showPreview: true,
    autoPreview: true
  },
  
  advanced: {
    debugMode: false,
    experimentalFeatures: false,
    enableBeta: false,
    customCSS: '',
    performanceMode: false,
    cacheEnabled: true,
    cacheSize: 100
  },
  
  privacy: {
    shareUsageData: false,
    allowCookies: true,
    rememberMe: true,
    sessionTimeout: 60,
    dataRetention: 365
  },
  
  shortcuts: {
    enabled: true,
    customShortcuts: {}
  },
  
  recentActivity: {
    recentFiles: [],
    recentExports: [],
    recentSearches: [],
    lastUsedDevice: '',
    lastUsedTemplate: ''
  },
  
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  migrationVersion: 1
};

export class UserPreferencesService {
  private static instance: UserPreferencesService;
  private preferences: UserPreferences;
  private profile: UserProfile | null;
  private listeners: Set<(prefs: UserPreferences) => void>;
  private autoSaveTimer: NodeJS.Timeout | null;
  private storageKey = 'user-preferences-v1';
  private profileKey = 'user-profile-v1';

  private constructor() {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.profile = null;
    this.listeners = new Set();
    this.autoSaveTimer = null;
    
    this.loadPreferences();
    this.loadProfile();
    this.setupAutoSave();
    this.setupThemeListener();
  }

  static getInstance(): UserPreferencesService {
    if (!UserPreferencesService.instance) {
      UserPreferencesService.instance = new UserPreferencesService();
    }
    return UserPreferencesService.instance;
  }

  private loadPreferences(): void {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.preferences = this.migratePreferences(parsed);
        this.validatePreferences();
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
      this.preferences = { ...DEFAULT_PREFERENCES };
    }
  }

  private loadProfile(): void {
    try {
      const saved = localStorage.getItem(this.profileKey);
      if (saved) {
        this.profile = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load profile:', error);
    }
  }

  private savePreferences(): void {
    try {
      this.preferences.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
      this.notifyListeners();
    } catch (error) {
      console.warn('Failed to save preferences:', error);
    }
  }

  private saveProfile(): void {
    try {
      if (this.profile) {
        this.profile.updatedAt = new Date().toISOString();
        localStorage.setItem(this.profileKey, JSON.stringify(this.profile));
      }
    } catch (error) {
      console.warn('Failed to save profile:', error);
    }
  }

  private setupAutoSave(): void {
    if (this.preferences.autoSave) {
      this.autoSaveTimer = setInterval(() => {
        this.savePreferences();
      }, 30000); // Auto-save every 30 seconds
    }
  }

  private setupThemeListener(): void {
    if (this.preferences.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        this.applyTheme();
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      // Cleanup function
      window.addEventListener('beforeunload', () => {
        mediaQuery.removeEventListener('change', handleChange);
      });
    }
    
    this.applyTheme();
  }

  private applyTheme(): void {
    const theme = this.preferences.theme === 'auto' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : this.preferences.theme;
    
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  }

  private migratePreferences(preferences: any): UserPreferences {
    const currentVersion = DEFAULT_PREFERENCES.migrationVersion;
    const savedVersion = preferences.migrationVersion || 0;
    
    if (savedVersion === currentVersion) {
      return { ...DEFAULT_PREFERENCES, ...preferences };
    }
    
    // Migration logic for future versions
    let migrated = { ...preferences };
    
    if (savedVersion < 1) {
      // Migration from version 0 to 1
      migrated = {
        ...DEFAULT_PREFERENCES,
        ...migrated,
        migrationVersion: 1
      };
    }
    
    return migrated;
  }

  private validatePreferences(): void {
    // Validate and clamp values
    this.preferences.processing.compressionQuality = Math.max(1, Math.min(100, this.preferences.processing.compressionQuality));
    this.preferences.processing.parallelTasks = Math.max(1, Math.min(16, this.preferences.processing.parallelTasks));
    this.preferences.processing.memoryLimit = Math.max(128, Math.min(4096, this.preferences.processing.memoryLimit));
    this.preferences.export.quality = Math.max(1, Math.min(100, this.preferences.export.quality));
    this.preferences.advanced.cacheSize = Math.max(10, Math.min(1000, this.preferences.advanced.cacheSize));
    this.preferences.privacy.sessionTimeout = Math.max(5, Math.min(1440, this.preferences.privacy.sessionTimeout));
    this.preferences.privacy.dataRetention = Math.max(1, Math.max(3650, this.preferences.privacy.dataRetention));
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  getProfile(): UserProfile | null {
    return this.profile ? { ...this.profile } : null;
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = {
      ...this.preferences,
      ...updates
    };
    
    this.validatePreferences();
    this.applyTheme();
    
    if (this.preferences.autoSave) {
      this.savePreferences();
    }
    
    this.notifyListeners();
  }

  updateProfile(updates: Partial<UserProfile>): void {
    if (this.profile) {
      this.profile = {
        ...this.profile,
        ...updates
      };
      this.saveProfile();
    }
  }

  addCustomDevice(device: DeviceConfig): void {
    const exists = this.preferences.devices.customDevices.find(d => d.id === device.id);
    if (!exists) {
      this.preferences.devices.customDevices.push(device);
      this.updatePreferences(this.preferences);
    }
  }

  removeCustomDevice(deviceId: string): void {
    this.preferences.devices.customDevices = this.preferences.devices.customDevices.filter(d => d.id !== deviceId);
    this.updatePreferences(this.preferences);
  }

  addFavoriteDevice(deviceId: string): void {
    if (!this.preferences.devices.favoriteDevices.includes(deviceId)) {
      this.preferences.devices.favoriteDevices.push(deviceId);
      this.updatePreferences(this.preferences);
    }
  }

  removeFavoriteDevice(deviceId: string): void {
    this.preferences.devices.favoriteDevices = this.preferences.devices.favoriteDevices.filter(id => id !== deviceId);
    this.updatePreferences(this.preferences);
  }

  addRecentDevice(deviceId: string): void {
    const recent = this.preferences.devices.recentDevices.filter(id => id !== deviceId);
    recent.unshift(deviceId);
    this.preferences.devices.recentDevices = recent.slice(0, 10); // Keep only last 10
    this.updatePreferences(this.preferences);
  }

  addFavoriteTemplate(templateId: string): void {
    if (!this.preferences.templates.favoriteTemplates.includes(templateId)) {
      this.preferences.templates.favoriteTemplates.push(templateId);
      this.updatePreferences(this.preferences);
    }
  }

  removeFavoriteTemplate(templateId: string): void {
    this.preferences.templates.favoriteTemplates = this.preferences.templates.favoriteTemplates.filter(id => id !== templateId);
    this.updatePreferences(this.preferences);
  }

  addRecentTemplate(templateId: string): void {
    const recent = this.preferences.templates.recentTemplates.filter(id => id !== templateId);
    recent.unshift(templateId);
    this.preferences.templates.recentTemplates = recent.slice(0, 10); // Keep only last 10
    this.updatePreferences(this.preferences);
  }

  addRecentFile(filePath: string): void {
    const recent = this.preferences.recentActivity.recentFiles.filter(f => f !== filePath);
    recent.unshift(filePath);
    this.preferences.recentActivity.recentFiles = recent.slice(0, 20); // Keep only last 20
    this.updatePreferences(this.preferences);
  }

  addRecentExport(filePath: string): void {
    const recent = this.preferences.recentActivity.recentExports.filter(f => f !== filePath);
    recent.unshift(filePath);
    this.preferences.recentActivity.recentExports = recent.slice(0, 20); // Keep only last 20
    this.updatePreferences(this.preferences);
  }

  addRecentSearch(search: string): void {
    const recent = this.preferences.recentActivity.recentSearches.filter(s => s !== search);
    recent.unshift(search);
    this.preferences.recentActivity.recentSearches = recent.slice(0, 10); // Keep only last 10
    this.updatePreferences(this.preferences);
  }

  onPreferencesChange(listener: (prefs: UserPreferences) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.preferences));
  }

  exportSettings(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importSettings(settingsJson: string): boolean {
    try {
      const imported = JSON.parse(settingsJson);
      const migrated = this.migratePreferences(imported);
      this.validatePreferences();
      this.preferences = migrated;
      this.savePreferences();
      this.applyTheme();
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
    this.applyTheme();
    this.notifyListeners();
  }

  // Analytics methods
  trackUsage(action: string, data?: any): void {
    if (this.preferences.analytics.enabled && this.preferences.analytics.dataCollection) {
      // In a real app, this would send to analytics service
      console.log('Analytics:', action, data);
    }
  }

  getUsageStats(): {
    totalImagesProcessed: number;
    totalStorageUsed: number;
    averageProcessingTime: number;
    favoriteDevices: string[];
    favoriteTemplates: string[];
  } {
    return {
      totalImagesProcessed: this.profile?.usage.totalImagesProcessed || 0,
      totalStorageUsed: this.profile?.usage.totalStorageUsed || 0,
      averageProcessingTime: 0, // This would be calculated from processing logs
      favoriteDevices: this.preferences.devices.favoriteDevices,
      favoriteTemplates: this.preferences.templates.favoriteTemplates
    };
  }

  // Cleanup
  destroy(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
    
    this.savePreferences();
    this.listeners.clear();
  }
}

// Hook for React components
export function useUserPreferences() {
  const [preferences, setPreferences] = React.useState(UserPreferencesService.getInstance().getPreferences());
  
  React.useEffect(() => {
    const service = UserPreferencesService.getInstance();
    const unsubscribe = service.onPreferencesChange((newPrefs) => {
      setPreferences(newPrefs);
    });
    
    return () => unsubscribe();
  }, []);
  
  const updatePreferences = React.useCallback((updates: Partial<UserPreferences>) => {
    UserPreferencesService.getInstance().updatePreferences(updates);
  }, []);
  
  return { preferences, updatePreferences };
}