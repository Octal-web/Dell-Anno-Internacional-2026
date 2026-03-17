import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

export const ImageUploader = ({ onUpload, crop, size }) => {
    const [error, setError] = useState(null);

    const resizeAndCropImage = async (file) => {
        try {
            const options = {
                maxWidthOrHeight: 1500,
                useWebWorker: true,
                initialQuality: 1.0,
            };

            const compressedFile = await imageCompression(file, options);

            const img = new Image();
            img.src = URL.createObjectURL(compressedFile);

            return new Promise((resolve) => {
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    const cropWidth = size.largura ?? 1600;
                    const cropHeight = size.altura ?? 900;
                    canvas.width = cropWidth;
                    canvas.height = cropHeight;

                    const ratio = Math.min(
                        img.width / cropWidth,
                        img.height / cropHeight
                    );

                    const cropX = (img.width - cropWidth * ratio) / 2;
                    const cropY = (img.height - cropHeight * ratio) / 2;

                    ctx.drawImage(
                        img,
                        cropX,
                        cropY,
                        cropWidth * ratio,
                        cropHeight * ratio,
                        0,
                        0,
                        cropWidth,
                        cropHeight
                    );

                    canvas.toBlob((blob) => {
                        resolve({ blob, originalFile: file });
                    }, 'image/jpeg', 1.0);
                };
            });
        } catch (error) {
            console.error('Error resizing image:', error);
            setError('Erro ao redimensionar a imagem.');
            return null;
        }
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        setError(null);
        const processedImages = await Promise.all(
            acceptedFiles.map(async (file) => {
                const { blob, originalFile } = await resizeAndCropImage(file);
                return crop ? { original: originalFile } : { resized: blob, original: originalFile };
            })
        );

        onUpload(processedImages);
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        'image/png': ['.png'],
        'image/jpg': ['.jpg'],
        'image/jpeg': ['.jpeg'],
    });

    return (
        <div {...getRootProps()} className="flex flex-col justify-center items-center border-2 border-dashed border-gray-400 p-6 rounded-md cursor-pointer">
            <input {...getInputProps()} />
            {isDragActive ? (
                <p className="text-gray-500 font-bold text-center mb-3">Solte as imagens aqui ...</p>
            ) : (
                <p className="text-gray-500 font-bold text-center mb-3">Arraste e solte os arquivos aqui para enviar</p>
            )}
            <FontAwesomeIcon icon={faCloudUploadAlt} size="3x" className="text-gray-400 my-2" />
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};