import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCrop } from '@fortawesome/free-solid-svg-icons';
import { ConfirmModal } from './ConfirmModal';
import { CropModal } from './CropModal';

export const IndividualImage = ({ individualContent, imagensPath, imagensClass, controller, crop = true, size = { largura: 800, altura: 600 } }) => {
    const [isChecked, setIsChecked] = useState(individualContent.visivel || false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        visivel: isChecked
    });

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        post(route('Manager.' + controller + '.visibilidade', {id: individualContent.id}), {
            preserveScroll: true,
            onSuccess: (response) => {
                if (response.props.message && response.props.message.type === 'success') {
                    setIsChecked(!isChecked);
                } else {
                    setIsChecked(isChecked);
                }
            },
            onError: () => {
                setIsChecked(isChecked);
            }
        });
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openCropModal = () => {
        setIsCropModalOpen(true);
    };

    const closeCropModal = () => {
        setIsCropModalOpen(false);
    };
    
    return (
        <>
            <div className="group relative flex justify-center overflow-hidden border select-none h-full">
                <div className="absolute inset-0.5 bg-black bg-opacity-0 transition-all group-hover:bg-opacity-20 duration-300"></div>
                <img src={individualContent.imagem} className="w-full p-0.5 object-cover" />
                <ul className={`absolute bg-white top-0.5 right-0.5 grid ${crop ? 'grid-cols-3' : 'grid-cols-2'} items-center transition-all translate-x-full group-hover:translate-x-0 sort-ignore`}>
                    <li className="py-1.5 px-1 h-full flex items-center hover:bg-gray-100">
                        <label className="cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isChecked} 
                                onChange={handleCheckboxChange}
                                className="sr-only peer"
                            />
                            <div className="relative w-6 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-[8px] rtl:peer-checked:after:-translate-x-[5px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </li>
                    
                    {crop && (
                        <li className="py-1.5 px-1 flex justify-center items-center hover:bg-gray-100">
                            <button className="h-5 w-5 relative z-[1]" onClick={openCropModal}>
                                <FontAwesomeIcon icon={faCrop} className="block mx-auto text-gray-600" />
                            </button>
                        </li>
                    )}
                    
                    <li className="py-1.5 px-1 flex justify-center items-center hover:bg-gray-100">
                        <button className="h-5 w-5 relative z-[1]" onClick={openModal}>
                            <FontAwesomeIcon icon={faTrash} className="block mx-auto text-red-700" />
                        </button>
                    </li>
                </ul>
            </div>
            
            {isModalOpen && <ConfirmModal icon={faTrash} closeModal={closeModal} type="delete" confirm={route('Manager.' + controller + '.excluir', {id: individualContent.id})} />}
            
            {isCropModalOpen && (
                <CropModal 
                    closeModal={closeCropModal}
                    imageUrl={individualContent.imagem_completa}
                    imageId={individualContent.id}
                    cropRoute={route('Manager.' + controller + '.cortar', {id: individualContent.id})}
                    size={size}
                />
            )}
        </>
    );
};