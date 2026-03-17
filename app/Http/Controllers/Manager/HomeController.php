<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostGeneralDataRequest;

// use App\Models\DadosGerais;
use App\Models\Slide;
use App\Models\Campanha;
use App\Models\Destaque;

class HomeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        // $dadosGerais = DadosGerais::first();

        $slides = Slide::query()
            ->where([
                'excluido' => NULL
            ])
            ->with([
                'slidesIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($slide) {
                return [
                    'id' => $slide->id,
                    'visivel' => $slide->visivel,
                    'titulo' => (($slide->slidesIdiomas->isNotEmpty() ? ($slide->slidesIdiomas[0]->titulo ? $slide->slidesIdiomas[0]->titulo . ' - ' : null) : null) . ($slide->tipo == 'imagem' ? 'Imagem' : 'Vídeo')),
                ];
            });

        $campanhas = Campanha::query()
            ->where([
                'excluido' => NULL
            ])
            ->with([
                'campanhasIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($campanha) {
                return [
                    'id' => $campanha->id,
                    'visivel' => $campanha->visivel,
                    'imagem' => rafator('content/campaigns/thumbs/' . $campanha->imagem),
                    'titulo' => $campanha->campanhasIdiomas->isNotEmpty() ? $campanha->campanhasIdiomas[0]->titulo : null,
                ];
            });
            
        $destaques = Destaque::query()
            ->where([
                'excluido' => NULL
            ])
            ->with([
                'destaquesIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($destaque) {
                return [
                    'id' => $destaque->id,
                    'visivel' => $destaque->visivel,
                    'titulo' => $destaque->destaquesIdiomas->isNotEmpty() ? $destaque->destaquesIdiomas[0]->titulo : null,
                ];
            });

        return Inertia::render('Manager/Home/index', [
            // 'dadosGerais' => $dadosGerais,
            'slides' => $slides,
            'campanhas' => $campanhas,
            'destaques' => $destaques
        ]);
    }
    

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizarInfo(PostGeneralDataRequest $request) {
        if ($request->ajax()) {
            $dados_gerais = DadosGerais::first();

            $dados_gerais->endereco = $request->endereco;
            $dados_gerais->cep = $request->cep;
            $dados_gerais->cidade = $request->cidade;
            $dados_gerais->telefone = $request->telefone;
            $dados_gerais->whatsapp = $request->whatsapp;
            $dados_gerais->email = $request->email;
            $dados_gerais->instagram = $request->instagram ? $request->instagram : null;
            $dados_gerais->facebook = $request->facebook ? $request->facebook : null;
            $dados_gerais->linkedin = $request->linkedin ? $request->linkedin : null;

            $response = $dados_gerais->save();

            if ($response) {
                return to_route('Manager.Home.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }
        }
    }
};