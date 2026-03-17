<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;

class PostStoreRequest extends FormRequest
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
            'cidade' => 'required|string|max:120',
            'estado' => 'nullable|string|max:2',
            'pais_id' => 'required|integer|exists:paises,id',
            'link_lp' => 'nullable|url|max:128',
            'link_showroom' => 'nullable|string|regex:/<iframe.*<\/iframe>/is',
            'emails_lojas' => 'nullable|array',
            'emails_lojas.*' => 'email',
            'endereco' => 'required|string|max:150',
            'contato' => 'required|string|max:150',
            'horario_atendimento' => 'required|string|max:150',
            'chamada' => 'required|string|max:350',
            'img_logo' => 'nullable|image|mimes:png,jpg|max:1024',
            'img_showroom' => 'nullable|image|mimes:png,jpg|max:4096',
            'img' => inertia()->getShared('action') === 'novo'
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
            'cidade.required'  => 'Por favor, informe a cidade.',
            'cidade.max' => 'O nome da cidade pode ter no máximo 120 caracteres.',

            'estado.max' => 'A sigla do estado pode ter no máximo 2 caracteres.',

            'pais_id.required'  => 'Por favor, informe o país.',
            'pais_id.exists' => 'O país selecionado é inválido.',

            'link_lp.url' => 'Por favor, informe um link válido para a Landing Page.',
            'link_lp.max' => 'O link da Landing Page pode ter no máximo 128 caracteres.',

            'link_showroom.regex' => 'O campo Link Showroom deve conter um código de iframe válido.',

            'emails_lojas.array' => 'Os e-mails da loja devem ser enviados em formato de lista.',
            'emails_lojas.*.email' => 'Um ou mais e-mails informados não são válidos.',

            'endereco.required' => 'Por favor, informe o endereço.',
            'endereco.max' => 'O endereço pode ter no máximo 150 caracteres.',

            'contato.required' => 'Por favor, informe o contato.',
            'contato.max' => 'O contato pode ter no máximo 150 caracteres.',

            'horario_atendimento.required' => 'Por favor, informe o horário de atendimento.',
            'horario_atendimento.max' => 'O horário de atendimento pode ter no máximo 150 caracteres.',

            'chamada.required' => 'Por favor, informe o texto de chamada.',
            'chamada.max' => 'O texto de chamada pode ter no máximo 350 caracteres.',

            'img_logo.image' => 'Por favor, envie uma imagem de logo válida.',
            'img_logo.mimes' => 'A logo deve estar em formato JPG ou PNG.',
            'img_logo.max' => 'A logo deve ter no máximo 1MB.',

            'img_showroom.image' => 'Por favor, envie uma imagem de showroom válida.',
            'img_showroom.mimes' => 'A imagem do showroom deve estar em formato JPG ou PNG.',
            'img_showroom.max' => 'A imagem do showroom deve ter no máximo 4MB.',

            'img.required' => 'Por favor, selecione uma imagem.',
            'img.image' => 'Por favor, selecione uma imagem válida.',
            'img.mimes' => 'Os formatos de imagem válidos são: JPG e PNG.',
            'img.max' => 'Por favor, envie um arquivo menor que 4MB.',

            'titulo_pagina.required' => 'Por favor, informe o título da página.',
            'titulo_pagina.max' => 'O título da página pode ter no máximo 100 caracteres.',

            'descricao_pagina.required' => 'Por favor, informe a descrição da página.',
            'descricao_pagina.max' => 'A descrição da página pode ter no máximo 300 caracteres.',
        ];
    }
}