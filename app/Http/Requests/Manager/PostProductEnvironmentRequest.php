<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;

class PostProductEnvironmentRequest extends FormRequest
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
            'nome' => 'required|string|max:120',
            'descricao_curta' => 'required|string|max:320',
            'descricao' => 'required|string|max:720',
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
            'nome.max' => 'O nome deve ter no máximo 120 caracteres.',
            'descricao_curta.required' => 'Por favor, informe a descrição curta.',
            'descricao_curta.max' => 'A descrição curta deve ter no máximo 320 caracteres.',
            'descricao.required' => 'Por favor, informe a descrição.',
            'descricao.max' => 'A descrição deve ter no máximo 720 caracteres.',
        ];
    }
}