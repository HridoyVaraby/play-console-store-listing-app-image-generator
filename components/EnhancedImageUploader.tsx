import React, { useState, useCallback, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
import { UploadIcon, TrashIcon, EyeIcon, FileIcon, CheckCircleIcon } from './Icons';
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

export const EnhancedImageUploader: React.FC<ImageUploaderProps> = ({
  title,
  description,
  onFilesChange,
  maxFiles = 10,
  maxFileSize = 10, // 10MB default
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'],
  multiple = true
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // No keyboard shortcuts or focus trap - simplified for PRD

  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return { 
        valid: false, 
        error: `File "${file.name}" is too large. Maximum size is ${maxFileSize}MB.` 
      };
    }

    // Check file format
    if (!acceptedFormats.includes(file.type)) {
      return { 
        valid: false, 
        error: `File "${file.name}" has an unsupported format. Accepted formats: ${acceptedFormats.join(', ')}.` 
      };
    }

    // Check for duplicate files
    const isDuplicate = files.some(existingFile => 
      existingFile.file.name === file.name && existingFile.file.size === file.size
    );

    if (isDuplicate) {
      return { 
        valid: false, 
        error: `File "${file.name}" has already been added.` 
      };
    }

    return { valid: true };
  }, [files, maxFileSize, acceptedFormats]);

  const processFiles = useCallback(async (newFiles: FileList) => {
    if (files.length + newFiles.length > maxFiles) {
      console.error(`Too many files: You can only upload up to ${maxFiles} files. You have ${files.length} files already.`);
      return;
    }

    setIsUploading(true);
    const newUploadedFiles: UploadedFile[] = [];
    const errors: string[] = [];

    // Simulate upload progress
    const uploadPromises = Array.from(newFiles).map(async (file, index) => {
      const validation = validateFile(file);
      
      if (!validation.valid) {
        errors.push(validation.error!);
        return;
      }

      // Simulate upload progress
      const fileId = `file-${Date.now()}-${index}`;
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // Simulate progressive upload
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
      }

      const uploadedFile: UploadedFile = {
        id: fileId,
        file,
        preview: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
        name: file.name,
        lastModified: file.lastModified
      };

      newUploadedFiles.push(uploadedFile);
      announceToScreenReader(`File ${file.name} uploaded successfully`);
    });

    await Promise.all(uploadPromises);

    if (errors.length > 0) {
      errors.forEach(error => {
        addNotification({
          type: 'error',
          title: 'Upload failed',
          message: error
        });
      });
    }

    if (newUploadedFiles.length > 0) {
      const updatedFiles = [...files, ...newUploadedFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
      
      addNotification({
        type: 'success',
        title: 'Upload complete',
        message: `${newUploadedFiles.length} file(s) uploaded successfully`
      });
    }

    setIsUploading(false);
    setUploadProgress({});
  }, [files, maxFiles, validateFile, onFilesChange, addNotification, announceToScreenReader]);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
    setIsDragOver(true);
    announceToScreenReader('Drag over upload area');
  }, [announceToScreenReader]);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    // Only deactivate if leaving the entire drop zone
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragActive(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setIsDragOver(false);

    const droppedFiles = e.dataTransfer?.files;
    if (droppedFiles && droppedFiles.length > 0) {
      announceToScreenReader(`Dropped ${droppedFiles.length} file(s)`);
      processFiles(droppedFiles);
    }
  }, [processFiles, announceToScreenReader]);

  const handleFileInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
    // Reset input value to allow re-selecting the same files
    e.target.value = '';
  }, [processFiles]);

  const handleRemoveFile = useCallback((fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      URL.revokeObjectURL(file.preview);
      const updatedFiles = files.filter(f => f.id !== fileId);
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
      
      announceToScreenReader(`File ${file.name} removed`);
      addNotification({
        type: 'info',
        title: 'File removed',
        message: `${file.name} has been removed`
      });
    }
  }, [files, onFilesChange, announceToScreenReader, addNotification]);

  const handleRemoveAllFiles = useCallback(() => {
    files.forEach(file => URL.revokeObjectURL(file.preview));
    setFiles([]);
    onFilesChange([]);
    
    announceToScreenReader('All files removed');
    addNotification({
      type: 'info',
      title: 'All files removed',
      message: 'All uploaded files have been cleared'
    });
  }, [files, onFilesChange, announceToScreenReader, addNotification]);

  const handlePreviewClick = useCallback((file: UploadedFile) => {
    window.open(file.preview, '_blank', 'noopener,noreferrer');
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const dropZoneClasses = `
    relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer
    ${isDragActive 
      ? 'border-blue-400 bg-blue-50 dark:border-blue-300 dark:bg-blue-900/20 scale-105' 
      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
    }
    ${isDragOver ? 'ring-4 ring-blue-200 dark:ring-blue-800' : ''}
    ${isUploading ? 'opacity-75 cursor-not-allowed' : ''}
    focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500
  `;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        {files.length > 0 && (
          <button
            onClick={handleRemoveAllFiles}
            className="btn btn-secondary text-sm"
            aria-label="Remove all files"
            disabled={isUploading}
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            Clear All
          </button>
        )}
      </div>

      <div
        ref={dropZoneRef}
        className={dropZoneClasses}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="File upload area. Click or drag files here to upload."
        aria-describedby="upload-instructions"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            !isUploading && fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedFormats.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          aria-hidden="true"
          disabled={isUploading}
        />
        
        <div id="upload-instructions" className="sr-only">
          Supported formats: {acceptedFormats.join(', ')}. 
          Maximum file size: {maxFileSize}MB. 
          Maximum files: {maxFiles}.
          Keyboard shortcut: Ctrl+U to open file picker.
        </div>

        {isUploading ? (
          <div className="space-y-4">
            <div className="animate-pulse">
              <UploadIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white">Uploading files...</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Please wait while we process your files</p>
            </div>
            {Object.entries(uploadProgress).map(([fileId, progress]) => (
              <div key={fileId} className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                or <span className="text-blue-600 dark:text-blue-400 font-medium">click to browse</span>
              </p>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>Supported: {acceptedFormats.map(format => format.split('/')[1].toUpperCase()).join(', ')}</p>
              <p>Max size: {maxFileSize}MB • Max files: {maxFiles}</p>
            </div>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Uploaded files ({files.length})
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {(files.reduce((total, file) => total + file.size, 0) / (1024 * 1024)).toFixed(1)}MB total
            </span>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="flex-shrink-0">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-10 h-10 object-cover rounded-md"
                        loading="lazy"
                      />
                    ) : (
                      <FileIcon className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / (1024 * 1024)).toFixed(1)}MB • {file.type.split('/')[1].toUpperCase()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePreviewClick(file)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label={`Preview ${file.name}`}
                    title="Preview file"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    aria-label={`Remove ${file.name}`}
                    title="Remove file"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};