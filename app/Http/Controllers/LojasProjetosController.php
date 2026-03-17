<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\ProjetoLoja;
use App\Models\Pagina;

class LojasProjetosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $projetos = ProjetoLoja::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'projetosLojasIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->paginate(6);

        $projetos->getCollection()->transform(function($projeto) {
            return [
                'id' => $projeto->id,
                'slug' => $projeto->slug,
                'imagem' => asset('content/stores/projects/thumbs/' . $projeto->imagem),
                'nome' => $projeto->projetosLojasIdiomas->isNotEmpty() ? $projeto->projetosLojasIdiomas[0]->nome : null,
                'dados' => $projeto->projetosLojasIdiomas->isNotEmpty() ? $projeto->projetosLojasIdiomas[0]->dados : null,
                'chamada' => $projeto->projetosLojasIdiomas->isNotEmpty() ? $projeto->projetosLojasIdiomas[0]->chamada : null
            ];
        });

        return Inertia::render('ProjetosLojas', [
            'projetos' => $projetos
        ]);
    }

    public function projeto($slug = null) {
        $idioma = inertia()->getShared('idioma');

        $projeto = ProjetoLoja::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true,
                'slug' => $slug
            ])
            ->with([
                'projetosLojasIdiomas' => function ($q) use ($idioma) {
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

        if (!$projeto) {
            return Inertia::location(route('Projetos.index'));
        }

        $projetoData = [
            'id' => $projeto->id,
            'nome' => $projeto->projetosLojasIdiomas->isNotEmpty() ? $projeto->projetosLojasIdiomas[0]->nome : null,
            'cidade' => $projeto->loja ? ($projeto->loja->lojasIdiomas->isNotEmpty() ? $projeto->loja->lojasIdiomas[0]->cidade : null) : null,
            'produtos' => $projeto->projetosLojasIdiomas->isNotEmpty() ? $projeto->projetosLojasIdiomas[0]->produtos : null,
            'creditos' => $projeto->projetosLojasIdiomas->isNotEmpty() ? $projeto->projetosLojasIdiomas[0]->creditos : null,
            'descricao' => $projeto->projetosLojasIdiomas->isNotEmpty() ? $projeto->projetosLojasIdiomas[0]->descricao : null,
            'conteudo' => $projeto->projetosLojasIdiomas->isNotEmpty() ? $projeto->projetosLojasIdiomas[0]->conteudo : null,
            'texto_chamada' => $projeto->projetosLojasIdiomas->isNotEmpty() ? $projeto->projetosLojasIdiomas[0]->texto_chamada : null,
            'banner' => rafator('content/stores/projects/banner/' . $projeto->banner),
            'video' => $projeto->video ? rafator('content/stores/projects/video/' . $projeto->video) : null,
            'imagens' => $projeto->imagens->map(function($img) {
                return [
                    'id' => $img->id,
                    'imagem' => rafator('content/stores/projects/gallery/b/' . $img->imagem),
                ];
            }),
        ];
        
        $todosProjetos = ProjetoLoja::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true,
                ['slug', '!=', $projeto->slug]
            ])
            ->with([
                'projetosLojasIdiomas' => function ($q) use ($idioma) {
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
            ->map(function($projetoItem) {
                return [
                    'id' => $projetoItem->id,
                    'slug' => $projetoItem->slug,
                    'imagem' => rafator('content/stores/projects/thumbs/' . $projetoItem->imagem),
                    'nome' => $projetoItem->projetosLojasIdiomas->isNotEmpty() ? $projetoItem->projetosLojasIdiomas[0]->nome : null
                ];
            });
            
        $pagina = new Pagina;

        $pagina->titulo = $projeto->projetosLojasIdiomas[0]->titulo_pagina . ' | Dell Anno';
        $pagina->descricao = $projeto->projetosLojasIdiomas[0]->descricao_pagina . ' | Dell Anno';
        $pagina->titulo_compartilhamento = $projeto->projetosLojasIdiomas[0]->titulo_pagina . ' | Dell Anno';
        $pagina->descricao_compartilhamento = $projeto->projetosLojasIdiomas[0]->descricao_pagina . ' | Dell Anno';

        list($width, $height, $type, $attr) = getimagesize(public_path('/content/stores/projects/thumbs/' . $projeto->imagem));

        $pagina->imagem = [
            'endereco' => '/content/stores/projects/thumbs/' . $projeto->imagem,
            'tipo' => image_type_to_mime_type($type),
            'largura' => $width,
            'altura' => $height,
        ];

        return Inertia::render('ProjetoLoja', [
            'pagina' => $pagina,
            'projeto' => $projetoData,
            'todosProjetos' => $todosProjetos
        ]);
    }
};