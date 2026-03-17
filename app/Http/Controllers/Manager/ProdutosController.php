<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use App\Models\Produto;
use App\Models\ProdutoIdioma;

use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostProductRequest;

use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

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
                'excluido' => NULL
            ])
            ->with([
                'produtosIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($produto) {
                return [
                    'id' => $produto->id,
                    'visivel' => $produto->visivel,
                    'imagem' => rafator('content/products/thumbs/' . $produto->imagem),
                    'nome' => $produto->produtosIdiomas->isNotEmpty() ? $produto->produtosIdiomas[0]->nome : null,
                ];
            });

        return Inertia::render('Manager/Produtos/index', [
            'produtos' => $produtos
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function adicionar() {
        return Inertia::render('Manager/Produtos/adicionar');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostProductRequest $request) {
        if($request->ajax()){
            $idioma = inertia()->getShared('idioma');
            
            $produto = new Produto;
            $produto_idioma = new ProdutoIdioma;
            
            $slugBase = Str::slug($request['titulo']);
            $slug = $slugBase;

            $count = 1;

            while (Produto::where('slug', $slug)->exists()) {
                $slug = $slugBase . '-' . $count;
                $count++;
            }

            $produto->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            $produto->banner = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_banner')->extension());

            $produto->slug = $slug;

            $response = $produto->save();

            $produto_idioma->nome = $request->nome;
            $produto_idioma->descricao = $request->descricao;
            $produto_idioma->titulo_pagina = $request->titulo_pagina;
            $produto_idioma->descricao_pagina = $request->descricao_pagina;

            $produto_idioma->produto_id = $produto->id;
            $produto_idioma->idioma_id = $idioma->id;

            $response = $produto_idioma->save();

            if ($response) {
                $image = $request->file('img')->move(public_path('content/products/thumbs/'), $produto->imagem);
                $image = $request->file('img_banner')->move(public_path('content/products/banner/'), $produto->banner);

                return to_route('Manager.Produto.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }
        }
    }

    
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function editar($id) {
        if (!$id) {
            return Inertia::location(route('Manager.Produtos.index'));
        }
        
        $idiomas = Idioma::query()
            ->orderBy('padrao', 'DESC')
            ->orderBy('id', 'DESC')
            ->get();

        $idioma = request('lang');

        $produto = Produto::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'produtosIdiomas' => function ($q) use ($idioma) {
                    $q->when($idioma, function ($r) use($idioma) {
                        $r->whereHas('idiomas', function($query) use($idioma) {
                            $query->where('codigo', $idioma);
                        });
                    })
                    ->when(!$idioma, function ($r) {
                        $r->whereHas('idiomas', function($query) {
                            $query->where('padrao', true);
                        });
                    });
                }
            ])
            ->first();

        if(!$produto) {
            return Inertia::location(route('Manager.Produtos.index'));
        }

        $idioma = inertia()->getShared('idioma');

        $produtoData = [
            'id' => $produto->id,
            'imagem' => rafator('content/products/thumbs/' . $produto->imagem),
            'banner' => rafator('content/products/banner/' . $produto->banner),
            'nome' => count($produto->produtosIdiomas) ? $produto->produtosIdiomas[0]->nome : null,
            'descricao' => count($produto->produtosIdiomas) ? $produto->produtosIdiomas[0]->descricao : null,
            'titulo_pagina' => count($produto->produtosIdiomas) ? $produto->produtosIdiomas[0]->titulo_pagina : null,
            'descricao_pagina' => count($produto->produtosIdiomas) ? $produto->produtosIdiomas[0]->descricao_pagina : null,
        ];
        
        return Inertia::render('Manager/Produtos/editar', [
            'idiomas' => $idiomas,
            'idioma' => $idioma,
            'produto' => $produtoData
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizar(PostProductRequest $request, $id) {
        if($request->ajax()){
            $produto = Produto::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $produto_idioma = ProdutoIdioma::query()
                ->where([
                    'excluido' => null,
                    'produto_id' => $produto->id
                ])
                ->when($idioma, function ($q) use($idioma) {
                    $q->whereHas('idiomas', function($query) use($idioma) {
                        $query->where('codigo', $idioma);
                    });
                })
                ->when(!$idioma, function ($q) {
                    $q->whereHas('idiomas', function($query) {
                        $query->where('padrao', true);
                    });
                })
                ->first();

            if (!$produto) {
                return to_route('Manager.Produtos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($produto, 'produtosIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Produtos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Produtos.index'));
            }

            if (!$produto_idioma) {
                $produto_idioma = new ProdutoIdioma;

                $produto_idioma->produto_id = $produto->id;
                $produto_idioma->idioma_id = $idioma;
            } else {
                $copier = new DeepCopy();
                $produtoOriginal = $copier->copy($produto);
            }
            
            $slug = $produto->slug;

            if (!$request->query('lang')) {
                if ($request['titulo'] !== $produto_idioma->titulo) {
                    $slugBase = Str::slug($request['titulo']);
                    $slug = $slugBase;
                    $count = 1;

                    while (Produto::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                        $slug = $slugBase . '-' . $count;
                        $count++;
                    }
                }
            }

            if ($request->file('img') && $request->file('img')->getError() == 0) {
                $produto->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            }

            if ($request->file('img_banner') && $request->file('img_banner')->getError() == 0) {
                $produto->banner = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_banner')->extension());
            }
            
            $produto->slug = $slug;

            $produto_idioma->nome = $request->nome;
            $produto_idioma->descricao = $request->descricao;
            $produto_idioma->titulo_pagina = $request->titulo_pagina;
            $produto_idioma->descricao_pagina = $request->descricao_pagina;

            $response = $produto->save();
            $response = $produto_idioma->save();

            if ($response) {
                if ($request->file('img') && $request->file('img')->getError() == 0) {
                    if ($produto->imagem && isset($produtoOriginal) && File::exists('content/products/thumbs/' . $produtoOriginal->imagem)) {
                        File::delete('content/products/thumbs/' . $produtoOriginal->imagem);
                    }
                    
                    $image = $request->file('img')->move(public_path('content/products/thumbs/'), $produto->imagem);
                }

                if ($request->file('img_banner') && $request->file('img_banner')->getError() == 0) {
                    if ($produto->banner && isset($produtoOriginal) && File::exists('content/products/banner/' . $produtoOriginal->banner)) {
                        File::delete('content/products/banner/' . $produtoOriginal->banner);
                    }
                    
                    $image = $request->file('img_banner')->move(public_path('content/products/banner/'), $produto->banner);
                }

                return to_route('Manager.Produtos.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }
        }

        return to_route('Manager.Produtos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
    }

    /**
     * Set the specified resource as deleted.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function excluir(Request $request, $id) {
        if ($request->ajax()){
            if (!$id) {
                return $request->header('referer');
            }

            $exclusao = Produto::query()
                ->where([
                    'excluido' => NULL,
                    'id' => $id
                ])
                ->update([
                    'excluido' => Carbon::now()
                ]);

            if ($exclusao == true) {
                return redirect()->back()->with('message', ['type' => 'alert', 'msg' => 'Registro excluído com sucesso.']);
            } else {
                return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Não foi possível excluir o registro.']);
            }
        }
    }

    /**
     * Set the specified resource to visible/invisible.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function visibilidade(Request $request, $id) {
        if ($request->ajax()){
            if (!$id) {
                return redirect()->back()->with(['type' => 'error', 'message' => 'Registro não encontrado!']);
            }

            $response = Produto::query()
                ->where([
                    'id' => $id,
                    'excluido' => NULL
                ])
                ->first();

            if (!$response) {
                return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Registro não encontrado!']);
            }
    
            $response->visivel = 1 - $response->visivel;
            $response->save();
    
            if ($response) {
                return redirect()->back()->with('message', ['type' => 'success', 'msg' => 'Visibilidade alterada com sucesso!']);
            }
            else {
                return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Visibilidade não alterada!']);
            }
        }

        return $request->header('referer');
    }

    /**
     * Update the order of the specified resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function ordenar(Request $request) {
        if ($request->ajax()){
            $erros = [];

            if ($request->odr && is_array($request->odr)) {
                foreach ($request->odr as $key => $value) {
                    $registro = Produto::query()
                        ->where([
                            'excluido' => NULL,
                            'id' => $value
                        ])
                        ->update([
                            'ordem' => $key,
                        ]);

                    $errors[] = $registro;
                }
            }

            if (!count($erros)) {
                return redirect()->back()->with('message', ['type' => 'success', 'msg' => 'Registros reordenados com sucesso!']);
            } else {
                return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Registros não reordenados, tente novamente mais tarde!']);
            }
        }

        return redirect()->back();
    }
};