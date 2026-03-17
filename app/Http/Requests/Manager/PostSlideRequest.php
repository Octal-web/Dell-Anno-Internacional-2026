<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;

class PostSlideRequest extends FormRequest
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
            'link'  => 'nullable|url',
            'img' => request('tipo') !== 'imagem'
                ? 'nullable'
                : (inertia()->getShared('action') === 'novo'
                    ? 'required|image|mimes:png,jpg|max:4096'
                    : 'nullable|image|mimes:png,jpg|max:4096'),

            'img_mobile' => request('tipo') !== 'imagem'
                ? 'nullable'
                : (inertia()->getShared('action') === 'novo'
                    ? 'required|image|mimes:png,jpg|max:4096'
                    : 'nullable|image|mimes:png,jpg|max:4096'),

            'vid' => request('tipo') !== 'video'
                ? 'nullable'
                : (inertia()->getShared('action') === 'novo'
                    ? 'required|mimetypes:video/mp4,video/x-msvideo,video/webm|max:51200'
                    : 'nullable|mimetypes:video/mp4,video/x-msvideo,video/webm|max:51200'),

            'vid_mobile' => request('tipo') !== 'video'
                ? 'nullable'
                : (inertia()->getShared('action') === 'novo'
                    ? 'required|mimetypes:video/mp4,video/x-msvideo,video/webm|max:51200'
                    : 'nullable|mimetypes:video/mp4,video/x-msvideo,video/webm|max:51200'),
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
            'link.url'  => 'Por favor, informe um link válido.',
            'img.required' => 'Por favor, selecione uma imagem.',
            'img.image' => 'Por favor, selecione uma imagem válida.',
            'img.mimes' => 'Os formatos de imagem válidos são: JPG e PNG.',
            'img.max' => 'Por favor, envie um arquivo menor que 4MB.',
            'img_mobile.required' => 'Por favor, selecione uma imagem mobile.',
            'img_mobile.image' => 'Por favor, selecione uma imagem mobile válida.',
            'img_mobile.mimes' => 'Os formatos de imagem mobile válidos são: JPG e PNG.',
            'img_mobile.max' => 'Por favor, envie um arquivo menor que 4MB.',
            'vid.required' => 'Por favor, selecione um vídeo.',
            'vid.mimetypes' => 'Os formatos de vídeo válidos são: MP4, AVI e WEBM.',
            'vid.max' => 'Por favor, envie um arquivo menor que 50MB.',
            'vid_mobile.required' => 'Por favor, selecione um vídeo mobile.',
            'vid_mobile.mimetypes' => 'Os formatos de vídeo mobile válidos são: MP4, AVI e WEBM.',
            'vid_mobile.max' => 'Por favor, envie um arquivo menor que 50MB.',
        ];
    }
}