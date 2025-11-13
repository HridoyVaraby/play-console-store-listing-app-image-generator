
import { DeviceConfig } from './types';

interface DeviceConfigs {
    [key: string]: DeviceConfig;
}

export const DEVICE_CONFIGS: DeviceConfigs = {
  PHONE: { width: 1080, height: 1920, folder: 'phone' },
  TABLET: { width: 1600, height: 2560, folder: 'tablet' },
  TABLET_10_INCH: { width: 1920, height: 1200, folder: '10inch' },
  CHROMEBOOK: { width: 2560, height: 1600, folder: 'chromebook' },
  // Future devices can be added here
  // ANDROID_TV: { width: 1280, height: 720, folder: 'xr' },
  // WEAR_OS: { width: 384, height: 384, folder: 'xr' },
  // ANDROID_AUTO: { width: 1920, height: 1080, folder: 'xr' },
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_UPLOAD_COUNT = 20;
export const SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg'];
