<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Mostra;

use Carbon\Carbon;

class MostrasController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $mostras = Mostra::query()
            ->where([
                'excluido' => NULL
            ])
            ->with([
                'mostrasIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($mostra) {
                return [
                    'id' => $mostra->id,
                    'visivel' => $mostra->visivel,
                    'imagem' => rafator('content/fairs/thumbs/' . $mostra->imagem),
                    'nome' => $mostra->mostrasIdiomas->isNotEmpty() ? $mostra->mostrasIdiomas[0]->nome : null,
                ];
            });

        return Inertia::render('Manager/Mostras/index', [
            'mostras' => $mostras
        ]);
    }
};