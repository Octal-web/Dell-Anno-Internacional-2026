<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Loja;
use App\Models\Conteudo;
use App\Models\ImagemShowroom;
use App\Models\ImagemProjetoLoja;
use App\Models\FaseProjeto;
use App\Models\Pagina;

class LojasController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $paises = [226];

        if (request()->has('region')) {
            if (request('region') == 'usa') {
                $paises = [226];
            } else if (request('region') == 'latin-america') {
                $paises = [10, 26, 30, 43, 47, 52, 55, 61, 62, 64, 88, 92, 95, 138, 154, 165, 167, 168, 173, 202, 228, 231];
            } else if (request('region') == 'brazil') {
                $paises = [30];
            }
        }

        $lojas = Loja::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->whereIn('pais_id', $paises)
            ->with([
                'lojasIdiomas' => function ($q) use ($idioma) {
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
            ->map(function($loja) {
                return [
                    'id' => $loja->id,
                    'slug' => $loja->slug,
                    'link_lp' => $loja->link_lp,
                    'imagem' => rafator('content/stores/s/' . $loja->imagem),
                    'cidade' => $loja->lojasIdiomas->isNotEmpty() ? $loja->lojasIdiomas[0]->cidade : null,
                    'estado' => $loja->lojasIdiomas->isNotEmpty() ? $loja->lojasIdiomas[0]->estado : null,
                    'endereco' => $loja->lojasIdiomas->isNotEmpty() ? $loja->lojasIdiomas[0]->endereco : null,
                    'contato' => $loja->lojasIdiomas->isNotEmpty() ? $loja->lojasIdiomas[0]->contato : null
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

        return Inertia::render('Lojas', [
            'lojas' => $lojas,
            'chamadaForm' => $chamadaForm
        ]);
    }

    public function loja($slug = null) {
        $idioma = inertia()->getShared('idioma');

        $loja = Loja::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true,
                'slug' => $slug,
                'link_lp' => NULL
            ])
            ->with([
                'lojasIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                },
                // 'imagens' => function ($q) use ($idioma) {
                //     $q->where([
                //         'excluido' => NULL,
                //         'visivel' => true
                //     ])
                //     ->with('imagensLojasIdiomas', function ($query) use ($idioma) {
                //         $query->whereHas('idiomas', function ($r) use ($idioma) {
                //             $r->where('codigo', $idioma)
                //             ->orWhere('padrao', true);
                //         })
                //         ->orderBy('idioma_id', 'DESC');
                //     })
                //     ->orderBy('ordem', 'ASC')
                //     ->orderBy('id', 'DESC');
                // }
            ])
            ->first();

        if (!$loja) {
            return Inertia::location(route('Lojas.index'));
        }

        $imagensShowroom = ImagemShowroom::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true,
                'destaque' => true
            ])
            ->whereHas('showroom.loja', function ($q) use ($slug) {
                $q->where('slug', $slug);
            })
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()   
            ->map(function($img) {
                return [
                    'id' => $img->id,
                    'imagem' => rafator('content/showrooms/gallery/' . $img->imagem),
                ];
            });

        $imagensProjetos = ImagemProjetoLoja::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true,
                'destaque' => true
            ])
            ->whereHas('projeto.loja', function ($q) use ($slug) {
                $q->where('slug', $slug);
            })
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()   
            ->map(function($img) {
                return [
                    'id' => $img->id,
                    'imagem' => rafator('content/stores/projects/gallery/s/' . $img->imagem),
                    'imagem_zoom' => rafator('content/stores/projects/gallery/b/' . $img->imagem),
                ];
            });

        $lojaData = [
            'id' => $loja->id,
            'nome' => $loja->lojasIdiomas->isNotEmpty() ? $loja->lojasIdiomas[0]->nome : null,
            'chamada' => $loja->lojasIdiomas->isNotEmpty() ? $loja->lojasIdiomas[0]->chamada : null,
            'endereco' => $loja->lojasIdiomas->isNotEmpty() ? $loja->lojasIdiomas[0]->endereco : null,
            'contato' => $loja->lojasIdiomas->isNotEmpty() ? $loja->lojasIdiomas[0]->contato : null,
            'horario_atendimento' => $loja->lojasIdiomas->isNotEmpty() ? $loja->lojasIdiomas[0]->horario_atendimento : null,
            'slug' => $loja->slug,
            'link_showroom' => $loja->link_showroom,
            'imagem' => rafator('content/stores/b/' . $loja->imagem),
            'imagem_showroom' => rafator('content/stores/showroom/' . $loja->imagem_showroom),
            'logo' => rafator('content/stores/logo/' . $loja->logo)
        ];
        
        $todasLojas = Loja::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'lojasIdiomas' => function ($q) use ($idioma) {
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
            ->map(function($loja) {
                return [
                    'id' => $loja->id,
                    'slug' => $loja->slug,
                    'imagem' => rafator('content/stores/s/' . $loja->imagem),
                    'cidade' => $loja->lojasIdiomas->isNotEmpty() ? $loja->lojasIdiomas[0]->cidade : null,
                    'estado' => $loja->lojasIdiomas->isNotEmpty() ? $loja->lojasIdiomas[0]->estado : null,
                    'endereco' => $loja->lojasIdiomas->isNotEmpty() ? $loja->lojasIdiomas[0]->endereco : null,
                    'contato' => $loja->lojasIdiomas->isNotEmpty() ? $loja->lojasIdiomas[0]->contato : null
                ];
            });

        $fasesProjetos = FaseProjeto::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'fasesProjetosIdiomas' => function ($q) use ($idioma) {
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
            ->map(function($fase) {
                return [
                    'id' => $fase->id,
                    'imagem' => rafator('content/stages/thumbs/' . $fase->imagem),
                    'titulo' => $fase->fasesProjetosIdiomas->isNotEmpty() ? $fase->fasesProjetosIdiomas[0]->titulo : null,
                    'descricao' => $fase->fasesProjetosIdiomas->isNotEmpty() ? $fase->fasesProjetosIdiomas[0]->descricao : null
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
        
        $pagina = new Pagina;

        $pagina->titulo = $loja->lojasIdiomas[0]->titulo_pagina . ' | Dell Anno';
        $pagina->descricao = $loja->lojasIdiomas[0]->descricao_pagina . ' | Dell Anno';
        $pagina->titulo_compartilhamento = $loja->lojasIdiomas[0]->titulo_pagina . ' | Dell Anno';
        $pagina->descricao_compartilhamento = $loja->lojasIdiomas[0]->descricao_pagina . ' | Dell Anno';

        list($width, $height, $type, $attr) = getimagesize(public_path('/content/stores/s/' . $loja->imagem));

        $pagina->imagem = [
            'endereco' => '/content/stores/s/' . $loja->imagem,
            'tipo' => image_type_to_mime_type($type),
            'largura' => $width,
            'altura' => $height,
        ];

        return Inertia::render('Loja', [
            'pagina' => $pagina,
            'loja' => $lojaData,
            'todasLojas' => $todasLojas,
            'chamadaForm' => $chamadaForm,
            'imagensShowroom' => $imagensShowroom,
            'imagensProjetos' => $imagensProjetos,
            'fasesProjetos' => $fasesProjetos
        ]);
    }
};