import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { ConfirmModal } from '@/Components/Manager/ConfirmModal';

const Page = () => {
    const { contato } = usePage().props;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const breadcrumbItems = [
        { label: 'Contato', link: 'Manager.Contato.index' },
    ];

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <AdminLayout>
            <Breadcrumb icon={faEnvelope} items={breadcrumbItems} current="Visualizar" />
            
            <div className="mb-6 border border-stroke bg-white px-5 py-5 shadow-md">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-black">Visualizar Contato</h3>
                </div>

                <div className="mt-10">
                    <div className="flex flex-col gap-y-2">
                        <p><b>Nome</b>: {contato.nome}</p>
                        <p><b>E-mail</b>: {contato.email}</p>
                        <p><b>Departamento</b>: {contato.departamento}</p>
                        <p><b>Assunto</b>: {contato.assunto}</p>
                        <p><b>Mensagem</b>: {contato.mensagem}</p>
                        <p><b>Data</b>: {contato.data }</p>
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    <Link href={route('Manager.Contato.index')} className="block relative w-fit border mr-3 border-gray-300 px-3 py-2 cursor-pointer transition-all hover:bg-slate-200">
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Voltar
                    </Link>

                    <button
                        onClick={() => openModal(contato.id)}
                        className="flex items-center w-fit border border-red-700 text-red-700 px-3 py-2 cursor-pointer transition-all hover:bg-red-100"
                    >   
                        <FontAwesomeIcon icon={faTrash} className="text-red-700 mr-2" />
                        Excluir
                    </button>
                </div>

                {isModalOpen && <ConfirmModal icon={faTrash} closeModal={closeModal} type="delete" confirm={route('Manager.Contato.excluir', {id: contato.id})} />}
            </div>
        </AdminLayout>
    );
};

export default Page;
