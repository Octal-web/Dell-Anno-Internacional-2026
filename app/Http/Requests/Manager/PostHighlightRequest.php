<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;

class PostHighlightRequest extends FormRequest
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
            'titulo' => 'required',
            'tamanho' => 'required|in:pequeno,medio,grande',
            'texto' => 'required',
            'img' => inertia()->getShared('action') === 'novo'
                ? 'required_if:tipo,imagem|image|mimes:png,jpg|max:2048'
                : 'nullable|image|mimes:png,jpg|max:2048',
            'vid' => inertia()->getShared('action') === 'novo'
                ? 'required_if:tipo,video|mimetypes:video/mp4,video/x-msvideo,video/webm|max:51200'
                : 'nullable|mimetypes:video/mp4,video/x-msvideo,video/webm|max:51200',
            'link' => 'nullable|url',
            'texto_botao' => 'required_with:link|string',
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
            'texto.required' => 'Por favor, informe o texto.',
            'tipo.required' => 'Por favor, selecione o tipo (imagem ou vídeo).',
            'tipo.in' => 'O tipo deve ser imagem ou vídeo.',
            'tamanho.required' => 'Por favor, selecione o tamanho.',
            'tamanho.in' => 'O tamanho deve ser pequeno, médio ou grande.',
            'img.required' => 'Por favor, selecione uma imagem.',
            'img.required_if' => 'Por favor, selecione uma imagem.',
            'img.image' => 'Por favor, selecione uma imagem válida.',
            'img.mimes' => 'Os formatos de imagem válidos são: JPG e PNG.',
            'img.max' => 'Por favor, envie um arquivo menor que 2MB.',
            'vid.required' => 'Por favor, selecione um vídeo.',
            'vid.required_if' => 'Por favor, selecione um vídeo.',
            'vid.mimetypes' => 'Os formatos de vídeo válidos são: MP4, AVI e WEBM.',
            'vid.max' => 'Por favor, envie um arquivo menor que 50MB.',
            'link.url' => 'Por favor, insira um link válido.',
            'texto_botao.required_with' => 'O campo "Texto do link" é obrigatório quando um link for informado.',
            'texto_botao.string' => 'O campo "Texto do link" deve ser um texto válido.',
        ];
    }
}