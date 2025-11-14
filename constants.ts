
import { DeviceConfig } from './types';

interface DeviceConfigs {
    [key: string]: DeviceConfig;
}

export const DEVICE_CONFIGS: DeviceConfigs = {
  PHONE: { width: 1080, height: 1920, folder: 'phone', name: 'Phone', description: '1080×1920 (16:9) Portrait' },
  TABLET: { width: 1600, height: 2560, folder: 'tablet', name: 'Tablet', description: '1600×2560 (16:10) Portrait' },
  TABLET_10_INCH: { width: 1920, height: 1200, folder: '10inch', name: '10-inch Tablet', description: '1920×1200 (16:10) Landscape' },
  CHROMEBOOK: { width: 2560, height: 1600, folder: 'chromebook', name: 'Chromebook', description: '2560×1600 (16:10) Landscape' },
  ANDROID_TV: { width: 1280, height: 720, folder: 'android-tv', name: 'Android TV', description: '1280×720 (16:9) Landscape' },
  WEAR_OS: { width: 384, height: 384, folder: 'wear-os', name: 'Wear OS', description: '384×384 (1:1) Square' },
  ANDROID_AUTO: { width: 1920, height: 1080, folder: 'android-auto', name: 'Android Auto', description: '1920×1080 (16:9) Landscape' },
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_UPLOAD_COUNT = 20;
export const SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg'];
