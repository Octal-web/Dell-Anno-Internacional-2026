<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Post;
use App\Models\PostCategoria;

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
                'excluido' => NULL
            ])
            ->with([
                'postsIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($post) {
                return [
                    'id' => $post->id,
                    'visivel' => $post->visivel ? true : false,
                    'imagem' => asset('content/posts/thumbs/' . $post->imagem),
                    'titulo' => $post->postsIdiomas->isNotEmpty() ? $post->postsIdiomas[0]->titulo : null,
                ];
            });

        $postsCategorias = PostCategoria::query()
            ->where([
                'excluido' => NULL
            ])
            ->with([
                'postsCategoriasIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($post) {
                return [
                    'id' => $post->id,
                    'visivel' => $post->visivel ? true : false,
                    'nome' => $post->postsCategoriasIdiomas->isNotEmpty() ? $post->postsCategoriasIdiomas[0]->nome : null,
                ];
            });

        return Inertia::render('Manager/Blog/index', [
            'posts' => $posts,
            'postsCategorias' => $postsCategorias
        ]);
    }
};