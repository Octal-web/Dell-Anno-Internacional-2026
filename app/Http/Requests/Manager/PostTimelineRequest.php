<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;

class PostTimelineRequest extends FormRequest
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
            'ano' => 'required|digits:4|integer|min:1800|max:3000',
            'descricao' => 'required',
            'img' => inertia()->getShared('action') == 'novo' ? 'required|image|mimes:png,jpg|max:2048' : 'nullable|image|mimes:png,jpg|max:2048',
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
            'ano.required' => 'Por favor, informe o ano.',
            'ano.digits' => 'Por favor, informe um ano válido.',
            'ano.integer' => 'Por favor, informe um ano válido.',
            'ano.min' => 'Por favor, informe um ano válido.',
            'ano.max' => 'Por favor, informe um ano válido.',
            'descricao.required' => 'Por favor, informe a descrição.',
            'img.required' => 'Por favor, selecione uma imagem.',
            'img.image' => 'Por favor, selecione uma imagem válida.',
            'img.mimes' => 'Os formatos de imagem válidos são: JPG e PNG.',
            'img.max' => 'Por favor, envie um arquivo menor que 2MB.',
        ];
    }
}