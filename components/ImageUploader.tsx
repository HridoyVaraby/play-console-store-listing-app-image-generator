
import React, { useState, useCallback, useEffect } from 'react';
import { UploadedFile } from '../types';
import { MAX_FILE_SIZE, MAX_UPLOAD_COUNT, SUPPORTED_FORMATS } from '../constants';
import { UploadIcon, TrashIcon } from './Icons';

interface ImageUploaderProps {
    title: string;
    description: string;
    onFilesChange: (files: UploadedFile[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ title, description, onFilesChange }) => {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        onFilesChange(files);
    }, [files, onFilesChange]);

    const handleFiles = useCallback((incomingFiles: FileList | null) => {
        if (!incomingFiles) return;

        setError(null);
        let newFiles: UploadedFile[] = [...files];
        let errorMessages: string[] = [];

        for (let i = 0; i < incomingFiles.length; i++) {
            const file = incomingFiles[i];

            if (newFiles.length >= MAX_UPLOAD_COUNT) {
                errorMessages.push(`Cannot upload more than ${MAX_UPLOAD_COUNT} images.`);
                break;
            }
            if (!SUPPORTED_FORMATS.includes(file.type)) {
                errorMessages.push(`File type not supported for ${file.name}.`);
                continue;
            }
            if (file.size > MAX_FILE_SIZE) {
                errorMessages.push(`${file.name} exceeds the 10MB size limit.`);
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
        
        setFiles(newFiles);

        if (errorMessages.length > 0) {
            setError(errorMessages.join(' '));
        }

    }, [files]);

    const removeFile = (id: string) => {
        const fileToRemove = files.find(f => f.id === id);
        if (fileToRemove) {
            URL.revokeObjectURL(fileToRemove.preview);
        }
        setFiles(files.filter(f => f.id !== id));
    };

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
        setIsDragging(true); // Keep it true while dragging over
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

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-gray-400 mt-1 mb-4">{description}</p>
            
            <div
                className={`flex-grow border-2 border-dashed rounded-lg p-6 text-center flex flex-col justify-center items-center transition-colors duration-300 ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'}`}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                <UploadIcon className="w-12 h-12 text-gray-500 mb-2" />
                <p className="text-gray-400 mb-2">Drag & drop files here, or</p>
                <label htmlFor={`file-upload-${title.replace(/\s+/g, '-')}`} className="cursor-pointer font-semibold text-blue-400 hover:text-blue-300">
                    click to browse
                    <input id={`file-upload-${title.replace(/\s+/g, '-')}`} name="file-upload" type="file" className="sr-only" multiple accept={SUPPORTED_FORMATS.join(',')} onChange={onFileChange} />
                </label>
                {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
            </div>

            {files.length > 0 && (
                <div className="mt-6">
                    <h4 className="font-semibold text-gray-300 mb-2">Previews ({files.length}/{MAX_UPLOAD_COUNT})</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-64 overflow-y-auto pr-2">
                        {files.map((uploadedFile) => (
                            <div key={uploadedFile.id} className="relative group aspect-video">
                                <img src={uploadedFile.preview} alt={uploadedFile.file.name} className="w-full h-full object-cover rounded-md" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center">
                                    <button onClick={() => removeFile(uploadedFile.id)} className="text-red-500 hover:text-red-400 p-2 rounded-full bg-black/50">
                                        <TrashIcon className="w-6 h-6" />
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
