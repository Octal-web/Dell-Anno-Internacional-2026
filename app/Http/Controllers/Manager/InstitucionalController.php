<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Acontecimento;
use App\Models\Etapa;

use Carbon\Carbon;

class InstitucionalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $acontecimentos = Acontecimento::query()
            ->where([
                'excluido' => NULL
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($acontecimento) {
                return [
                    'id' => $acontecimento->id,
                    'visivel' => $acontecimento->visivel,
                    'imagem' => rafator('content/timeline/thumbs/' . $acontecimento->imagem),
                    'nome' => $acontecimento->ano,
                ];
            });

        $etapas = Etapa::query()
            ->where([
                'excluido' => NULL
            ])
            ->with([
                'etapasIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($etapa) {
                return [
                    'id' => $etapa->id,
                    'visivel' => $etapa->visivel,
                    'imagem' => rafator('content/steps/thumbs/' . $etapa->imagem),
                    'titulo' => $etapa->etapasIdiomas->isNotEmpty() ? $etapa->etapasIdiomas[0]->titulo : null,
                ];
            });

        return Inertia::render('Manager/Institucional/index', [
            'acontecimentos' => $acontecimentos,
            'etapas' => $etapas
        ]);
    }
};