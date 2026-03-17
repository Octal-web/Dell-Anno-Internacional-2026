<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use App\Models\Conteudo;
use App\Models\ConteudoIdioma;

use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

class ConteudosController extends Controller
{
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function editarAction(Request $request, $id) {
        if($request->ajax()){
            $request->validate([
                'conteudosIdiomas.0.titulo' => $request->exists('conteudosIdiomas.0.titulo') ? 'required' : 'nullable',
                'conteudosIdiomas.0.subtitulo' => $request->exists('conteudosIdiomas.0.subtitulo') ? 'required' : 'nullable',
                'conteudosIdiomas.0.texto' => $request->exists('conteudosIdiomas.0.texto') ? 'required' : 'nullable',
                'conteudosIdiomas.0.link' => $request->exists('conteudosIdiomas.0.link') ? 'required|url' : 'nullable',
                'conteudosIdiomas.0.video' => $request->exists('conteudosIdiomas.0.video') ? 'required|url' : 'nullable',
                'img' => $request->hasFile('img') ? 'image|mimes:png,jpg|max:5120' : 'nullable',
                'img_mobile' => $request->hasFile('img_mobile') ? 'image|mimes:png,jpg|max:5120' : 'nullable',
                'conteudosIdiomas.0.arq' => $request->exists('conteudosIdiomas.0.arq') ? 'file|max:20480' : 'nullable',
            ],
            [
                'conteudosIdiomas.0.titulo.required' => 'Por favor, informe o título.',
                'conteudosIdiomas.0.subtitulo.required' => 'Por favor, informe o subtítulo.',
                'conteudosIdiomas.0.texto.required' => 'Por favor, informe o texto.',
                'conteudosIdiomas.0.link.required' => 'Por favor, informe o link.',
                'conteudosIdiomas.0.link.url' => 'Por favor, informe um link válido.',
                'conteudosIdiomas.0.video.required' => 'Por favor, informe o link do vídeo.',
                'conteudosIdiomas.0.video.url' => 'Por favor, informe um link de vídeo válido.',
                'img.image' => 'Por favor, selecione uma imagem válida.',
                'img.mimes' => 'Os formatos de imagem válidos são: JPG e PNG.',
                'img.max' => 'Por favor, envie um arquivo menor que 5MB.',
                'img_mobile.image' => 'Por favor, selecione uma imagem mobile válida.',
                'img_mobile.mimes' => 'Os formatos de imagem mobile válidos são: JPG e PNG.',
                'img_mobile.max' => 'Por favor, envie um arquivo menor que 5MB.',
                'conteudosIdiomas.0.arq.file' => 'Por favor, selecione um arquivo válido.',
                'conteudosIdiomas.0.arq.max' => 'O tamanho do arquivo deve ser menor que 20MB.',
            ]);

            $conteudo = Conteudo::query()
                ->where('id', $id)
                ->with('Parametro')
                ->first();

            $idioma = $request->query('lang');

            $conteudo_idioma = ConteudoIdioma::query()
                ->where([
                    'excluido' => null,
                    'conteudo_id' => $conteudo->id
                ])
                ->when($idioma, function ($q) use($idioma) {
                    $q->whereHas('idiomas', function($query) use($idioma) {
                        $query->where('codigo', $idioma);
                    });
                })
                ->when(!$idioma, function ($q) {
                    $q->whereHas('idiomas', function($query) {
                        $query->where('padrao', true);
                    });
                })
                ->first();

            $prev_arquivo = $conteudo_idioma->arquivo;

            if (!$conteudo) {
                return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($conteudo, 'ConteudosIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Home.index'));
            }

            if (!$conteudo_idioma) {
                $request->validate([
                    'img' => $conteudo->parametro->habilitar_imagem ? 'required' : 'nullable',
                    'img_mobile' => $conteudo->parametro->habilitar_imagem_mobile ? 'required' : 'nullable',
                    'conteudosIdiomas.0.arq' => $conteudo->parametro->habilitar_arquivo ? 'required' : 'nullable',
                ],
                [
                    'img.required' => 'Por favor, selecione uma imagem.',
                    'img_mobile.required' => 'Por favor, selecione uma imagem mobile.',
                    'conteudosIdiomas.0.arq.required' => 'Por favor, selecione um arquivo.',
                ]);

                $conteudo_idioma = new ConteudoIdioma;

                $conteudo_idioma->conteudo_id = $conteudo->id;
                $conteudo_idioma->idioma_id = $idioma;
            } else {
                $copier = new DeepCopy();
                $conteudoOriginal = $copier->copy($conteudo);
            }

            $conteudo_idioma->titulo = $request->exists('conteudosIdiomas.0.titulo') ? $request['conteudosIdiomas'][0]['titulo'] : null;
            $conteudo_idioma->subtitulo = $request->exists('conteudosIdiomas.0.subtitulo') ? $request['conteudosIdiomas'][0]['subtitulo'] : null;
            $conteudo_idioma->texto = $request->exists('conteudosIdiomas.0.texto') ? $request['conteudosIdiomas'][0]['texto'] : null;
            $conteudo_idioma->link = $request->exists('conteudosIdiomas.0.link') ? $request['conteudosIdiomas'][0]['link'] : null;
            $conteudo_idioma->nova_aba = $request->exists('conteudosIdiomas.0.nova_aba') ? $request['conteudosIdiomas'][0]['nova_aba'] : null;
            $conteudo_idioma->video = $request->exists('conteudosIdiomas.0.video') ? $request['conteudosIdiomas'][0]['video'] : null;

            if ($request->file('img') && $request->file('img')->getError() == 0) {
                $conteudo->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            }

            if ($request->file('img_mobile') && $request->file('img_mobile')->getError() == 0) {
                $conteudo->imagem_mobile = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_mobile')->extension());
            }
            if ($request->file('arq') && $request->file('arq')->getError() == 0) {
                $conteudo_idioma->arquivo = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('arq')->extension());
            }

            $response = $conteudo->save();
            $response = $conteudo_idioma->save();

            if ($response) {
                
                if ($conteudo->parametro->habilitar_img && $request->file('img') && $request->file('img')->getError() == 0) {

                    if ($conteudo->imagem && isset($conteudoOriginal) && File::exists('content/display/' . $conteudoOriginal->imagem)) {
                        File::delete('content/display/' . $conteudoOriginal->imagem);
                    }

                    $request->file('img')->move(public_path('content/display/'), $conteudo->imagem);
                    
                }


                if ($conteudo->parametro->habilitar_img_mobile && $request->file('img_mobile') && $request->file('img_mobile')->getError() == 0) {
                    if (isset($conteudoOriginal) && $conteudo->imagem_mobile && File::exists(public_path('content/display/') . $conteudoOriginal->imagem_mobile)) {
                        File::delete(public_path('content/display/') . $conteudoOriginal->imagem_mobile);
                    }

                    $request->file('img')->move(public_path('content/display/') . $conteudo->imagem_mobile);
                }

                if ($conteudo->parametro->habilitar_arquivo && $request->file('arq') && $request->file('arq')->getError() == 0) {
                    if (isset($prev_arquivo) && $conteudo_idioma->arquivo && File::exists(public_path('content/files/') . $prev_arquivo->arquivo)) {
                        File::delete(public_path('content/files/') . $prev_arquivo->arquivo);
                    }

                    $request->file('arq')->storeAs('content/files/', $conteudo_idioma->arquivo);
                }
               
                return redirect()->back()->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }
        return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
        }
        return Inertia::location(route('Manager.Usuarios.login'));
    }

    /**
     * Download the specified file
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function baixarArquivo($id) {
        if (!$id) {
            return Inertia::location(route('Manager.Home.index'));
        }

        $conteudo = Conteudo::query()
            ->where([
                'id' => $id
            ])
            ->with('Parametro')
            ->first();

        if (!$conteudo || !$conteudo->parametro->habilitar_arq) {
            return Inertia::location(route('Manager.Home.index'));
        }

        return Response::download(File::path('content/files/' . $conteudo_idioma->arquivo));
    }

    /**
     * Delete the specified file.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function excluirArquivo(Request $request, $id) {
        if ($request->post()){
            if (!$id) {
                return $request->header('referer');
            }

            $conteudo = Conteudo::query()
                ->where([
                    'id' => $id
                ])
                ->with('Parametro')
                ->first();

            $arquivo = $conteudo_idioma->arquivo;
            $conteudo_idioma->arquivo = null;

            if ($conteudo->save()) {
                File::delete('content/files/' . $arquivo);

                return redirect()->back()->with('message', ['type' => 'alerte', 'msg' => 'Arquivo excluído com sucesso.']);
            }
        }

        return Inertia::location(route('Manager.Home.index'));
    }
}