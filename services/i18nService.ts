export interface Translation {
  [key: string]: string | Translation;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  translations: Translation;
}

export interface I18nConfig {
  defaultLanguage: string;
  fallbackLanguage: string;
  supportedLanguages: string[];
  interpolation: {
    prefix: string;
    suffix: string;
  };
  pluralization: {
    enabled: boolean;
    rules: Record<string, (count: number) => string>;
  };
}

export const DEFAULT_I18N_CONFIG: I18nConfig = {
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
  interpolation: {
    prefix: '{{',
    suffix: '}}'
  },
  pluralization: {
    enabled: true,
    rules: {
      en: (count: number) => count === 1 ? 'one' : 'other',
      es: (count: number) => count === 1 ? 'one' : 'other',
      fr: (count: number) => count <= 1 ? 'one' : 'other',
      de: (count: number) => count === 1 ? 'one' : 'other',
      ru: (count: number) => {
        if (count % 10 === 1 && count % 100 !== 11) return 'one';
        if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'few';
        return 'many';
      }
    }
  }
};

// English translations
const EN_TRANSLATIONS: Translation = {
  // Common
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    update: 'Update',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    confirm: 'Confirm',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    finish: 'Finish',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    export: 'Export',
    import: 'Import',
    settings: 'Settings',
    help: 'Help',
    about: 'About',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    profile: 'Profile',
    preferences: 'Preferences',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    auto: 'Auto'
  },

  // Navigation
  navigation: {
    dashboard: 'Dashboard',
    devices: 'Devices',
    templates: 'Templates',
    batch: 'Batch Processing',
    analytics: 'Analytics',
    settings: 'Settings',
    help: 'Help'
  },

  // Device management
  device: {
    title: 'Devices',
    addDevice: 'Add Device',
    editDevice: 'Edit Device',
    deleteDevice: 'Delete Device',
    deviceName: 'Device Name',
    deviceType: 'Device Type',
    screenSize: 'Screen Size',
    resolution: 'Resolution',
    aspectRatio: 'Aspect Ratio',
    customDevice: 'Custom Device',
    presetDevice: 'Preset Device',
    width: 'Width',
    height: 'Height',
    pixelDensity: 'Pixel Density',
    orientation: 'Orientation',
    portrait: 'Portrait',
    landscape: 'Landscape',
    saveDevice: 'Save Device',
    deviceSaved: 'Device saved successfully',
    deviceDeleted: 'Device deleted successfully',
    confirmDelete: 'Are you sure you want to delete this device?',
    noDevices: 'No devices found',
    deviceNotFound: 'Device not found'
  },

  // Image processing
  processing: {
    title: 'Image Processing',
    uploadImage: 'Upload Image',
    dropImage: 'Drop image here',
    or: 'or',
    browseFiles: 'Browse files',
    processingImage: 'Processing image...',
    processingComplete: 'Processing complete',
    processingFailed: 'Processing failed',
    downloadImage: 'Download Image',
    imageFilters: 'Image Filters',
    brightness: 'Brightness',
    contrast: 'Contrast',
    saturation: 'Saturation',
    blur: 'Blur',
    sharpen: 'Sharpen',
    hue: 'Hue',
    sepia: 'Sepia',
    grayscale: 'Grayscale',
    invert: 'Invert',
    resetFilters: 'Reset Filters',
    applyFilters: 'Apply Filters',
    preview: 'Preview',
    original: 'Original',
    processed: 'Processed',
    compare: 'Compare',
    zoom: 'Zoom',
    rotate: 'Rotate',
    flip: 'Flip',
    crop: 'Crop',
    resize: 'Resize',
    compression: 'Compression',
    quality: 'Quality',
    format: 'Format',
    optimize: 'Optimize',
    fileSize: 'File Size',
    dimensions: 'Dimensions'
  },

  // Batch processing
  batch: {
    title: 'Batch Processing',
    addImages: 'Add Images',
    addFolder: 'Add Folder',
    clearQueue: 'Clear Queue',
    startProcessing: 'Start Processing',
    stopProcessing: 'Stop Processing',
    pauseProcessing: 'Pause Processing',
    resumeProcessing: 'Resume Processing',
    processingQueue: 'Processing Queue',
    completed: 'Completed',
    failed: 'Failed',
    pending: 'Pending',
    processing: 'Processing',
    totalImages: 'Total Images',
    processedImages: 'Processed Images',
    remainingImages: 'Remaining Images',
    estimatedTime: 'Estimated Time',
    processingSpeed: 'Processing Speed',
    parallelTasks: 'Parallel Tasks',
    autoStart: 'Auto Start',
    clearCompleted: 'Clear Completed',
    queueEmpty: 'Queue is empty',
    selectOutputFolder: 'Select Output Folder',
    outputFolder: 'Output Folder',
    preserveStructure: 'Preserve Folder Structure',
    overwriteExisting: 'Overwrite Existing Files',
    processingOptions: 'Processing Options',
    applyToAll: 'Apply to All Images',
    individualSettings: 'Individual Settings'
  },

  // Analytics
  analytics: {
    title: 'Analytics',
    overview: 'Overview',
    processingStats: 'Processing Statistics',
    usageStats: 'Usage Statistics',
    performanceStats: 'Performance Statistics',
    totalImages: 'Total Images Processed',
    totalSize: 'Total Size Processed',
    averageTime: 'Average Processing Time',
    processingTrend: 'Processing Trend',
    sizeTrend: 'Size Trend',
    timeTrend: 'Time Trend',
    topDevices: 'Top Devices',
    topFilters: 'Top Filters',
    topFormats: 'Top Formats',
    exportReport: 'Export Report',
    dateRange: 'Date Range',
    last7Days: 'Last 7 Days',
    last30Days: 'Last 30 Days',
    last90Days: 'Last 90 Days',
    customRange: 'Custom Range',
    refreshData: 'Refresh Data',
    noData: 'No data available'
  },

  // Settings
  settings: {
    title: 'Settings',
    general: 'General',
    appearance: 'Appearance',
    processing: 'Processing',
    export: 'Export',
    privacy: 'Privacy',
    notifications: 'Notifications',
    advanced: 'Advanced',
    language: 'Language',
    theme: 'Theme',
    autoSave: 'Auto Save',
    autoProcess: 'Auto Process',
    compressionQuality: 'Compression Quality',
    imageFormat: 'Default Image Format',
    maxWidth: 'Maximum Width',
    maxHeight: 'Maximum Height',
    parallelTasks: 'Parallel Tasks',
    exportMetadata: 'Export Metadata',
    exportCloudStorage: 'Export to Cloud Storage',
    pdfQuality: 'PDF Quality',
    analyticsEnabled: 'Enable Analytics',
    dataCollection: 'Data Collection',
    emailNotifications: 'Email Notifications',
    pushNotifications: 'Push Notifications',
    notificationSound: 'Notification Sound',
    advancedMode: 'Advanced Mode',
    debugMode: 'Debug Mode',
    experimentalFeatures: 'Experimental Features',
    resetSettings: 'Reset Settings',
    exportSettings: 'Export Settings',
    importSettings: 'Import Settings',
    saveSettings: 'Save Settings',
    settingsSaved: 'Settings saved successfully',
    settingsReset: 'Settings reset to defaults',
    confirmReset: 'Are you sure you want to reset all settings?'
  },

  // Templates
  template: {
    title: 'Templates',
    createTemplate: 'Create Template',
    editTemplate: 'Edit Template',
    deleteTemplate: 'Delete Template',
    templateName: 'Template Name',
    templateDescription: 'Template Description',
    templateCategory: 'Template Category',
    deviceConfiguration: 'Device Configuration',
    imageSettings: 'Image Settings',
    processingSettings: 'Processing Settings',
    saveTemplate: 'Save Template',
    templateSaved: 'Template saved successfully',
    templateDeleted: 'Template deleted successfully',
    confirmDelete: 'Are you sure you want to delete this template?',
    noTemplates: 'No templates found',
    templateNotFound: 'Template not found',
    useTemplate: 'Use Template',
    applyTemplate: 'Apply Template',
    favorite: 'Favorite',
    unfavorite: 'Unfavorite',
    shareTemplate: 'Share Template',
    importTemplate: 'Import Template',
    exportTemplate: 'Export Template'
  },

  // Export
  export: {
    title: 'Export',
    exportOptions: 'Export Options',
    fileFormat: 'File Format',
    imageQuality: 'Image Quality',
    compressionLevel: 'Compression Level',
    metadata: 'Metadata',
    includeMetadata: 'Include Metadata',
    fileName: 'File Name',
    outputFolder: 'Output Folder',
    selectFolder: 'Select Folder',
    exportProgress: 'Export Progress',
    exportComplete: 'Export Complete',
    exportFailed: 'Export Failed',
    download: 'Download',
    saveToCloud: 'Save to Cloud',
    shareLink: 'Share Link',
    pdfOptions: 'PDF Options',
    pageSize: 'Page Size',
    orientation: 'Orientation',
    margins: 'Margins',
    header: 'Header',
    footer: 'Footer',
    watermark: 'Watermark'
  },

  // Errors
  error: {
    generic: 'An error occurred',
    network: 'Network error',
    server: 'Server error',
    validation: 'Validation error',
    authentication: 'Authentication error',
    authorization: 'Authorization error',
    fileNotFound: 'File not found',
    invalidFile: 'Invalid file',
    unsupportedFormat: 'Unsupported format',
    processingError: 'Processing error',
    exportError: 'Export error',
    importError: 'Import error',
    storageError: 'Storage error',
    memoryError: 'Memory error',
    timeout: 'Request timeout',
    tryAgain: 'Please try again',
    contactSupport: 'Contact support'
  },

  // Success messages
  success: {
    generic: 'Operation completed successfully',
    saved: 'Saved successfully',
    deleted: 'Deleted successfully',
    updated: 'Updated successfully',
    created: 'Created successfully',
    imported: 'Imported successfully',
    exported: 'Exported successfully',
    processed: 'Processed successfully',
    uploaded: 'Uploaded successfully',
    downloaded: 'Downloaded successfully'
  }
};

// Spanish translations
const ES_TRANSLATIONS: Translation = {
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    create: 'Crear',
    update: 'Actualizar',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    warning: 'Advertencia',
    info: 'Información',
    confirm: 'Confirmar',
    close: 'Cerrar',
    back: 'Atrás',
    next: 'Siguiente',
    previous: 'Anterior',
    finish: 'Finalizar',
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    export: 'Exportar',
    import: 'Importar',
    settings: 'Configuración',
    help: 'Ayuda',
    about: 'Acerca de',
    logout: 'Cerrar sesión',
    login: 'Iniciar sesión',
    register: 'Registrarse',
    profile: 'Perfil',
    preferences: 'Preferencias',
    language: 'Idioma',
    theme: 'Tema',
    light: 'Claro',
    dark: 'Oscuro',
    auto: 'Auto'
  },
  navigation: {
    dashboard: 'Panel',
    devices: 'Dispositivos',
    templates: 'Plantillas',
    batch: 'Procesamiento por lotes',
    analytics: 'Análisis',
    settings: 'Configuración',
    help: 'Ayuda'
  },
  device: {
    title: 'Dispositivos',
    addDevice: 'Añadir dispositivo',
    editDevice: 'Editar dispositivo',
    deleteDevice: 'Eliminar dispositivo',
    deviceName: 'Nombre del dispositivo',
    deviceType: 'Tipo de dispositivo',
    screenSize: 'Tamaño de pantalla',
    resolution: 'Resolución',
    aspectRatio: 'Relación de aspecto',
    customDevice: 'Dispositivo personalizado',
    presetDevice: 'Dispositivo preestablecido',
    width: 'Ancho',
    height: 'Altura',
    pixelDensity: 'Densidad de píxeles',
    orientation: 'Orientación',
    portrait: 'Vertical',
    landscape: 'Horizontal',
    saveDevice: 'Guardar dispositivo',
    deviceSaved: 'Dispositivo guardado exitosamente',
    deviceDeleted: 'Dispositivo eliminado exitosamente',
    confirmDelete: '¿Estás seguro de que quieres eliminar este dispositivo?',
    noDevices: 'No se encontraron dispositivos',
    deviceNotFound: 'Dispositivo no encontrado'
  },
  processing: {
    title: 'Procesamiento de imágenes',
    uploadImage: 'Subir imagen',
    dropImage: 'Soltar imagen aquí',
    or: 'o',
    browseFiles: 'Explorar archivos',
    processingImage: 'Procesando imagen...',
    processingComplete: 'Procesamiento completo',
    processingFailed: 'Procesamiento fallido',
    downloadImage: 'Descargar imagen',
    imageFilters: 'Filtros de imagen',
    brightness: 'Brillo',
    contrast: 'Contraste',
    saturation: 'Saturación',
    blur: 'Desenfoque',
    sharpen: 'Nitidez',
    hue: 'Matiz',
    sepia: 'Sepia',
    grayscale: 'Escala de grises',
    invert: 'Invertir',
    resetFilters: 'Restablecer filtros',
    applyFilters: 'Aplicar filtros',
    preview: 'Vista previa',
    original: 'Original',
    processed: 'Procesada',
    compare: 'Comparar',
    zoom: 'Zoom',
    rotate: 'Rotar',
    flip: 'Voltear',
    crop: 'Recortar',
    resize: 'Redimensionar',
    compression: 'Compresión',
    quality: 'Calidad',
    format: 'Formato',
    optimize: 'Optimizar',
    fileSize: 'Tamaño del archivo',
    dimensions: 'Dimensiones'
  }
};

export class I18nService {
  private static instance: I18nService;
  private currentLanguage: string;
  private config: I18nConfig;
  private translations: Record<string, Translation>;
  private listeners: Set<(lang: string) => void>;

  private constructor() {
    this.currentLanguage = this.detectLanguage();
    this.config = { ...DEFAULT_I18N_CONFIG };
    this.translations = {
      en: EN_TRANSLATIONS,
      es: ES_TRANSLATIONS
    };
    this.listeners = new Set();
    
    // Load saved language preference
    this.loadSavedLanguage();
  }

  static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }

  private detectLanguage(): string {
    // Check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && this.config.supportedLanguages.includes(urlLang)) {
      return urlLang;
    }

    // Check localStorage
    const savedLang = localStorage.getItem('language');
    if (savedLang && this.config.supportedLanguages.includes(savedLang)) {
      return savedLang;
    }

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (this.config.supportedLanguages.includes(browserLang)) {
      return browserLang;
    }

    // Default to config default
    return this.config.defaultLanguage;
  }

  private loadSavedLanguage(): void {
    try {
      const savedLang = localStorage.getItem('language');
      if (savedLang && this.config.supportedLanguages.includes(savedLang)) {
        this.currentLanguage = savedLang;
      }
    } catch (error) {
      console.warn('Failed to load saved language:', error);
    }
  }

  private saveLanguage(): void {
    try {
      localStorage.setItem('language', this.currentLanguage);
    } catch (error) {
      console.warn('Failed to save language:', error);
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  getSupportedLanguages(): string[] {
    return [...this.config.supportedLanguages];
  }

  getLanguageInfo(code: string): { name: string; nativeName: string; direction: 'ltr' | 'rtl' } {
    const languageNames: Record<string, { name: string; nativeName: string; direction: 'ltr' | 'rtl' }> = {
      en: { name: 'English', nativeName: 'English', direction: 'ltr' },
      es: { name: 'Spanish', nativeName: 'Español', direction: 'ltr' },
      fr: { name: 'French', nativeName: 'Français', direction: 'ltr' },
      de: { name: 'German', nativeName: 'Deutsch', direction: 'ltr' },
      it: { name: 'Italian', nativeName: 'Italiano', direction: 'ltr' },
      pt: { name: 'Portuguese', nativeName: 'Português', direction: 'ltr' },
      ru: { name: 'Russian', nativeName: 'Русский', direction: 'ltr' },
      ja: { name: 'Japanese', nativeName: '日本語', direction: 'ltr' },
      ko: { name: 'Korean', nativeName: '한국어', direction: 'ltr' },
      zh: { name: 'Chinese', nativeName: '中文', direction: 'ltr' }
    };

    return languageNames[code] || languageNames[this.config.fallbackLanguage];
  }

  setLanguage(language: string): boolean {
    if (!this.config.supportedLanguages.includes(language)) {
      console.warn(`Language '${language}' is not supported`);
      return false;
    }

    const oldLanguage = this.currentLanguage;
    this.currentLanguage = language;
    this.saveLanguage();

    // Update HTML lang attribute
    document.documentElement.lang = language;

    // Update text direction
    const langInfo = this.getLanguageInfo(language);
    document.documentElement.dir = langInfo.direction;

    // Notify listeners
    this.notifyListeners(language);

    // Log language change for analytics
    if (oldLanguage !== language) {
      this.logLanguageChange(oldLanguage, language);
    }

    return true;
  }

  t(key: string, params?: Record<string, any>): string {
    const translation = this.getTranslation(key);
    return this.interpolate(translation, params);
  }

  private getTranslation(key: string): string {
    const keys = key.split('.');
    let translation: any = this.translations[this.currentLanguage];

    // Try current language
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        translation = undefined;
        break;
      }
    }

    if (typeof translation === 'string') {
      return translation;
    }

    // Try fallback language
    translation = this.translations[this.config.fallbackLanguage];
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        translation = undefined;
        break;
      }
    }

    if (typeof translation === 'string') {
      return translation;
    }

    // Return key if translation not found
    return key;
  }

  private interpolate(text: string, params?: Record<string, any>): string {
    if (!params) return text;

    const { prefix, suffix } = this.config.interpolation;
    let result = text;

    Object.keys(params).forEach(key => {
      const placeholder = `${prefix}${key}${suffix}`;
      result = result.replace(new RegExp(placeholder, 'g'), String(params[key]));
    });

    return result;
  }

  addTranslations(language: string, translations: Translation): void {
    if (!this.translations[language]) {
      this.translations[language] = {};
    }

    this.translations[language] = {
      ...this.translations[language],
      ...translations
    };
  }

  loadTranslations(language: string, translations: Translation): void {
    this.translations[language] = translations;
  }

  onLanguageChange(listener: (lang: string) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(language: string): void {
    this.listeners.forEach(listener => listener(language));
  }

  private logLanguageChange(oldLang: string, newLang: string): void {
    // In a real app, this would send to analytics
    console.log(`Language changed from ${oldLang} to ${newLang}`);
  }

  // Utility methods
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(this.currentLanguage, options).format(date);
  }

  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.currentLanguage, options).format(number);
  }

  formatRelativeTime(value: number, unit: Intl.RelativeTimeFormatUnit): string {
    return new Intl.RelativeTimeFormat(this.currentLanguage, { numeric: 'auto' }).format(value, unit);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return this.t('duration.days', { count: days });
    } else if (hours > 0) {
      return this.t('duration.hours', { count: hours });
    } else if (minutes > 0) {
      return this.t('duration.minutes', { count: minutes });
    } else {
      return this.t('duration.seconds', { count: seconds });
    }
  }

  // Initialize the service
  static initialize(): I18nService {
    const instance = I18nService.getInstance();
    
    // Set initial language
    const langInfo = instance.getLanguageInfo(instance.currentLanguage);
    document.documentElement.lang = instance.currentLanguage;
    document.documentElement.dir = langInfo.direction;
    
    return instance;
  }
}

// Hook for React components
export function useI18n() {
  const [language, setLanguage] = React.useState(I18nService.getInstance().getCurrentLanguage());
  
  React.useEffect(() => {
    const i18n = I18nService.getInstance();
    const unsubscribe = i18n.onLanguageChange((newLang) => {
      setLanguage(newLang);
    });
    
    return unsubscribe;
  }, []);
  
  const t = React.useCallback((key: string, params?: Record<string, any>) => {
    return I18nService.getInstance().t(key, params);
  }, []);
  
  const changeLanguage = React.useCallback((lang: string) => {
    return I18nService.getInstance().setLanguage(lang);
  }, []);
  
  return { t, language, changeLanguage };
}