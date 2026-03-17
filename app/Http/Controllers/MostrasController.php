<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Mostra;
use App\Models\MostraAno;
use App\Models\Pagina;

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
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'mostrasIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                },
                'mostrasAnos' => function ($q) {
                    $q->where([
                        'excluido' => NULL,
                        'visivel' => true
                    ]);
                }
            ])
            ->get()
            ->map(function($mostra) {
                return [
                    'id' => $mostra->id,
                    'imagem' => asset('content/fairs/thumbs/' . $mostra->imagem),
                    'nome' => $mostra->mostrasIdiomas->isNotEmpty() ? $mostra->mostrasIdiomas[0]->nome : null,
                    'descricao' => $mostra->mostrasIdiomas->isNotEmpty() ? $mostra->mostrasIdiomas[0]->descricao : null,
                    'slug' => $mostra->slug,
                    'anos' => $mostra->mostrasAnos->map(function($ano) {
                        return [
                            'id' => $ano->id,
                            'ano' => $ano->ano,
                        ];
                    }),
                ];
            });
        
        return Inertia::render('Mostras', [
            'mostras' => $mostras,
        ]);
    }

    public function mostra($slug = null) {
        return Inertia::location(route('Mostras.index'));
        
        if (!$slug) {
            return Inertia::location(route('Mostras.index'));
        }
        
        $idioma = inertia()->getShared('idioma');

        $mostra = Mostra::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true,
                'slug' => $slug
            ])
            ->with([
                'mostrasIdiomas' => function ($q) use ($idioma) {
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
                    ->with('mostrasBlocosIdiomas', function ($q) use ($idioma) {
                        $q->whereHas('idiomas', function ($r) use ($idioma) {
                            $r->where('codigo', $idioma)
                            ->orWhere('padrao', true);
                        })
                        ->orderBy('idioma_id', 'DESC');
                    });
                }
            ])
            ->first();

        if (!$mostra) {
            return Inertia::location(route('Mostras.index'));
        }

        $mostraData = [
            'id' => $mostra->id,
            'slug' => $mostra->slug,
            'nome' => $mostra->mostrasIdiomas->isNotEmpty() ? $mostra->mostrasIdiomas[0]->nome : null,
            'blocos' => $mostra->blocos->map(function($bloco) {
                return [
                    'id' => $bloco->id,
                    'imagem' => rafator('content/fairs/gallery/' . $bloco->imagem),
                    'texto' => $bloco->mostrasBlocosIdiomas->isNotEmpty() ? $bloco->mostrasBlocosIdiomas[0]->texto : null,
                ];
            }),
        ];
        
        $todosMostras = Mostra::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'mostrasIdiomas' => function ($q) use ($idioma) {
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
            ->map(function($mostraItem) {
                return [
                    'id' => $mostraItem->id,
                    'slug' => $mostraItem->slug,
                    'imagem' => rafator('content/fairs/thumbs/' . $mostraItem->imagem),
                    'nome' => $mostraItem->mostrasIdiomas->isNotEmpty() ? $mostraItem->mostrasIdiomas[0]->nome : null
                ];
            });
        
        $pagina = new Pagina;

        $pagina->titulo = $mostra->mostrasIdiomas[0]->titulo_pagina . ' | Dell Anno';
        $pagina->descricao = $mostra->mostrasIdiomas[0]->descricao_pagina . ' | Dell Anno';
        $pagina->titulo_compartilhamento = $mostra->mostrasIdiomas[0]->titulo_pagina . ' | Dell Anno';
        $pagina->descricao_compartilhamento = $mostra->mostrasIdiomas[0]->descricao_pagina . ' | Dell Anno';

        list($width, $height, $type, $attr) = getimagesize(public_path('/content/fairs/thumbs/' . $mostra->imagem));

        $pagina->imagem = [
            'endereco' => '/content/fairs/thumbs/' . $mostra->imagem,
            'tipo' => image_type_to_mime_type($type),
            'largura' => $width,
            'altura' => $height,
        ];

        return Inertia::render('Mostra', [
            'mostra' => $mostraData,
            'pagina' => $pagina,
            'todosMostras' => $todosMostras
        ]);
    }
    
    public function ano($slug = null, $ano = null) {
        if (!$slug || !$ano) {
            return Inertia::location(route('Mostras.index'));
        }
        
        $idioma = inertia()->getShared('idioma');

        $ano = MostraAno::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true,
                'ano' => $ano
            ])
            ->whereHas('mostra', function ($q) use ($slug) {
                $q->where([
                    'excluido' => NULL,
                    'visivel' => true,
                    'slug' => $slug
                ]);
            })
            ->with([
                'mostra' => function ($q) use ($idioma) {
                    $q->where([
                        'excluido' => NULL,
                        'visivel' => true
                    ])
                    ->with('mostrasIdiomas', function ($q) use ($idioma) {
                        $q->whereHas('idiomas', function ($r) use ($idioma) {
                            $r->where('codigo', $idioma)
                            ->orWhere('padrao', true);
                        })
                        ->orderBy('idioma_id', 'DESC');
                    });
                },
                'mostrasCidades' => function ($q) use ($idioma) {
                    $q->where([
                        'excluido' => NULL,
                        'visivel' => true
                    ])
                    ->with('mostrasCidadesIdiomas', function ($q) use ($idioma) {
                        $q->whereHas('idiomas', function ($r) use ($idioma) {
                            $r->where('codigo', $idioma)
                            ->orWhere('padrao', true);
                        })
                        ->orderBy('idioma_id', 'DESC');
                    });
                }
            ])
            ->first();

        if (!$ano) {
            return Inertia::location(route('Mostras.index'));
        }

        $anoData = [
            'id' => $ano->id,
            'ano' => $ano->ano,
            'nome' => $ano->mostra->mostrasIdiomas->isNotEmpty() ? $ano->mostra->mostrasIdiomas[0]->nome : null,
            'descricao' => $ano->mostra->mostrasIdiomas->isNotEmpty() ? $ano->mostra->mostrasIdiomas[0]->descricao_pagina : null,
            'cidades' => $ano->mostrasCidades->map(function($cidade) {
                return [
                    'id' => $cidade->id,
                    'nome' => $cidade->mostrasCidadesIdiomas->isNotEmpty() ? $cidade->mostrasCidadesIdiomas[0]->nome : null,
                    'cidade' => $cidade->mostrasCidadesIdiomas->isNotEmpty() ? $cidade->mostrasCidadesIdiomas[0]->cidade : null,
                    'descricao' => $cidade->mostrasCidadesIdiomas->isNotEmpty() ? $cidade->mostrasCidadesIdiomas[0]->descricao : null,
                    'imagens' => $cidade->ImagensMostrasCidades->map(function($imagem) {
                        return [
                            'id' => $imagem->id,
                            'imagem' => rafator('content/fairs/gallery/' . $imagem->imagem),
                        ];
                    }),
                ];
            }),
        ];
        
        $todosAnos = MostraAno::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->whereHas('mostra', function ($q) use ($slug) {
                $q->where([
                    'excluido' => NULL,
                    'visivel' => true,
                    'slug' => $slug
                ]);
            })
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($anoItem) {
                return [
                    'id' => $anoItem->id,
                    'ano' => $anoItem->ano,
                    'slug' => $anoItem->mostra->slug,
                ];
            });
        
        $pagina = new Pagina;

        $pagina->titulo = $ano->mostra->mostrasIdiomas[0]->titulo_pagina . ' | Dell Anno';
        $pagina->descricao = $ano->mostra->mostrasIdiomas[0]->descricao_pagina . ' | Dell Anno';
        $pagina->titulo_compartilhamento = $ano->mostra->mostrasIdiomas[0]->titulo_pagina . ' | Dell Anno';
        $pagina->descricao_compartilhamento = $ano->mostra->mostrasIdiomas[0]->descricao_pagina . ' | Dell Anno';

        list($width, $height, $type, $attr) = getimagesize(public_path('/content/fairs/thumbs/' . $ano->mostra->imagem));

        $pagina->imagem = [
            'endereco' => '/content/fairs/thumbs/' . $ano->mostra->imagem,
            'tipo' => image_type_to_mime_type($type),
            'largura' => $width,
            'altura' => $height,
        ];

        return Inertia::render('MostraAno', [
            'ano' => $anoData,
            'pagina' => $pagina,
            'todosAnos' => $todosAnos
        ]);
    }
};