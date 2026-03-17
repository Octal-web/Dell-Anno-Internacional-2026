<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

use App\Models\Pagina;
use App\Models\Post;
use App\Models\PostCategoria;

use Carbon\Carbon;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $posts = Post::query()
            ->where([
                'excluido' => NULL,
            ])
            ->where(function($q) {
                $q->where('visivel', true)
                  ->orWhere('publicado', '>=', Carbon::now());
            })
            ->when(request()->has('categoria'), function ($query) {
                $query->whereHas('categoria', function ($q) {
                    $q->where('slug', request('categoria'));
                });
            })
            ->with([
                'postsIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                },
                'categoria' => function ($q) use ($idioma) {
                    $q->where([
                        'excluido' => null,
                        'visivel' => true
                    ])
                    ->with([
                        'postsCategoriasIdiomas' => function ($sub) use ($idioma) {
                            $sub->whereHas('idiomas', function ($r) use ($idioma) {
                                $r->where('codigo', $idioma)
                                  ->orWhere('padrao', true);
                            })
                            ->orderBy('idioma_id', 'DESC');
                        }
                    ]);
                }
            ])
            ->orderBy('publicado', 'DESC')
            ->orderBy('ordem', 'ASC')
            ->paginate(12);

        $posts->getCollection()->transform(function($post) {
            return [
                'id' => $post->id,
                'imagem' => asset('content/posts/thumbs/' . $post->imagem),
                'titulo' => $post->postsIdiomas->isNotEmpty() ? $post->postsIdiomas[0]->titulo : null,
                'previa' => $post->postsIdiomas->isNotEmpty() ? $post->postsIdiomas[0]->previa : null,
                'data' => $post->publicado->format('d/m/Y') ?? $post->criado->format('d/m/Y'),
                'categoria' => $post->categoria->postsCategoriasIdiomas->isNotEmpty() ? $post->categoria->postsCategoriasIdiomas[0]->nome : null,
                'categoria_slug' => $post->categoria->slug,
                'slug' => $post->slug,
            ];
        });

        $postsCategorias = PostCategoria::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'postsCategoriasIdiomas' => function ($q) use ($idioma) {
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
            ->map(function($categoria) {
                return [
                    'id' => $categoria->id,
                    'nome' => $categoria->postsCategoriasIdiomas->isNotEmpty() ? $categoria->postsCategoriasIdiomas[0]->nome : null,
                    'slug' => $categoria->slug
                ];
            });

        return Inertia::render('Blog', [
            'posts' => $posts,
            'postsCategorias' => $postsCategorias
        ]);
    }

    /**
     * Show the specified resource.
     *
     * @param  string  $slug
     * @return \Illuminate\Http\Response
     */
    public function post($slug) {
        if (!$slug) {
            return Inertia::location(route('Blog.index'));
        }

        $idioma = inertia()->getShared('idioma');

        $post = Post::query()
            ->where([
                'excluido' => null,
                'slug' => $slug
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
            ->first();

        if(!$post) {
            return Inertia::location(route('Blog.index'));
        }

        $pagina = new Pagina;

        $pagina->titulo = $post->postsIdiomas[0]->titulo_pagina . ' | Dell Anno';
        $pagina->descricao = $post->postsIdiomas[0]->descricao_pagina . ' | Dell Anno';
        $pagina->titulo_compartilhamento = $post->postsIdiomas[0]->titulo_pagina . ' | Dell Anno';
        $pagina->descricao_compartilhamento = $post->postsIdiomas[0]->descricao_pagina . ' | Dell Anno';

        list($width, $height, $type, $attr) = getimagesize(public_path('/content/posts/thumbs/' . $post->imagem));

        $pagina->imagem = [
            'endereco' => '/content/posts/thumbs/' . $post->imagem,
            'tipo' => image_type_to_mime_type($type),
            'largura' => $width,
            'altura' => $height,
        ];

        $postData = [
            'id' => $post->id,
            'banner' => asset('content/posts/banner/' . $post->banner),
            'titulo' => $post->postsIdiomas->isNotEmpty() ? $post->postsIdiomas[0]->titulo : null,
            'previa' => $post->postsIdiomas->isNotEmpty() ? $post->postsIdiomas[0]->previa : null,
            'conteudo' => $post->postsIdiomas->isNotEmpty() ? $post->postsIdiomas[0]->conteudo : null,
            'categoria' => $post->categoria->postsCategoriasIdiomas->isNotEmpty() ? $post->categoria->postsCategoriasIdiomas[0]->nome : null,
            'data' => $post->publicado->format('d/m/Y') ?? $post->criado->format('d/m/Y'),
            'slug' => $post->slug,
        ];

        $posts = Post::query()
            ->where([
                'excluido' => NULL,
                ['slug', '!=', $slug]
            ])
            ->where(function($q) {
                $q->where('visivel', true)
                  ->orWhere('publicado', '>=', Carbon::now());
            })
            ->inRandomOrder()
            ->limit(3)
            ->get()
            ->map(function($post) {
                return [
                    'id' => $post->id,
                    'imagem' => asset('content/posts/thumbs/' . $post->imagem),
                    'titulo' => $post->postsIdiomas->isNotEmpty() ? $post->postsIdiomas[0]->titulo : null,
                    'previa' => $post->postsIdiomas->isNotEmpty() ? $post->postsIdiomas[0]->previa : null,
                    'data' => $post->publicado->format('d/m/Y') ?? $post->criado->format('d/m/Y'),
                    'categoria' => $post->categoria->postsCategoriasIdiomas->isNotEmpty() ? $post->categoria->postsCategoriasIdiomas[0]->nome : null,
                    'categoria_slug' => $post->categoria->slug,
                    'slug' => $post->slug,
                ];
            });

        return Inertia::render('Post', [
            'pagina' => $pagina,
            'post' => $postData,
            'posts' => $posts
        ]);
    }

}