import React, { useState, useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import ImageResizeWithCaption from '@pentestpad/tiptap-extension-figure';
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Text from '@tiptap/extension-text'
import { Underline } from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';

import { ImageUploadModal } from './ImageUploadModal';
 
export const InputTipTapEditor = ({ title, name, toolbar = [], value, idioma, onChange, max = null }) => { 
    const [showGrid, setShowGrid] = useState(false); 
    const gridRef = useRef(null); 
    const [hoveredCell, setHoveredCell] = useState(null); 
    const [selectedTable, setSelectedTable] = useState(null);  
 
    const [showLinkModal, setShowLinkModal] = useState(false); 
    const [linkUrl, setLinkUrl] = useState(''); 
    const [openInNewTab, setOpenInNewTab] = useState(true); 
 
    const [showImageModal, setShowImageModal] = useState(false);
    
    const [contentLength, setContentLength] = useState(0);

    const editor = useEditor({ 
        extensions: [ 
            StarterKit, 
            Underline, 
            ImageResizeWithCaption.configure({
                resize: {
                    minWidth: 100,
                    maxWidth: 1000,
                    step: 10,
                }
            }),
            Table, 
            TableRow, 
            TableCell, 
            TableHeader, 
            Link.configure({ 
                openOnClick: false, 
                linkOnPaste: true, 
            }), 
        ], 
        content: value, 
        onUpdate: ({ editor }) => { 
            const content = editor.getHTML();
            
            const textLength = editor.getText().length;
            setContentLength(textLength);
            
            if (max !== null && textLength > max) {
                editor.commands.undo();
                return;
            }
            
            onChange(name, content); 
        }, 
    }, [name, max]);

    const handleImageSelect = (imageUrl) => {
        editor.chain().focus().setImage({ src: imageUrl }).run();
        setShowImageModal(false);
    };

    const handleInsertTable = (rows, cols) => {
        editor.chain().focus().insertTable({ rows, cols }).run();
        setShowGrid(false);
    };

    const handleMouseEnter = (rowIndex, colIndex) => {
        setHoveredCell({ row: rowIndex, col: colIndex });
    };

    const handleMouseLeave = () => {
        setHoveredCell(null);
    };

    const openLinkModal = () => {
        const linkMark = editor.getAttributes('link');
        if (linkMark.href) {
            setLinkUrl(linkMark.href);
            setOpenInNewTab(linkMark.target === '_blank');
        } else {
            setLinkUrl('');
            setOpenInNewTab(true);
        }
        setShowLinkModal(true);
    };

    const insertLink = () => {
        if (linkUrl) {
            const attrs = { 
                href: linkUrl,
                target: openInNewTab ? '_blank' : null,
                rel: openInNewTab ? 'noopener noreferrer' : null,
            };
            
            if (editor.state.selection.empty) {
                editor.chain().focus().insertContent({
                    type: 'text',
                    text: linkUrl,
                }).run();
                editor.chain().focus().setTextSelection({
                    from: editor.state.selection.from - linkUrl.length,
                    to: editor.state.selection.from
                }).run();
            }
            
            editor.chain().focus().setLink(attrs).run();
        } else {
            editor.chain().focus().unsetLink().run();
        }
        
        setShowLinkModal(false);
    };

    const removeLink = () => {
        editor.chain().focus().unsetLink().run();
        setShowLinkModal(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (gridRef.current && !gridRef.current.contains(event.target)) {
                setShowGrid(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    if (!editor) {
        return null;
    }

    return (
        <div className="mb-6">
            <div className="flex items-center mb-2">
                <img src={`/admin/img/flags/${idioma}.png`} className="w-5 mr-1" alt={`${idioma} flag`} />
                <label className="block font-bold text-gray-500">{title}</label>
            </div>

            <div className="border">
                <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b">
                    {toolbar.includes('Heading') && (
                        <div className="flex border-r pr-2 mr-1">
                            <select
                                onChange={(e) => {
                                    const level = parseInt(e.target.value, 10);
                                    editor.chain().focus().toggleHeading({ level }).run();
                                }}
                                className="py-1 px-2 rounded border bg-white h-8 w-40 leading-none"
                                title="Selecione o título"
                            >
                                <option value={1} className="text-2xl">Título 1</option>
                                <option value={2} className="text-xl">Título 2</option>
                                <option value={3} className="text-md">Título 3</option>
                                <option value={4} className="text-base">Título 4</option>
                                <option value={5} className="text-sm">Título 5</option>
                            </select>
                        </div>
                    )}
                    
                    <div className="flex border-r pr-2 mr-1">
                        {toolbar.includes('Bold') && (
                            <button
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200 text-blue-600' : ''}`}
                                title="Negrito"
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
                                </svg>
                            </button>
                        )}
                    
                        {toolbar.includes('Italic') && (
                            <button
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200 text-blue-600' : ''}`}
                                title="Itálico"
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
                                </svg>
                            </button>
                        )}

                        {toolbar.includes('Underline') && (
                            <button
                                onClick={() => editor.chain().focus().toggleUnderline().run()}
                                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-200 text-blue-600' : ''}`}
                                title="Sublinhado"
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57s-2.687-1.08-2.687-2.57zM12.5 15h-9v-1h9z"></path>
                                </svg>
                            </button>
                        )}
                    </div>

                    {toolbar.includes('List') && (
                        <>
                            <button
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200 text-blue-600' : ''}`}
                                title="Lista com marcadores"
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                </svg>
                            </button>
                            
                            <button
                                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200 text-blue-600' : ''}`}
                                title="Lista numerada"
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"/>
                                </svg>
                            </button>
                        </>
                    )}

                    {toolbar.includes('Link') && (
                        <>
                            <button
                                onClick={openLinkModal}
                                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200 text-blue-600' : ''}`}
                                title="Inserir link"
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                                    <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
                                </svg>
                            </button>

                            {showLinkModal && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="animate-fade-in-down [animation-duration:_0.1s] rounded-sm border border-stroke bg-white w-full max-w-md p-8 shadow-md relative">
                                        <h3 className="text-lg font-medium mb-4">Inserir link</h3>
                                        
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">URL do link</label>
                                            <input 
                                                type="text" 
                                                value={linkUrl} 
                                                onChange={(e) => setLinkUrl(e.target.value)}
                                                placeholder="https://exemplo.com" 
                                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                autoFocus
                                            />
                                        </div>
                                        
                                        <div className="mb-4 flex items-center">
                                            <input 
                                                type="checkbox" 
                                                id="newTab" 
                                                checked={openInNewTab} 
                                                onChange={(e) => setOpenInNewTab(e.target.checked)} 
                                                className="mr-2"
                                            />
                                            <label htmlFor="newTab" className="text-sm text-gray-700">Abrir em nova guia</label>
                                        </div>
                                        
                                        <div className="flex justify-end space-x-2">
                                            {editor.isActive('link') && (
                                                <button 
                                                    onClick={removeLink}
                                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                                >
                                                    Remover link
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => setShowLinkModal(false)}
                                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                            >
                                                Cancelar
                                            </button>
                                            <button 
                                                onClick={insertLink}
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Confirmar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    
                    {toolbar.includes('Image') && (
                        <>
                            <span className="border-l h-8 ml-1" />
                            <button
                                className="p-2 rounded hover:bg-gray-200 ml-1"
                                title="Inserir Imagem"
                                type="button"
                                onClick={() => setShowImageModal(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                    <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
                                </svg>
                            </button>

                            {showImageModal && (
                                <ImageUploadModal 
                                    onImageSelect={handleImageSelect}
                                    onClose={() => setShowImageModal(false)}
                                />
                            )}
                        </>
                    )}

                    {toolbar.includes('Table') && (
                        <>
                            <div>
                                <button
                                    ref={gridRef}
                                    onClick={() => setShowGrid(!showGrid)}
                                    className="flex gap-1 items-center p-2 rounded hover:bg-gray-200"
                                    title="Inserir Tabela"
                                    type="button"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z" />
                                    </svg>

                                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M12.293 6.293a1 1 0 0 0-1.414 0L8 9.586 5.121 6.707a1 1 0 0 0-1.414 1.414l3.5 3.5a1 1 0 0 0 1.414 0l3.5-3.5a1 1 0 0 0 0-1.414z" />
                                    </svg>
                                </button>
                                {showGrid && (
                                    <div className="absolute bg-white border p-2 shadow-md mt-2 z-[1]">
                                        <table className="border-collapse">
                                            <tbody>
                                                {Array.from({ length: 10 }, (_, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                        {Array.from({ length: 10 }, (_, colIndex) => (
                                                            <td
                                                                key={colIndex}
                                                                className={`w-4 h-4 border cursor-pointer ${
                                                                    (rowIndex <= hoveredCell?.row && colIndex <= hoveredCell?.col) && 'bg-blue-200'
                                                                }`}
                                                                onClick={() => {
                                                                    const rows = rowIndex + 1;
                                                                    const cols = colIndex + 1;
                                                                    handleInsertTable(rows, cols);
                                                                }}
                                                                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                                                                onMouseLeave={handleMouseLeave}
                                                            />
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <span className={`block text-center${!hoveredCell ? ' opacity-0' : ''}`}>{`${hoveredCell?.row} x ${hoveredCell?.col}`}</span>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    
                    <div className="flex">
                        <button
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
                            title="Desfazer"
                            type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
                            </svg>
                        </button>
                        
                        <button
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
                            title="Refazer"
                            type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div className="p-3 min-h-40 overflow-auto max-h-screen">
                    <EditorContent editor={editor} className="[&_.ProseMirror]:min-h-[8.5em] [&_p]:text-sm [&_h1]:text-4xl [&_h2]:text-3xl [&_h3]:text-2xl [&_h4]:text-xl [&_h5]:text-base [&_th]:border [&_td]:border [&_ul]:list-inside [&_li]:list-disc [&_ul>li>p]:contents [&_a]:underline [&_a]:text-blue-500 [&_.ProseMirror-focused]:outline-none" />
                </div>
            </div>
        </div>
    );
};