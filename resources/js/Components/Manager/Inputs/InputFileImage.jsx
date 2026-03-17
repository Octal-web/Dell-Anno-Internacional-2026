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
            
            // Calcula o scale para preencher completamente o tamanho desejado
            const scaleX = size.largura / originalWidth;
            const scaleY = size.altura / originalHeight;
            const scale = Math.max(scaleX, scaleY); // Usa o maior scale para preencher
            
            const scaledWidth = originalWidth * scale;
            const scaledHeight = originalHeight * scale;
            
            // Centraliza a imagem
            const offsetX = (size.largura - scaledWidth) / 2;
            const offsetY = (size.altura - scaledHeight) / 2;

            canvas.width = size.largura;
            canvas.height = size.altura;
            const ctx = canvas.getContext('2d');
            
            // Remove o preenchimento branco - a imagem vai preencher todo o canvas
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            ctx.drawImage(
                image, 
                Math.round(offsetX), 
                Math.round(offsetY), 
                Math.round(scaledWidth), 
                Math.round(scaledHeight)
            );

            canvas.toBlob(blob => {
                if (!blob) {
                    console.error('Canvas is empty');
                    return;
                }

                blob.name = `resizedImage.${extension}`;
                onImageCrop(blob, extension, name);
            }, `image/${extension}`, 0.95);
        };
    };

    const getCroppedImg = (image, crop, extension) => {
        const canvas = document.createElement('canvas');
        
        return new Promise((resolve, reject) => {
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            // Coordenadas do crop na imagem original
            const cropX = crop.x * scaleX;
            const cropY = crop.y * scaleY;
            const cropWidth = crop.width * scaleX;
            const cropHeight = crop.height * scaleY;

            // Garante que as coordenadas estão dentro dos limites
            const safeX = Math.max(0, Math.min(cropX, image.naturalWidth));
            const safeY = Math.max(0, Math.min(cropY, image.naturalHeight));
            const safeWidth = Math.min(cropWidth, image.naturalWidth - safeX);
            const safeHeight = Math.min(cropHeight, image.naturalHeight - safeY);

            const ctx = canvas.getContext('2d');
            canvas.width = size.largura;
            canvas.height = size.altura;

            // Configurações de qualidade
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Calcula o scale para preencher completamente o canvas
            const scaleToFitX = size.largura / safeWidth;
            const scaleToFitY = size.altura / safeHeight;
            const scaleToFit = Math.max(scaleToFitX, scaleToFitY); // Usa o maior para preencher

            const scaledWidth = safeWidth * scaleToFit;
            const scaledHeight = safeHeight * scaleToFit;

            // Centraliza a imagem escalada
            const offsetX = (size.largura - scaledWidth) / 2;
            const offsetY = (size.altura - scaledHeight) / 2;

            // Remove qualquer preenchimento e desenha a imagem
            ctx.clearRect(0, 0, size.largura, size.altura);
            
            ctx.drawImage(
                image,
                Math.floor(safeX),
                Math.floor(safeY),
                Math.ceil(safeWidth),
                Math.ceil(safeHeight),
                Math.floor(offsetX),
                Math.floor(offsetY),
                Math.ceil(scaledWidth),
                Math.ceil(scaledHeight)
            );

            canvas.toBlob(blob => {
                if (!blob) {
                    console.error('Canvas is empty');
                    return;
                }

                blob.name = `croppedImage.${extension}`;
                resolve(blob);
            }, `image/${extension}`, 0.95);
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
                    <div className="border border-gray-300 max-w-md mb-1 w-fit">
                        <img src={imagem} className="bg-checkered max-h-[70vh]" alt="Imagem atual" />
                    </div>
                ) : (
                    allowCrop ? (
                        <ReactCrop
                            crop={crop}
                            onChange={onCropChange}
                            aspect={size.largura / size.altura}
                            onComplete={onCropComplete}
                        >
                            <img src={selectedFile} alt="Selected" onLoad={onImageLoad} className="border bg-checkered" />
                        </ReactCrop>
                    ) : (
                        <img src={selectedFile} alt="Selected" className="border bg-checkered" />
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