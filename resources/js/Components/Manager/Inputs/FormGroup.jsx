import React from 'react';

import { InputText } from './InputText';
import { InputNumber } from './InputNumber';
import { InputTextArea } from './InputTextArea';
import { InputTipTapEditor } from './InputTipTapEditor';
import { InputFileImage } from './InputFileImage';
import { InputCheckbox } from './InputCheckbox';
import { InputSelect } from './InputSelect';
import { InputFileDropzone } from './InputFileDropzone';
import { InputDatetime } from './InputDatetime';
import { InputLink } from './InputLink';
import { InputTag } from './InputTag';

export const FormGroup = ({ input, idioma, imagem, value, toolbar, onChange, handleImageCrop }) => {
    switch (input.tipo) {
        case 'texto':
            return (
                <InputText
                    title={input.titulo}
                    name={input.name}
                    max={input.max}
                    value={value}
                    idioma={idioma.codigo}
                    onChange={onChange}
                />
            );
        case 'texto_longo':
            return (
                input.editor ?
                <InputTipTapEditor
                    title={input.titulo}
                    name={input.name}
                    value={value}
                    max={input.max}
                    idioma={idioma.codigo}
                    toolbar={input.toolbar}
                    onChange={onChange}
                />
                :
                <InputTextArea
                    title={input.titulo}
                    name={input.name}
                    value={value}
                    max={input.max}
                    idioma={idioma.codigo}
                    onChange={onChange}
                />
            );
        case 'numero':
            return (
                <InputNumber
                    title={input.titulo}
                    name={input.name}
                    value={value}
                    min={input.min}
                    max={input.max}
                    idioma={idioma.codigo}
                    onChange={onChange}
                />
            );
        case 'imagem':
            return (
                <InputFileImage 
                    title={input.titulo}
                    name={input.name}
                    imagem={input.imagem ?? '/admin/img/others/select.png'} 
                    size={{ largura: input.largura, altura: input.altura }} 
                    allowCrop={input.crop ? true : false} 
                    onImageCrop={handleImageCrop}
                />
            );
        case 'check':
            return (
                <InputCheckbox
                    title={input.titulo}
                    name={input.name}
                    checked={value}
                    onChange={onChange}
                />
            );
        case 'select':
            return (
                <InputSelect
                    title={input.titulo}
                    name={input.name}
                    value={value}
                    idioma={idioma.codigo}
                    options={input.options}
                    onChange={onChange}
                    isMulti={input.isMulti}
                />
            );
        case 'video':
            return (
                <InputFileDropzone
                    title={input.titulo}
                    type="video"
                    name={input.name}
                    value={value}
                    onChange={onChange}
                    currentFile={input.arquivo}
                    onDelete={() => onChange(input.name, null)}
                />
            );
        case 'arquivo':
            return (
                <InputFileDropzone
                    title={input.titulo}
                    type="arquivo"
                    name={input.name}
                    value={value}
                    onChange={onChange}
                    currentFile={input.arquivo}
                    onDelete={() => onChange(input.name, null)}
                />
            );
        case 'data_hora':
            return (
                <InputDatetime
                    title={input.titulo}
                    name={input.name}
                    idioma={idioma.codigo}
                    value={value}
                    max={input.max}
                    onChange={onChange}
                />
            );
        case 'link':
            return (
                <InputLink
                    title={input.titulo}
                    name={input.name}
                    idioma={idioma.codigo}
                    value={value}
                    max={input.max}
                    onChange={onChange}
                />
            );
        case 'tag':
            return (
                <InputTag
                    title={input.titulo}
                    name={input.name}
                    value={value}
                    idioma={idioma.codigo}
                    onChange={onChange}
                    max={input.max}
                    placeholder={input.placeholder}
                />
            );
        default:
            return null;
    }
};