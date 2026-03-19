<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Slide;
use App\Models\Campanha;
use App\Models\Destaque;
use App\Models\Produto;
use App\Models\Post;

use Carbon\Carbon;

class HomeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $slides = Slide::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'slidesIdiomas' => function ($q) use ($idioma) {
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
            ->map(function($slide) {
                return [
                    'id' => $slide->id,
                    'tipo' => $slide->tipo,
                    'imagem' => $slide->tipo == 'imagem' ? asset('content/slides/d/' . $slide->imagem) : null,
                    'imagem_mobile' => $slide->tipo == 'imagem' ? asset('content/slides/m/' . $slide->imagem_mobile) : null,
                    'video' => $slide->tipo == 'video' ? asset('content/slides/videos/d/' . $slide->video) : null,
                    'video_mobile' => $slide->tipo == 'video' ? asset('content/slides/videos/m/' . $slide->video_mobile) : null,
                    'link' => $slide->slidesIdiomas->isNotEmpty() ? $slide->slidesIdiomas[0]->link : null,
                    'texto_botao' => $slide->slidesIdiomas->isNotEmpty() ? $slide->slidesIdiomas[0]->texto_botao : null,
                ];
            });

        $campanhas = Campanha::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'campanhasIdiomas' => function ($q) use ($idioma) {
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
            ->map(function($campanha) {
                return [
                    'id' => $campanha->id,
                    'imagem' => asset('content/campaigns/thumbs/' . $campanha->imagem),
                    'titulo' => $campanha->campanhasIdiomas->isNotEmpty() ? $campanha->campanhasIdiomas[0]->titulo : null,
                    'descricao' => $campanha->campanhasIdiomas->isNotEmpty() ? $campanha->campanhasIdiomas[0]->descricao : null,
                    'link' => $campanha->link,
                ];
            });

        $destaques = Destaque::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'destaquesIdiomas' => function ($q) use ($idioma) {
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
            ->map(function($destaque) {
                return [
                    'id' => $destaque->id,
                    'tamanho' => $destaque->tamanho,
                    'imagem' => $destaque->imagem ? asset('content/highlights/thumbs/' . $destaque->imagem) : null,
                    'video' => $destaque->tipo == 'video' ? asset('content/highlights/video/' . $destaque->video) : null,
                    'titulo' => $destaque->destaquesIdiomas->isNotEmpty() ? $destaque->destaquesIdiomas[0]->titulo : null,
                    'texto' => $destaque->destaquesIdiomas->isNotEmpty() ? $destaque->destaquesIdiomas[0]->texto : null,
                    'texto_botao' => $destaque->destaquesIdiomas->isNotEmpty() ? $destaque->destaquesIdiomas[0]->texto_botao : null,
                    'link' => $destaque->destaquesIdiomas->isNotEmpty() ? $destaque->destaquesIdiomas[0]->link : null,
                ];
            });

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
                'imagens' => function ($q) use ($idioma) {
                    $q->where([
                        'excluido' => NULL,
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
                    'nome' => $produto->produtosIdiomas->isNotEmpty() ? $produto->produtosIdiomas[0]->nome : null,
                    'descricao' => $produto->produtosIdiomas->isNotEmpty() ? $produto->produtosIdiomas[0]->descricao : null,
                    'slug' => $produto->slug,
                    'imagens' => $produto->imagens->map(function($imagem) {
                        return [
                            'id' => $imagem->id,
                            'imagem' => rafator('content/products/gallery/' . $imagem->imagem),
                        ];
                    }),
                ];
            });

        $posts = Post::query()
            ->where([
                'excluido' => NULL,
            ])
            ->where(function($q) {
                $q->where('visivel', true)
                  ->orWhere('publicado', '>=', Carbon::now());
            })
            ->with([
                'postsIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('publicado', 'DESC')
            ->orderBy('ordem', 'ASC')
            ->limit(8)
            ->get()
            ->map(function($post) {
                return [
                    'id' => $post->id,
                    'imagem' => asset('content/posts/thumbs/' . $post->imagem),
                    'titulo' => $post->postsIdiomas->isNotEmpty() ? $post->postsIdiomas[0]->titulo : null,
                    'previa' => $post->postsIdiomas->isNotEmpty() ? $post->postsIdiomas[0]->previa : null,
                    'slug' => $post->slug
                ];
            });

        return Inertia::render('Home', [
            'slides' => $slides,
            'campanhas' => $campanhas,
            'produtos' => $produtos,
            'destaques' => $destaques,
            'posts' => $posts
        ]);
    }
};