<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;

class PostCatalogRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {  
        return [
            'titulo' => 'required|string|max:150',
            'descricao' => 'required|string|max:320',
            'catalogo_categoria_id' => 'required|integer',
            'img' => inertia()->getShared('action') === 'novo'
                ? 'required|image|mimes:png,jpg|max:4096'
                : 'nullable|image|mimes:png,jpg|max:4096',
            'arq' => inertia()->getShared('action') === 'novo'
                ? 'required|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx|max:51200'
                : 'nullable|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx|max:51200',   
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages()
    {
        return [
            'titulo.required' => 'Por favor, informe o título.',
            'titulo.max' => 'O título deve ter no máximo 120 caracteres.',

            'descricao.required' => 'Por favor, informe a descrição.',
            'descricao.max' => 'A descrição deve ter no máximo 320 caracteres.',
            
            'catalogo_categoria_id.required' => 'Por favor, informe a categoria.',

            'img.required' => 'Por favor, selecione uma imagem.',
            'img.image' => 'Por favor, selecione uma imagem válida.',
            'img.mimes' => 'Os formatos válidos são JPG e PNG.',
            'img.max' => 'Por favor, envie uma imagem menor que 4MB.',
            
            'arq.required' => 'Por favor, selecione um arquivo.',
            'arq.required' => 'Por favor, selecione uma ficha técnica.',
            'arq.mimes' => 'Os formatos de arquivo válidos são: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX.',
            'arq.max' => 'Por favor, envie um arquivo menor que 50MB.',
        ];
    }
}