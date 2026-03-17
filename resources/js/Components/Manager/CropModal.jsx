import React, { useState, useRef, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

export const CropModal = ({ closeModal, imageUrl, imageId, cropRoute, size = { largura: 800, altura: 600 } }) => {
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const imageRef = useRef(null);
    
    const { data, setData, post, processing } = useForm({
        img: '',
    });

    const onImageLoad = async (e) => {
        imageRef.current = e.currentTarget;
        const { naturalWidth: width, naturalHeight: height } = e.currentTarget;

        const initialCrop = centerCrop(
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

        setCrop(initialCrop);
        setCompletedCrop(initialCrop);

        const croppedBlob = await getCroppedImg(initialCrop);
        if (croppedBlob) {
            setData('img', croppedBlob);
        }
    };

    const onCropChange = (newCrop) => {
        setCrop(newCrop);
    };

    const onCropComplete = async (crop) => {
        setCompletedCrop(crop);
        const croppedBlob = await getCroppedImg(crop);
        if (croppedBlob) {
            setData('img', croppedBlob);
        }
    };

    const getCroppedImg = async () => {
        if (!completedCrop || !imageRef.current) return;

        const image = imageRef.current;
        const canvas = document.createElement('canvas');
        const extension = imageUrl.split('.').pop().toLowerCase();
        
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        
        canvas.width = size.largura;
        canvas.height = size.altura;
        
        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            size.largura,
            size.altura
        );
        
        return new Promise((resolve) => {
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

    const handleSaveCrop = (e) => {
        post(cropRoute, {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
            },
            onError: (errors) => {
                console.error(errors);
            }
        });
    };

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [closeModal]);

    return (
        <div className="sort-ignore fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={closeModal}>
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                <div className="animate-fade-in-down [animation-duration:_0.1s] inline-block align-bottom bg-white text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    Cortar imagem
                                </h3>
                                <div className="mt-2">
                                    <ReactCrop
                                        crop={crop}
                                        onChange={onCropChange}
                                        onComplete={onCropComplete}
                                        aspect={size.largura / size.altura}
                                    >
                                        <img
                                            ref={imageRef}
                                            src={imageUrl}
                                            onLoad={onImageLoad}
                                            className="max-w-full"
                                        />
                                    </ReactCrop>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="block relative w-fit border border-gray-300 px-3 py-2 cursor-pointer transition-all hover:bg-slate-200"
                            onClick={handleSaveCrop}
                            disabled={processing}
                        >
                            <FontAwesomeIcon icon={faSave} className="text-slate-700 mr-2" />
                            {processing ? 'Salvando...' : 'Salvar'}
                        </button>
                        <button
                            type="button"
                            className="flex items-center w-fit border border-red-700 text-red-700 px-3 py-2 mr-3 cursor-pointer transition-all hover:bg-red-100"
                            onClick={closeModal}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};