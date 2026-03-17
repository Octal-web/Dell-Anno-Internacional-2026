import React, { useCallback, useState } from 'react';
import { Link } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes, faFileVideo, faImage, faFile } from '@fortawesome/free-solid-svg-icons';

export const InputFileDropzone = ({ title, name, value, currentFile, onChange, onDelete, type = 'video' }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];

        if (file && isValidFileType(file)) {
            handleFile(file);
        }
    }, []);

    const isValidFileType = (file) => {
        const validVideoTypes = ['video/mp4', 'video/avi', 'video/webm'];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const validFileTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                                'image/vnd.dwg', 'image/vnd.dxf'];

        const validTypes = type === 'video' ? validVideoTypes
            : type === 'image' ? validImageTypes
            : validFileTypes;

        return validTypes.includes(file.type);
    };

    const isValidFileSize = (file) => {
        const maxFileSize = type === 'video' ? 150 * 1024 * 1024
            : type === 'image' ? 20 * 1024 * 1024
            : 50 * 1024 * 1024;

        return file.size <= maxFileSize;
    };

    const handleFile = (file) => {
        if (file && isValidFileType(file) && isValidFileSize(file)) {
            if (type === 'image') {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else if (type === 'video') {
                setPreview(true);
            } else {
                setPreview(false);
            }
            // Change here: Pass the name and file to the onChange handler
            onChange(name, file);
        }
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    };

    const handleDelete = () => {
        setPreview(null);
        onDelete();
    };

    return (
        <div className="mb-6">
            <label className="mb-2 block font-bold text-gray-500">{title}</label>

            <div className="w-full">
                {!value ? (
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed px-4 py-10 text-center cursor-pointer transition-colors ${
                            isDragging ? 'border-black bg-secondary bg-opacity-10' : 'border-gray-300'
                        }`}
                    >
                        <input
                            type="file"
                            accept={
                                type === 'video' 
                                    ? '.mp4,.avi,.mov,.mkv,.webm'
                                    : type === 'image'
                                    ? '.jpg,.jpeg,.png'
                                    : '.pdf,.dwg,.dxf,.doc,.docx,.xls,.xlsx,.ppt,.pptx'
                            }
                            onChange={handleChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-2">
                            <FontAwesomeIcon 
                                icon={faUpload} 
                                className="w-8 h-8 text-gray-400" 
                            />
                            <p className="text-sm text-gray-500">Arraste um arquivo ou clique para selecionar</p>
                            <p className="text-xs text-gray-400">
                                {type === 'video' 
                                    ? 'Formatos suportados: MP4, AVI, MKV, WEBM, MOV (até 150 MB)'
                                    : type === 'image'
                                    ? 'Formatos suportados: JPG, JPEG, PNG (até 20 MB)'
                                    : 'Formatos suportados: PDF, DWG, DXF, DOC, DOCX, XLS, XLSX, PPT, PPTX (até 50 MB)'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="relative border p-4">
                        <button 
                            onClick={handleDelete} 
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <div className="flex items-center gap-3">
                            {type === 'video' ? (
                                <FontAwesomeIcon 
                                    icon={faFileVideo} 
                                    className="w-16 h-16 text-gray-400" 
                                />
                            ) : type === 'image' ? (
                                preview ? (
                                    <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded" />
                                ) : (
                                    <FontAwesomeIcon 
                                        icon={faImage} 
                                        className="w-16 h-16 text-gray-400" 
                                    />
                                )
                            ) : (
                                <FontAwesomeIcon 
                                    icon={faFile} 
                                    className="w-16 h-16 text-gray-400" 
                                />
                            )}
                            <div className="flex-1">
                                <p className="text-sm font-medium">{value.name}</p>
                                <p className="text-xs text-gray-500">{(value.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {currentFile && (
                <a href={currentFile} className="block w-fit text-sm text-blue-700 underline mt-2">Baixar arquivo atual</a>
            )}
        </div>
    );
};