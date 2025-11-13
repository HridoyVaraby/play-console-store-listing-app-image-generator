
export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
}

export interface DeviceConfig {
    width: number;
    height: number;
    folder: string;
}

export interface ProcessedImage {
    path: string;
    blob: Blob;
}
