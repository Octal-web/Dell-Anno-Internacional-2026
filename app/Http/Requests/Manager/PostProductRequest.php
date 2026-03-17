<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;

class PostProductRequest extends FormRequest
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
            'nome' => 'required|string|max:100',
            'descricao' => 'required|string|max:500',
            'img' => inertia()->getShared('action') === 'novo'
                ? 'required|image|mimes:png,jpg|max:4096'
                : 'nullable|image|mimes:png,jpg|max:4096',
            'img_banner' => inertia()->getShared('action') === 'novo'
                ? 'required|image|mimes:png,jpg|max:4096'
                : 'nullable|image|mimes:png,jpg|max:4096',
            'titulo_pagina' => 'required|string|max:100',
            'descricao_pagina' => 'required|string|max:300',
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
            'nome.required' => 'Por favor, informe o nome.',
            'nome.max' => 'O nome pode ter no máximo 100 caracteres.',

            'descricao.required' => 'Por favor, informe a descrição.',
            'descricao.max' => 'A descrição pode ter no máximo 500 caracteres.',

            'img.required' => 'Por favor, selecione uma imagem.',
            'img.image' => 'Por favor, selecione uma imagem válida.',
            'img.mimes' => 'Os formatos de imagem válidos são: JPG e PNG.',
            'img.max' => 'Por favor, envie um arquivo menor que 4MB.',

            'img_banner.required' => 'Por favor, selecione um banner.',
            'img_banner.image' => 'Por favor, selecione um banner válido.',
            'img_banner.mimes' => 'Os formatos de banner válidos são: JPG e PNG.',
            'img_banner.max' => 'Por favor, envie um banner menor que 4MB.',

            'titulo_pagina.required' => 'Por favor, informe o título da página.',
            'titulo_pagina.max' => 'O título da página pode ter no máximo 100 caracteres.',

            'descricao_pagina.required' => 'Por favor, informe a descrição da página.',
            'descricao_pagina.max' => 'A descrição da página pode ter no máximo 300 caracteres.',
        ];
    }
}