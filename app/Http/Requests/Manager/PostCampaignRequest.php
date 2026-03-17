<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;

class PostCampaignRequest extends FormRequest
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
            'titulo'  => 'required',
            'descricao'  => 'required',
            'link'  => 'required|url',
            'img' => inertia()->getShared('action') === 'novo'
                ? 'required|image|mimes:png,jpg|max:4096'
                : 'nullable|image|mimes:png,jpg|max:4096',
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
            'titulo.required'  => 'Por favor, informe o título.',
            'descricao.required'  => 'Por favor, informe a descrição.',
            'link.required'  => 'Por favor, informe o link.',
            'link.required'  => 'Por favor, informe um link válido.',
            'img.required' => 'Por favor, selecione uma imagem.',
            'img.image' => 'Por favor, selecione uma imagem válida.',
            'img.mimes' => 'Os formatos de imagem válidos são: JPG e PNG.',
            'img.max' => 'Por favor, envie um arquivo menor que 4MB.',
        ];
    }
}