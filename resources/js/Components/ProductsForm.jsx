import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';

import Select from 'react-select';

import AnimatedCheckMark from './AnimatedCheckMark';

export const ProductsForm = ({ content }) => {
    const { message, estados } = usePage().props;

    const [showInfo, setShowInfo] = useState(false);
    const [cities, setCities] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        nome: '',
        email: '',
        telefone: '',
        ocupacao: '',
        cidade_id: '',
        estado_id: '',
        mensagem: '',
        politica: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
        clearErrors(name);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('Contato.enviar'), {
            preserveScroll: true
        });
    };

    const loadCities = async (stateId) => {
        if (!stateId) return;

        setIsProcessing(true);

        try {
            const response = await axios.post(route('Cidades.carregar'), {
                estado_id: stateId,
            });

            if (response.data) {
                setCities(response.data.cidades);
            }
        } catch (error) {
            console.error('Error loading cities:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {  
        if (message && message.type === 'success') {
            setIsSuccessful(true);

            setTimeout(() => {
                setData({
                    nome: '',
                    email: '',
                    telefone: '',
                    ocupacao: '',
                    cidade_id: '',
                    estado_id: '',
                    mensagem: '',
                    policy: false,
                });

                setIsSuccessful(false);
            }, 3000);
        }
    }, [message]);

    return (
        <section className="relative mb-20 md:mb-30">
            <div className="container max-w-x-large">
                <h2 className="text-3xl sm:text-4xl 2xl:text-[45px] font-light uppercase leading-snug sm:tracking-wider mb-6 pt-16 md:pt-24 2xl:pt-36 border-t">{content.titulo}</h2>
                <div className="font-secondary font-light leading-relaxed tracking-wide max-w-[1250px] mb-16 md:mb-20 2xl:mb-28" dangerouslySetInnerHTML={{ __html: content.texto }} />
                
                <form
                    className="relative"
                    onSubmit={handleSubmit}
                >
                    <div className="mb-3 md:mb-5 min-[1440px]:mb-7 flex gap-3 md:gap-10 lg:gap-16 flex-col lg:flex-row">
                        <div className="w-full lg:w-1/2">
                            <label htmlFor="nome" className="inline-block font-secondary text-neutral-600 2xl:mb-2">Name</label>
                            <input type="text" name="nome" value={data.nome} onChange={handleChange} placeholder="Your full name" className="w-full h-12 px-0 font-secondary border-0 border-b border-b-gray-300 focus:outline-none focus:ring-0 focus:border-b-black focus:shadow-inner transition-colors duration-200 placeholder:text-gray-500 placeholder:text-opacity-50"  />
                            {errors.nome && <p className="text-xs text-white bg-red-900 px-3 py-1.5 mt-2">{errors.nome}</p>}
                        </div>

                        <div className="w-full lg:w-1/2">
                            <label htmlFor="email" className="inline-block font-secondary text-neutral-600 2xl:mb-2">Email</label>
                            <input type="text" name="email" value={data.email} onChange={handleChange} placeholder="Your email" className="w-full h-12 px-0 font-secondary border-0 border-b border-b-gray-300 focus:outline-none focus:ring-0 focus:border-b-black focus:shadow-inner transition-colors duration-200 placeholder:text-gray-500 placeholder:text-opacity-50" />
                            {errors.email && <p className="text-xs text-white bg-red-900 px-3 py-1.5 mt-2">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="mb-3 md:mb-5 min-[1440px]:mb-7 flex gap-3 md:gap-10 lg:gap-16 flex-col lg:flex-row">
                        <div className="w-full lg:w-1/2">
                            <label htmlFor="telefone" className="inline-block font-secondary text-neutral-600 2xl:mb-2">Phone</label>
                            <input type="text" name="telefone" value={data.telefone} onChange={handleChange} placeholder="Your phone number" className="w-full h-12 px-0 font-secondary border-0 border-b border-b-gray-300 focus:outline-none focus:ring-0 focus:border-b-black focus:shadow-inner transition-colors duration-200 placeholder:text-gray-500 placeholder:text-opacity-50" />
                            {errors.telefone && <p className="text-xs text-white bg-red-900 px-3 py-1.5 mt-2">{errors.telefone}</p>}
                        </div>

                        <div className="w-full lg:w-1/2">
                            <label htmlFor="ocupacao" className="inline-block font-secondary text-neutral-600 2xl:mb-2">Job Title</label>
                            <input type="text" name="ocupacao" value={data.ocupacao} onChange={handleChange} placeholder="Your current job" className="w-full h-12 px-0 font-secondary border-0 border-b border-b-gray-300 focus:outline-none focus:ring-0 focus:border-b-black focus:shadow-inner transition-colors duration-200 placeholder:text-gray-500 placeholder:text-opacity-50"  />
                            {errors.ocupacao && <p className="text-xs text-white bg-red-900 px-3 py-1.5 mt-2">{errors.ocupacao}</p>}
                        </div>
                    </div>

                    <div className="mb-3 md:mb-5 min-[1440px]:mb-7 flex gap-3 md:gap-10 lg:gap-16 flex-col lg:flex-row">
                        <div className="w-full lg:w-1/2">
                            <label htmlFor="estado_id" className="inline-block font-secondary text-neutral-600 2xl:mb-2">State</label>
                            <div data-lenis-prevent={true}>
                                <Select
                                    id="estado_id"
                                    name="estado_id"
                                    options={estados}
                                    value={estados.find(option => option.value === data.estado_id) || null}
                                    onChange={(selected) => {
                                        setData('estado_id', selected?.value || '');
                                        setData('cidade_id', '');
                                        setCities([]);
                                        clearErrors('estado_id');
                                        if (selected) loadCities(selected.value);
                                    }}
                                    isDisabled={processing}
                                    placeholder="Select a state"
                                    classNamePrefix="signup-select"
                                />
                            </div>
                            {errors.estado_id && <p className="text-xs text-white bg-red-900 px-3 py-1.5 mt-2">{errors.estado_id}</p>}
                        </div>

                        <div className="w-full lg:w-1/2">
                            <label htmlFor="cidade_id" className="inline-block font-secondary text-neutral-600 2xl:mb-2">City</label>
                            <div className="relative" data-lenis-prevent={true}>
                                <Select
                                    id="cidade_id"
                                    name="cidade_id"
                                    options={cities}
                                    value={
                                        cities.flatMap(group => group.options).find(option => option.value === data.cidade_id) || null
                                    }
                                    onChange={(selected) => {
                                        setData('cidade_id', selected?.value || '')
                                        clearErrors('cidade_id');
                                    }}
                                    isDisabled={!data.estado_id || processing}
                                    placeholder={!data.estado_id ? 'Select a state first' : 'Select a city'}
                                    classNamePrefix="signup-select"
                                />
                                {isProcessing ? (
                                    <div role="status" className="absolute top-3 right-10">
                                        <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin fill-black" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                ) : null}
                            </div>
                            {errors.cidade_id && <p className="text-xs text-white bg-red-900 px-3 py-1.5 mt-2">{errors.cidade_id}</p>}
                        </div>
                    </div>

                    <div className="mb-3 md:mb-5 min-[1440px]:mb-7 flex gap-3 md:gap-10 lg:gap-16 flex-col lg:flex-row">
                        <div className="w-full">
                            <label htmlFor="mensagem" className="inline-block font-secondary text-neutral-600 2xl:mb-2">Tell us about your ideal project</label>
                            <textarea name="mensagem" value={data.mensagem} onChange={handleChange} placeholder="For example : number of total spaces, if a returning customer, a single family home, condo/apt or trade project" className="w-full h-40 2xl:h-48 resize-none px-0 font-secondary border-0 border-b border-b-gray-300 focus:outline-none focus:ring-0 focus:border-b-black focus:shadow-inner transition-colors duration-200 placeholder:text-gray-500 placeholder:text-opacity-50" />
                            {errors.mensagem && <p className="text-xs text-white bg-red-900 px-3 py-1.5 mt-2">{errors.mensagem}</p>}
                        </div>
                    </div>

                    <div className="mb-3 md:mb-5 min-[1440px]:mb-7 flex gap-3 md:gap-10 lg:gap-16 flex-col lg:flex-row">
                        <div className="">
                            <label className="flex items-center">
                                <label className="relative flex">
                                    <input type="checkbox" name="politica" checked={data.politica} onChange={handleChange} className="peer w-5 h-5 bg-white border-2 border-neutral-500 checked:bg-white checked:border-neutral-600 checked:bg-[length:0_0] checked:hover:bg-white checked:hover:border-neutral-600 checked:focus:bg-white checked:focus:border-neutral-600 !outline-0 !ring-0 !ring-offset-0" />
                                    <span className="peer-checked:content-[''] peer-checked:absolute peer-checked:inset-1 peer-checked:bg-black" />
                                </label>

                                <span className="max-sm:text-sm ml-2">
                                    I have read and agree to the{' '}
                                    <button
                                      type="button"
                                      onClick={() => setShowInfo(!showInfo)}
                                      className="underline focus:outline-none"
                                    >
                                      terms and conditions.
                                    </button>
                                </span>
                            </label>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    showInfo ? 'max-h-40 mt-2' : 'max-h-0'
                                }`}
                              >
                                <p className="text-xs text-neutral-700 bg-neutral-100 p-4">
                                    By submitting, you confirm the integrity of the information provided in this form and authorize UNICASA to verify such data. Be aware that filling in the state does not imply commitment for both parties.<br />
                                    In particular, it does not oblige them to sign any document or affirmation; the information provided here is merely registered and strictly commercial. Unicasa undertakes to process your data provided in the form following the CCPA Law, being securely deleted after the necessary time. For more information, please consult our Privacy Policy on <a href="https://www.dellanno.com/cookie-policy/" target="_blank" rel="noopener noreferrer" className="underline">www.dellanno.com/cookie-policy/</a>.
                                </p>
                            </div>
                            {errors.politica && <p className="text-xs text-white bg-red-900 px-3 py-1.5 mt-2">{errors.politica}</p>}
                        </div>
                    </div>

                    <div className="mb-3 md:mb-5 min-[1440px]:mb-7 flex gap-3 md:gap-10 lg:gap-16 flex-col lg:flex-row">
                        <button
                            type="submit"
                            className="relative block bg-black px-10 py-3 mt-10 text-[15px] text-white font-medium uppercase transition-all hover:shadow hover:scale-105"
                        >
                            {!processing ? (
                                'Book a Design Consultation'
                            ) : (
                                <>
                                    <div role="status" className="absolute inset-0 flex justify-center items-center">
                                        <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin fill-black" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    <span className="opacity-0">Book a Design Consultation</span>
                                </>
                            )}
                        </button>
                    </div>
                        
                    {isSuccessful && (
                        <div className={`absolute inset-0 flex flex-col items-center justify-center bg-white pointer-events-none animate-fade-in-down`}>
                            <AnimatedCheckMark />

                            <h2 className="text-eng-primary text-4xl text-center font-semibold mt-4 mb-2">Successo!</h2>
                            <h4 className="font-secondary text-eng-tertiary text-2xl text-center">Sua mensagem foi enviada. Entraremos em contato em breve.</h4>
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
};