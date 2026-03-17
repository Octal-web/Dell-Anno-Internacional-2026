<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Acabamento;
use App\Models\Conteudo;

use Carbon\Carbon;

class AcabamentosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $acabamentos = Acabamento::query()
            ->where([
                'excluido' => NULL
            ])
            ->with([
                'acabamentosIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($acabamento) {
                return [
                    'id' => $acabamento->id,
                    'visivel' => $acabamento->visivel,
                    'imagem' => rafator('content/finishes/thumbs/' . $acabamento->imagem),
                    'nome' => $acabamento->acabamentosIdiomas->isNotEmpty() ? $acabamento->acabamentosIdiomas[0]->nome : null,
                ];
            });

        $acabamentoConteudos = Conteudo::query()
            ->where([
                'controladora' => 'Acabamentos',
                'acao' => 'acabamento'
            ])
            ->with([
                'conteudosIdiomas' => function($q) use ($idioma) {
                    $q->whereHas('idiomas', function($r) use ($idioma) {
                        $r->where([
                            'id' => $idioma->id,
                        ]);
                    })
                    ->with('idiomas');
                },
                'parametro'
            ])
            ->get()
            ->map(function($conteudo) {
                return [
                    'id' => $conteudo->id,
                    'bloco' => $conteudo->parametro->descricao,
                    'titulo' => $conteudo->conteudosIdiomas->isNotEmpty() ? $conteudo->conteudosIdiomas[0]->titulo : null,
                    'habilitar_titulo' => $conteudo->parametro->habilitar_titulo ? true : false,
                    'subtitulo' => $conteudo->conteudosIdiomas->isNotEmpty() ? $conteudo->conteudosIdiomas[0]->subtitulo : null,
                    'habilitar_subtitulo' => $conteudo->parametro->habilitar_subtitulo ? true : false,
                    'texto' => $conteudo->conteudosIdiomas->isNotEmpty() ? $conteudo->conteudosIdiomas[0]->texto : null,
                    'habilitar_texto' => $conteudo->parametro->habilitar_texto ? true : false,
                    'texto_formatado' => $conteudo->parametro->texto_formatado ? true : false,
                    'imagem' => rafator('/content/display/' . $conteudo->imagem),
                    'habilitar_img' => $conteudo->parametro->habilitar_img ? true : false,
                    'largura_img' => $conteudo->parametro->largura_img,
                    'altura_img' => $conteudo->parametro->altura_img,
                    'recortar_img' => $conteudo->parametro->recortar_img ? true : false,
                    'imagem_mobile' => rafator('content/display/' . $conteudo->imagem_mobile),
                    'habilitar_img_mobile' => $conteudo->parametro->habilitar_img_mobile ? true : false,
                    'largura_img_mobile' => $conteudo->parametro->largura_img_mobile,
                    'altura_img_mobile' => $conteudo->parametro->altura_img_mobile,
                    'recortar_img_mobile' => $conteudo->parametro->recortar_img_mobile ? true : false,
                    'link' => $conteudo->conteudosIdiomas->isNotEmpty() ? $conteudo->conteudosIdiomas[0]->link : null,
                    'habilitar_link' => $conteudo->parametro->habilitar_link ? true : false,
                    'video' => $conteudo->conteudosIdiomas->isNotEmpty() ? $conteudo->conteudosIdiomas[0]->video : null,
                    'habilitar_video' => $conteudo->parametro->habilitar_video ? true : false,
                    'nova_aba' => $conteudo->conteudosIdiomas->isNotEmpty() && $conteudo->conteudosIdiomas[0]->nova_aba ? true : false,
                    'minimizavel' => $conteudo->parametro->minimizavel ? true : false,
                    'galeria' => $conteudo->parametro->galeria ? true : false,
                ];
            });
            
        return Inertia::render('Manager/Acabamentos/index', [
            'acabamentos' => $acabamentos,
            'acabamentoConteudos' => $acabamentoConteudos
        ]);
    }
};