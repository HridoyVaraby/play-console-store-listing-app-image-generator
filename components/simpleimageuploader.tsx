import React, { useState, useCallback, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadIcon, TrashIcon } from './Icons';
import { UploadedFile } from '../types';

export interface ImageUploaderProps {
  title: string;
  description: string;
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
  multiple?: boolean;
}

export const SimpleImageUploader: React.FC<ImageUploaderProps> = ({
  title,
  description,
  onFilesChange,
  maxFiles = 20,
  maxFileSize = 10, // 10MB default
  acceptedFormats = ['image/png', 'image/jpeg', 'image/jpg'],
  multiple = true
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return { valid: false, error: `File ${file.name} exceeds ${maxFileSize}MB size limit.` };
    }

    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return { valid: false, error: `File type ${file.type} is not supported. Supported formats: ${acceptedFormats.join(', ')}` };
    }

    return { valid: true };
  }, [maxFileSize, acceptedFormats]);

  const handleFiles = useCallback((incomingFiles: FileList | null) => {
    if (!incomingFiles) return;

    let newFiles: UploadedFile[] = [...files];
    let errorMessages: string[] = [];

    for (let i = 0; i < incomingFiles.length; i++) {
      const file = incomingFiles[i];

      if (newFiles.length >= maxFiles) {
        errorMessages.push(`Cannot upload more than ${maxFiles} images.`);
        break;
      }

      const validation = validateFile(file);
      if (!validation.valid) {
        errorMessages.push(validation.error || 'Unknown validation error');
        continue;
      }

      const newFile: UploadedFile = {
        id: `${file.name}-${file.lastModified}-${file.size}`,
        file,
        preview: URL.createObjectURL(file),
      };
      
      if (!newFiles.some(f => f.id === newFile.id)) {
        newFiles.push(newFile);
      }
    }

    if (errorMessages.length > 0) {
      console.error('File upload errors:', errorMessages);
    }

    setFiles(newFiles);
    onFilesChange(newFiles);
  }, [files, maxFiles, validateFile, onFilesChange]);

  const removeFile = useCallback((fileId: string) => {
    const newFiles = files.filter(file => file.id !== fileId);
    setFiles(newFiles);
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const clearAllFiles = () => {
    setFiles([]);
    onFilesChange([]);
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 h-full flex flex-col shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{description}</p>
      
      <div
        className={`flex-grow border-2 border-dashed rounded-lg p-6 text-center flex flex-col justify-center items-center transition-colors duration-300 ${
          isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-300 dark:border-gray-600'
        }`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <UploadIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" />
        <p className="text-gray-500 dark:text-gray-400 mb-2">Drag & drop files here, or</p>
        <label htmlFor={`file-upload-${title.replace(/\s+/g, '-')}`} className="cursor-pointer font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
          click to browse
          <input
            id={`file-upload-${title.replace(/\s+/g, '-')}`}
            name="file-upload"
            type="file"
            className="sr-only"
            multiple={multiple}
            accept={acceptedFormats.join(',')}
            onChange={onFileChange}
            ref={fileInputRef}
          />
        </label>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Supported: {acceptedFormats.map(format => format.split('/')[1].toUpperCase()).join(', ')} • Max size: {maxFileSize}MB • Max files: {maxFiles}
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Uploaded files ({files.length})</h4>
            <button
              onClick={clearAllFiles}
              className="text-sm text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
            {files.map((uploadedFile) => (
              <div key={uploadedFile.id} className="relative group">
                <img
                  src={uploadedFile.preview}
                  alt={uploadedFile.file.name}
                  className="w-full h-20 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center rounded-md">
                  <button
                    onClick={() => removeFile(uploadedFile.id)}
                    className="text-red-500 hover:text-red-400 p-1 rounded-full bg-black/50"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">
                  {uploadedFile.file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};