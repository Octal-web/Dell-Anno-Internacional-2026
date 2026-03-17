<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;

class PostProjectRequest extends FormRequest
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
            'ambiente_id' => 'required|integer|exists:ambientes,id',
            'img' => inertia()->getShared('action') === 'novo'
                ? 'required|image|mimes:png,jpg|max:4096'
                : 'nullable|image|mimes:png,jpg|max:4096',
            'detalhes' => 'required|string|max:720',
            'conteudo' => 'required|string|max:2000',
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
            'ambiente_id.required' => 'Por favor, selecione um ambiente.',
            'ambiente_id.exists' => 'O ambiente selecionado é inválido.',
            'img.required' => 'Por favor, selecione uma imagem.',
            'img.image' => 'Por favor, selecione uma imagem válida.',
            'img.mimes' => 'Os formatos válidos são JPG e PNG.',
            'img.max' => 'Por favor, envie uma imagem menor que 4MB.',
            'detalhes.required' => 'Por favor, informe os detalhes.',
            'detalhes.max' => 'Os detalhes devem ter no máximo 720 caracteres.',
            'conteudo.required' => 'Por favor, informe o conteúdo.',
            'conteudo.max' => 'O conteúdo deve ter no máximo 2000 caracteres.',
        ];
    }
}