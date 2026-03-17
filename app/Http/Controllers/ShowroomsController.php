<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Showroom;
use App\Models\Pagina;

class ShowroomsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $showrooms = Showroom::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'showroomsIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->paginate(9);

        $showrooms->getCollection()->transform(function($showroom) {
            return [
                'id' => $showroom->id,
                'slug' => $showroom->slug,
                'imagem' => asset('content/showrooms/thumbs/' . $showroom->imagem),
                'nome' => $showroom->showroomsIdiomas->isNotEmpty() ? $showroom->showroomsIdiomas[0]->nome : null
            ];
        });

        return Inertia::render('Showrooms', [
            'showrooms' => $showrooms
        ]);
    }

    public function showroom($slug = null) {
        $idioma = inertia()->getShared('idioma');

        $showroom = Showroom::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true,
                'slug' => $slug
            ])
            ->with([
                'showroomsIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                },
                'loja' => function ($q) use ($idioma) {
                    $q->where([
                        'excluido' => NULL,
                        'visivel' => true
                    ])
                    ->with('lojasIdiomas', function ($q) use ($idioma) {
                        $q->whereHas('idiomas', function ($r) use ($idioma) {
                            $r->where('codigo', $idioma)
                            ->orWhere('padrao', true);
                        })
                        ->orderBy('idioma_id', 'DESC');
                    });
                },
                'imagens' => function ($q) {
                    $q->where([
                        'excluido' => NULL,
                        'visivel' => true
                    ])
                    ->orderBy('ordem', 'ASC')
                    ->orderBy('id', 'DESC');
                }
            ])
            ->first();

        if (!$showroom) {
            return Inertia::location(route('Showrooms.index'));
        }

        $showroomData = [
            'id' => $showroom->id,
            'nome' => $showroom->showroomsIdiomas->isNotEmpty() ? $showroom->showroomsIdiomas[0]->nome : null,
            'cidade' => $showroom->loja ? ($showroom->loja->lojasIdiomas->isNotEmpty() ? $showroom->loja->lojasIdiomas[0]->cidade : null) : null,
            'chamada' => $showroom->showroomsIdiomas->isNotEmpty() ? $showroom->showroomsIdiomas[0]->chamada : null,
            'texto_chamada' => $showroom->showroomsIdiomas->isNotEmpty() ? $showroom->showroomsIdiomas[0]->texto_chamada : null,
            'banner' => rafator('content/showrooms/banner/' . $showroom->banner),
            'imagens' => $showroom->imagens->map(function($img) {
                return [
                    'id' => $img->id,
                    'imagem' => rafator('content/showrooms/gallery/' . $img->imagem),
                ];
            }),
        ];
        
        $todosShowrooms = Showroom::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true,
                ['slug', '!=', $showroom->slug]
            ])
            ->with([
                'showroomsIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->inRandomOrder()
            ->limit(4)
            ->get()
            ->map(function($showroomItem) {
                return [
                    'id' => $showroomItem->id,
                    'slug' => $showroomItem->slug,
                    'imagem' => rafator('content/showrooms/thumbs/' . $showroomItem->imagem),
                    'nome' => $showroomItem->showroomsIdiomas->isNotEmpty() ? $showroomItem->showroomsIdiomas[0]->nome : null
                ];
            });

        $pagina = new Pagina;

        $pagina->titulo = $showroom->showroomsIdiomas[0]->titulo_pagina . ' | Dell Anno';
        $pagina->descricao = $showroom->showroomsIdiomas[0]->descricao_pagina . ' | Dell Anno';
        $pagina->titulo_compartilhamento = $showroom->showroomsIdiomas[0]->titulo_pagina . ' | Dell Anno';
        $pagina->descricao_compartilhamento = $showroom->showroomsIdiomas[0]->descricao_pagina . ' | Dell Anno';

        list($width, $height, $type, $attr) = getimagesize(public_path('/content/showrooms/thumbs/' . $showroom->imagem));

        $pagina->imagem = [
            'endereco' => '/content/showrooms/thumbs/' . $showroom->imagem,
            'tipo' => image_type_to_mime_type($type),
            'largura' => $width,
            'altura' => $height,
        ];

        return Inertia::render('Showroom', [
            'pagina' => $pagina,
            'showroom' => $showroomData,
            'todosShowrooms' => $todosShowrooms
        ]);
    }
};