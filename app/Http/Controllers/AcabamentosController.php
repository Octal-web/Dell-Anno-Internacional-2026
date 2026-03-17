<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Acabamento;
use App\Models\Pagina;

class AcabamentosController extends Controller
{
    public function index() {
        $acabamento = Acabamento::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->first();

        if ($acabamento) {
            return Inertia::location(route('Acabamentos.acabamento', ['slug' => $acabamento->slug]));
        }
    }

    public function acabamento($slug = null) {
        if (!$slug) {
            return Inertia::location(route('Produtos.index'));
        }
        
        $idioma = inertia()->getShared('idioma');

        $acabamento = Acabamento::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true,
                'slug' => $slug
            ])
            ->with([
                'acabamentosIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                },
                'blocos' => function ($q) use ($idioma) {
                    $q->where([
                        'excluido' => NULL,
                        'visivel' => true
                    ])
                    ->with('acabamentosBlocosIdiomas', function ($q) use ($idioma) {
                        $q->whereHas('idiomas', function ($r) use ($idioma) {
                            $r->where('codigo', $idioma)
                            ->orWhere('padrao', true);
                        })
                        ->orderBy('idioma_id', 'DESC');
                    });
                }
            ])
            ->first();

        if (!$acabamento) {
            return Inertia::location(route('Produtos.index'));
        }

        $acabamentoData = [
            'id' => $acabamento->id,
            'slug' => $acabamento->slug,
            'nome' => $acabamento->acabamentosIdiomas->isNotEmpty() ? $acabamento->acabamentosIdiomas[0]->nome : null,
            'blocos' => $acabamento->blocos->map(function($bloco) {
                return [
                    'id' => $bloco->id,
                    'imagem' => rafator('content/finishes/blocks/' . $bloco->imagem),
                    'texto' => $bloco->acabamentosBlocosIdiomas->isNotEmpty() ? $bloco->acabamentosBlocosIdiomas[0]->texto : null,
                ];
            }),
        ];
        
        $todosAcabamentos = Acabamento::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'acabamentosIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($acabamentoItem) {
                return [
                    'id' => $acabamentoItem->id,
                    'slug' => $acabamentoItem->slug,
                    'imagem' => rafator('content/finishes/thumbs/' . $acabamentoItem->imagem),
                    'nome' => $acabamentoItem->acabamentosIdiomas->isNotEmpty() ? $acabamentoItem->acabamentosIdiomas[0]->nome : null
                ];
            });
        
        $pagina = new Pagina;

        $pagina->titulo = $acabamento->acabamentosIdiomas[0]->titulo_pagina . ' | Dell Anno';
        $pagina->descricao = $acabamento->acabamentosIdiomas[0]->descricao_pagina . ' | Dell Anno';
        $pagina->titulo_compartilhamento = $acabamento->acabamentosIdiomas[0]->titulo_pagina . ' | Dell Anno';
        $pagina->descricao_compartilhamento = $acabamento->acabamentosIdiomas[0]->descricao_pagina . ' | Dell Anno';

        list($width, $height, $type, $attr) = getimagesize(public_path('/content/finishes/thumbs/' . $acabamento->imagem));

        $pagina->imagem = [
            'endereco' => '/content/finishes/thumbs/' . $acabamento->imagem,
            'tipo' => image_type_to_mime_type($type),
            'largura' => $width,
            'altura' => $height,
        ];

        return Inertia::render('Acabamento', [
            'acabamento' => $acabamentoData,
            'pagina' => $pagina,
            'todosAcabamentos' => $todosAcabamentos
        ]);
    }
};