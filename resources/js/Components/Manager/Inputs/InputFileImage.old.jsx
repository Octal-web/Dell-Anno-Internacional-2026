import React, { useState, useCallback, useRef, useEffect, useContext  } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faImage, faTrash } from '@fortawesome/free-solid-svg-icons';

export const InputFileImage = ({ title, name, imagem, size, allowCrop, onImageCrop}) => {
    const [crop, setCrop] = useState(null);
    const [showCurrentImage, setShowCurrentImage] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileExtension, setFileExtension] = useState(null);
    const imageRef = useRef(null);

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            resetAllStates();
            const file = event.target.files[0];
            const fileUrl = URL.createObjectURL(file);
            const extension = file.name.split('.').pop();

            setSelectedFile(fileUrl);
            setFileExtension(extension);

            setShowCurrentImage(false);

            if (!allowCrop) {
                getResizedImg(fileUrl, extension);
            }
        }
    };

    const resetAllStates = () => {
        setCrop(null);
        setSelectedFile(null);
    };

    const removeAll = () => {
        setCrop(null);
        setSelectedFile(null);
        setShowCurrentImage(true);
        setFileExtension(null);
        onImageCrop('', null);
    };

    const onImageLoad = (e) => {
        imageRef.current = e.currentTarget;

        if (allowCrop) {
            const { naturalWidth: width, naturalHeight: height } = e.currentTarget;

            const crop = centerCrop(
                makeAspectCrop(
                    {
                        unit: '%',
                        width: 90,
                    },
                    size.largura / size.altura,
                    width,
                    height
                ),
                width,
                height
            );

            setCrop(crop);
        }
    };

    const onCropComplete = useCallback(async (crop) => {
        if (crop && imageRef.current) {
            const croppedImageUrl = await getCroppedImg(imageRef.current, crop, fileExtension);
            onImageCrop(croppedImageUrl, fileExtension, name);
        }
    }, [onImageCrop, fileExtension, name]);

    const getResizedImg = (imageSrc, extension) => {
        const canvas = document.createElement('canvas');
        const image = document.createElement('img');
        image.src = imageSrc;

        image.onload = () => {
            const originalWidth = image.width;
            const originalHeight = image.height;
            let targetWidth = originalWidth;
            let targetHeight = originalHeight;

            if (originalWidth > originalHeight && originalWidth > size.largura) {
                targetWidth = size.largura;
                targetHeight = (originalHeight * size.largura) / originalWidth;
            } 
            else if (originalHeight > size.altura) {
                targetHeight = size.altura;
                targetWidth = (originalWidth * size.altura) / originalHeight;
            }

            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

            canvas.toBlob(blob => {
                if (!blob) {
                    console.error('Canvas is empty');
                    return;
                }

                blob.name = `resizedImage.${extension}`;
                onImageCrop(blob, extension, name);
            }, `image/${extension}`);
        };
    };

    const getCroppedImg = (image, crop, extension) => {
        const canvas = document.createElement('canvas');
        console.log(extension)
        return new Promise((resolve, reject) => {
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            const ctx = canvas.getContext('2d');
            canvas.width = size.largura;
            canvas.height = size.altura;

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                size.largura,
                size.altura
            );

            canvas.toBlob(blob => {
                if (!blob) {
                    console.error('Canvas is empty');
                    return;
                }

                blob.name = `croppedImage.${extension}`;
                resolve(blob);
            }, `image/${extension}`);
        });
    };

    const onCropChange = (newCrop) => {
        setCrop(newCrop);
    };

    return (
        <div className="mb-6">
            <label className="mb-2 block font-bold text-gray-500">{title}</label>
            <div>
                {showCurrentImage ? (
                    <div className="border border-gray-300 rounded-lg max-w-md mb-1 w-fit">
                        <img src={imagem} className="rounded-lg bg-checkered" alt="Imagem atual" />
                    </div>
                ) : (
                    allowCrop ? (
                        <ReactCrop
                            crop={crop}
                            onChange={onCropChange}
                            aspect={size.largura / size.altura}
                            onComplete={onCropComplete}
                        >
                            <img src={selectedFile} alt="Selected" onLoad={onImageLoad} className="rounded-lg border bg-checkered" />
                        </ReactCrop>
                    ) : (
                        <img src={selectedFile} alt="Selected" className="rounded-lg border bg-checkered" />
                    )
                )}
                {selectedFile ? (
                    <div className="flex mt-2">
                        <div>
                            <label
                                htmlFor={name}
                                className="btn-file block relative w-fit border border-gray-300 px-3 py-2 cursor-pointer transition-all hover:bg-slate-200"
                            >
                                <div className="w-fit">
                                    <FontAwesomeIcon icon={faUndo} className="text-gray-500 mr-1" /> Trocar
                                </div>
                                <input
                                    name={name}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0"
                                />
                            </label>
                        </div>
                        
                        <div>
                            <button
                                htmlFor={name}
                                className="btn-file block relative w-fit border border-bg-red-500 bg-red-500 px-3 py-2 ml-2 cursor-pointer text-white transition-all hover:bg-red-700"
                                onClick={removeAll}
                            >
                                <FontAwesomeIcon icon={faTrash} className="mr-1" /> Remover
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <label
                            htmlFor={name}
                            className="btn-file block relative w-fit border border-gray-300 px-3 py-2 cursor-pointer transition-all hover:bg-slate-200"
                        >
                            <div className="w-fit">
                                <FontAwesomeIcon icon={faImage} className="text-gray-500 mr-1" /> Selecionar imagem
                            </div>
                            <input
                                name={name}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0"
                            />
                        </label>
                    </div>
                )}
                
                <div className="flex items-center space-x-2 text-xs text-gray-700 mt-4">
                    <span className="bg-orange-500 text-white font-bold px-2 py-1 rounded">TAMANHO!</span>
                    <span>A imagem deve ter no mínimo <span className="font-bold">{size.largura}px</span> de largura e <span className="font-bold">{size.altura}px</span> de altura.</span>
                </div>
            </div>
        </div>
    );
};