import React, { useState, useEffect, useRef } from 'react';
import { Link, useForm } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

import { ConfirmModal } from './ConfirmModal';

export const IndividualItem = ({ individualContent, imagensPath, imagensClass, controller, index, edit }) => {
    const [isChecked, setIsChecked] = useState(individualContent.visivel || false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cellWidths, setCellWidths] = useState([]);
    const rowRef = useRef(null);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        visivel: isChecked
    });

    useEffect(() => {
        const adjustCellWidths = () => {
            if (rowRef.current) {
                const widths = Array.from(rowRef.current.children).map(cell => cell.offsetWidth);
                setCellWidths(widths);
            }
        };

        adjustCellWidths();
        window.addEventListener('resize', adjustCellWidths);

        return () => {
            window.removeEventListener('resize', adjustCellWidths);
        };
    }, []);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        setLoading(true);

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
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <tr ref={rowRef} className="bg-slate-50">
            <td className="border px-4 w-1/6 py-4" width={`${cellWidths[0] || 'auto'}`}>{index + 1}</td>
            <td className="border px-4 py-4 [&_br]:hidden" width={cellWidths[1] || 'auto'} dangerouslySetInnerHTML={{ __html: individualContent.titulo || individualContent.nome }} />

            <td className="border px-4 py-4 w-1/6" width={`${cellWidths[2] || 'auto'}`}>
                {edit ?
                    <label className="cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isChecked} 
                            onChange={handleCheckboxChange}
                            className="sr-only peer"
                            disabled={loading}
                        />
                        <div className={`relative w-9 h-5 ${loading ? 'opacity-50' : ''} bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600`} />
                    </label>
                :
                    individualContent.data
                }
            </td>
            <td className="border max-sm:text-center px-2 md:px-4 py-2 w-1/6 sort-ignore" width={`${cellWidths[3] || 'auto'}`}>
                {edit ?
                    <Link href={route('Manager.' + controller + '.editar', { id: individualContent.id })} className="h-5 w-5 relative mr-4 z-[1] before:content-[''] before:absolute before:-top-[8px] before:-left-[10px] before:w-9 before:h-9 before:bg-slate-200 before:rounded-full before:-mt-[-2px] before:-z-[1] before:transition-all before:transform before:scale-0 hover:before:scale-100">
                        <FontAwesomeIcon icon={faEdit} className="text-slate-700" />
                    </Link>
                :
                    <Link href={route('Manager.' + controller + '.visualizar', { id: individualContent.id })} className="h-5 w-5 relative mr-4 z-[1] before:content-[''] before:absolute before:-top-[8px] before:-left-[10px] before:w-9 before:h-9 before:bg-slate-200 before:rounded-full before:-mt-[-2px] before:-z-[1] before:transition-all before:transform before:scale-0 hover:before:scale-100">
                        <FontAwesomeIcon icon={faEye} className="text-slate-700" />
                    </Link>
                }
                <button className="h-5 w-5 relative z-[1] before:content-[''] before:absolute before:-top-[7px] before:-left-[8px] before:w-9 before:h-9 before:bg-slate-200 before:rounded-full before:-mt-[-2px] before:-z-[1] before:transition-all before:transform before:scale-0 hover:before:scale-100" onClick={() => openModal(individualContent.id)} disabled={loading}>
                    <FontAwesomeIcon icon={faTrash} className="text-red-700" />
                </button>

                {isModalOpen && <ConfirmModal icon={faTrash} closeModal={closeModal} type="delete" confirm={route('Manager.' + controller + '.excluir', {id: individualContent.id})} />}
            </td>
        </tr>
    );
};
