<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Produto;
use App\Models\Conteudo;
use App\Models\Projeto;
use App\Models\Pagina;

class ProdutosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $produtos = Produto::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'produtosIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                },
                'imagens' => function ($q) {
                    $q->where([
                        'excluido' => null,
                        'visivel' => true
                    ])
                    ->orderBy('ordem', 'ASC')
                    ->orderBy('id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($produto) {
                return [
                    'id' => $produto->id,
                    'slug' => $produto->slug,
                    'imagem' => rafator('content/products/thumbs/' . $produto->imagem),
                    'nome' => $produto->produtosIdiomas->isNotEmpty() ? $produto->produtosIdiomas[0]->nome : null,
                    'descricao' => $produto->produtosIdiomas->isNotEmpty() ? $produto->produtosIdiomas[0]->descricao : null
                ];
            });

        return Inertia::render('Produtos', [
            'produtos' => $produtos
        ]);
    }

    // public function produto($slug = null) {
    //     $idioma = inertia()->getShared('idioma');

    //     $produto = Produto::query()
    //         ->where([
    //             'excluido' => NULL,
    //             'visivel' => true,
    //             'slug' => $slug
    //         ])
    //         ->with([
    //             'produtosIdiomas' => function ($q) use ($idioma) {
    //                 $q->whereHas('idiomas', function ($r) use ($idioma) {
    //                     $r->where('codigo', $idioma)
    //                       ->orWhere('padrao', true);
    //                 })
    //                 ->orderBy('idioma_id', 'DESC');
    //             },
    //             'imagens' => function ($q) use ($idioma) {
    //                 $q->where([
    //                     'excluido' => NULL,
    //                     'visivel' => true
    //                 ])
    //                 ->with('imagensProdutosIdiomas', function ($query) use ($idioma) {
    //                     $query->whereHas('idiomas', function ($r) use ($idioma) {
    //                         $r->where('codigo', $idioma)
    //                         ->orWhere('padrao', true);
    //                     })
    //                     ->orderBy('idioma_id', 'DESC');
    //                 })
    //                 ->orderBy('ordem', 'ASC')
    //                 ->orderBy('id', 'DESC');
    //             }
    //         ])
    //         ->first();

    //     if (!$produto) {
    //         return Inertia::location(route('Produtos.index'));
    //     }

    //     $produtoData = [
    //         'id' => $produto->id,
    //         'nome' => $produto->produtosIdiomas->isNotEmpty() ? $produto->produtosIdiomas[0]->nome : null,
    //         'descricao' => $produto->produtosIdiomas->isNotEmpty() ? $produto->produtosIdiomas[0]->descricao : null,
    //         'slug' => $produto->slug,
    //         'imagens' => $produto->imagens->map(function($img) {
    //             return [
    //                 'id' => $img->id,
    //                 'imagem' => rafator('content/products/gallery/' . $img->imagem),
    //                 'texto' => $img->imagensProdutosIdiomas->isNotEmpty() ? $img->imagensProdutosIdiomas[0]->texto : null,
    //             ];
    //         }),
    //     ];
        
    //     $todosProdutos = Produto::query()
    //         ->where([
    //             'excluido' => NULL,
    //             'visivel' => true
    //         ])
    //         ->with([
    //             'produtosIdiomas' => function ($q) use ($idioma) {
    //                 $q->whereHas('idiomas', function ($r) use ($idioma) {
    //                     $r->where('codigo', $idioma)
    //                       ->orWhere('padrao', true);
    //                 })
    //                 ->orderBy('idioma_id', 'DESC');
    //             }
    //         ])
    //         ->orderBy('ordem', 'ASC')
    //         ->orderBy('id', 'DESC')
    //         ->get()
    //         ->map(function($produto) {
    //             return [
    //                 'id' => $produto->id,
    //                 'slug' => $produto->slug,
    //                 'nome' => $produto->produtosIdiomas->isNotEmpty() ? $produto->produtosIdiomas[0]->nome : null,
    //             ];
    //         });
        
    //     $chamadaForm = Conteudo::query()
    //         ->where([
    //             'excluido' => NULL,
    //             'id' => 14
    //         ])
    //         ->with([
    //             'conteudosIdiomas' => function ($q) use ($idioma) {
    //                 $q->whereHas('idiomas', function ($r) use ($idioma) {
    //                     $r->where('codigo', $idioma)
    //                       ->orWhere('padrao', true);
    //                 })
    //                 ->orderBy('idioma_id', 'DESC');
    //             }
    //         ])
    //         ->first();

    //     if ($chamadaForm) {
    //         $chamadaForm = [
    //             'id' => $chamadaForm->id,
    //             'titulo' => $chamadaForm->conteudosIdiomas->isNotEmpty() ? $chamadaForm->conteudosIdiomas[0]->titulo : null,
    //             'texto' => $chamadaForm->conteudosIdiomas->isNotEmpty() ? $chamadaForm->conteudosIdiomas[0]->texto : null,
    //         ];
    //     }
        
    //     $pagina = new Pagina;

    //     $pagina->titulo = $produto->produtosIdiomas[0]->titulo_pagina . ' | Dell Anno';
    //     $pagina->descricao = $produto->produtosIdiomas[0]->descricao_pagina . ' | Dell Anno';
    //     $pagina->titulo_compartilhamento = $produto->produtosIdiomas[0]->titulo_pagina . ' | Dell Anno';
    //     $pagina->descricao_compartilhamento = $produto->produtosIdiomas[0]->descricao_pagina . ' | Dell Anno';

    //     list($width, $height, $type, $attr) = getimagesize(public_path('/content/products/thumbs/' . $produto->imagem));

    //     $pagina->imagem = [
    //         'endereco' => '/content/products/thumbs/' . $produto->imagem,
    //         'tipo' => image_type_to_mime_type($type),
    //         'largura' => $width,
    //         'altura' => $height,
    //     ];
        
    //     return Inertia::render('Produto', [
    //         'pagina' => $pagina,
    //         'produto' => $produtoData,
    //         'todosProdutos' => $todosProdutos,
    //         'chamadaForm' => $chamadaForm
    //     ]);
    // }

    public function produto($slug = null) {
        $idioma = inertia()->getShared('idioma');

        $produto = Produto::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true,
                'slug' => $slug
            ])
            ->with([
                'produtosIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                },
                'ambientes' => function ($q) use ($idioma) {
                    $q->where([
                        'excluido' => NULL,
                        'visivel' => true
                    ])
                    ->with([
                        'ambientesIdiomas' => function ($query) use ($idioma) {
                            $query->whereHas('idiomas', function ($r) use ($idioma) {
                                $r->where('codigo', $idioma)
                                ->orWhere('padrao', true);
                            })
                            ->orderBy('idioma_id', 'DESC');
                        },
                        'projetos' => function ($query) {
                            $query->where([
                                'excluido' => NULL,
                                'visivel' => true
                            ])
                            ->orderBy('ordem', 'ASC')
                            ->orderBy('id', 'DESC');
                        }
                    ])
                    ->orderBy('ordem', 'ASC')
                    ->orderBy('id', 'DESC');
                }
            ])
            ->first();

        if (!$produto) {
            return Inertia::location(route('Produtos.index'));
        }

        $produtoData = [
            'id' => $produto->id,
            'banner' => rafator('content/products/banner/' . $produto->banner),
            'nome' => $produto->produtosIdiomas->isNotEmpty() ? $produto->produtosIdiomas[0]->nome : null,
            'descricao' => $produto->produtosIdiomas->isNotEmpty() ? $produto->produtosIdiomas[0]->descricao : null,
            'slug' => $produto->slug,
            'ambientes' => $produto->ambientes->map(function($ambiente) {
                return [
                    'id' => $ambiente->id,
                    'nome' => $ambiente->ambientesIdiomas->isNotEmpty() ? $ambiente->ambientesIdiomas[0]->nome : null,
                    'descricao_curta' => $ambiente->ambientesIdiomas->isNotEmpty() ? $ambiente->ambientesIdiomas[0]->descricao_curta : null,
                    'projetos' => $ambiente->projetos->map(function($projeto) {
                        return [
                            'id' => $projeto->id,
                            'slug' => $projeto->slug,
                            'imagem' => rafator('content/projects/thumbs/' . $projeto->imagem),
                        ];
                    }),
                ];
            }),
        ];
        
        $chamadaForm = Conteudo::query()
            ->where([
                'excluido' => NULL,
                'id' => 14
            ])
            ->with([
                'conteudosIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->first();

        if ($chamadaForm) {
            $chamadaForm = [
                'id' => $chamadaForm->id,
                'titulo' => $chamadaForm->conteudosIdiomas->isNotEmpty() ? $chamadaForm->conteudosIdiomas[0]->titulo : null,
                'texto' => $chamadaForm->conteudosIdiomas->isNotEmpty() ? $chamadaForm->conteudosIdiomas[0]->texto : null,
            ];
        }
        
        $pagina = new Pagina;

        $pagina->titulo = $produto->produtosIdiomas[0]->titulo_pagina . ' | Dell Anno';
        $pagina->descricao = $produto->produtosIdiomas[0]->descricao_pagina . ' | Dell Anno';
        $pagina->titulo_compartilhamento = $produto->produtosIdiomas[0]->titulo_pagina . ' | Dell Anno';
        $pagina->descricao_compartilhamento = $produto->produtosIdiomas[0]->descricao_pagina . ' | Dell Anno';

        list($width, $height, $type, $attr) = getimagesize(public_path('/content/products/thumbs/' . $produto->imagem));

        $pagina->imagem = [
            'endereco' => '/content/products/thumbs/' . $produto->imagem,
            'tipo' => image_type_to_mime_type($type),
            'largura' => $width,
            'altura' => $height,
        ];
        
        return Inertia::render('Produto', [
            'pagina' => $pagina,
            'produto' => $produtoData,
            'chamadaForm' => $chamadaForm
        ]);
    }
    
    public function projeto($slug = null, $projeto = null) {
        $idioma = inertia()->getShared('idioma');

        $projetoItem = Projeto::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true,
                'slug' => $projeto
            ])
            ->wherehas('ambiente.produto', function ($q) use ($slug) {
                $q->where([
                    'excluido' => NULL,
                    'visivel' => true,
                    'slug' => $slug
                ]);
            })
            ->with([
                'projetosIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                },
                'ambiente' => function ($q) use ($idioma) {
                    $q->where([
                        'excluido' => NULL,
                        'visivel' => true
                    ])
                    ->with([
                        'ambientesIdiomas' => function ($query) use ($idioma) {
                            $query->whereHas('idiomas', function ($r) use ($idioma) {
                                $r->where('codigo', $idioma)
                                ->orWhere('padrao', true);
                            })
                            ->orderBy('idioma_id', 'DESC');
                        }
                    ]);
                }
            ])
            ->first();

        if (!$projetoItem) {
            return Inertia::location(route('Produtos.index'));
        }

        $projetoData = [
            'id' => $projetoItem->id,
            'detalhes' => $projetoItem->projetosIdiomas->isNotEmpty() ? $projetoItem->projetosIdiomas[0]->detalhes : null,
            'conteudo' => $projetoItem->projetosIdiomas->isNotEmpty() ? $projetoItem->projetosIdiomas[0]->conteudo : null,
            'ambiente_nome' => $projetoItem->ambiente->ambientesIdiomas->isNotEmpty() ? $projetoItem->ambiente->ambientesIdiomas[0]->nome : null,
            'ambiente_descricao' => $projetoItem->ambiente->ambientesIdiomas->isNotEmpty() ? $projetoItem->ambiente->ambientesIdiomas[0]->descricao : null,
            'slug' => $projetoItem->slug,
            'imagens' => $projetoItem->imagens->map(function($img) {
                return [
                    'id' => $img->id,
                    'imagem' => rafator('content/projects/gallery/' . $img->imagem),
                    // 'imagem_zoom' => rafator('content/projects/gallery/b/' . $img->imagem),
                ];
            }),
        ];
        
        $outrosProdutos = Produto::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true,
                ['slug', '!=', $slug]
            ])
            ->with([
                'produtosIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->limit(2)
            ->get()
            ->map(function($produto) {
                return [
                    'id' => $produto->id,
                    'slug' => $produto->slug,
                    'imagem' => rafator('content/products/thumbs/' . $produto->imagem),
                    'nome' => $produto->produtosIdiomas->isNotEmpty() ? $produto->produtosIdiomas[0]->nome : null,
                    'descricao' => $produto->produtosIdiomas->isNotEmpty() ? $produto->produtosIdiomas[0]->descricao : null
                ];
            });
        
        
        $chamadaForm = Conteudo::query()
            ->where([
                'excluido' => NULL,
                'id' => 14
            ])
            ->with([
                'conteudosIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->first();

        if ($chamadaForm) {
            $chamadaForm = [
                'id' => $chamadaForm->id,
                'titulo' => $chamadaForm->conteudosIdiomas->isNotEmpty() ? $chamadaForm->conteudosIdiomas[0]->titulo : null,
                'texto' => $chamadaForm->conteudosIdiomas->isNotEmpty() ? $chamadaForm->conteudosIdiomas[0]->texto : null,
            ];
        }

        return Inertia::render('Projeto', [
            'projeto' => $projetoData,
            'outrosProdutos' => $outrosProdutos,
            'chamadaForm' => $chamadaForm
        ]);
    }
};