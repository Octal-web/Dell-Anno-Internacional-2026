<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use App\Models\ProjetoLoja;
use App\Models\ProjetoLojaIdioma;
use App\Models\Loja;
use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostStoreProjectRequest;

use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

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
                'excluido' => NULL
            ])
            ->with([
                'projetosLojasIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($projeto) {
                return [
                    'id' => $projeto->id,
                    'visivel' => $projeto->visivel,
                    'imagem' => rafator('content/stores/projects/thumbs/' . $projeto->imagem),
                    'nome' => $projeto->projetosLojasIdiomas->isNotEmpty() ? $projeto->projetosLojasIdiomas[0]->nome : null,
                ];
            });

        return Inertia::render('Manager/Lojas/Projetos/index', [
            'projetos' => $projetos
        ]);
    }   

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function adicionar() {
        $lojas = Loja::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'pais',
                'lojasIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function ($loja) {
                return [
                    'pais' => $loja->pais ? $loja->pais->name : 'Sem país',
                    'value' => $loja->id,
                    'label' => $loja->lojasIdiomas->isNotEmpty() ? $loja->lojasIdiomas[0]->cidade . ' - ' . $loja->lojasIdiomas[0]->estado : null,
                ];
            })
            ->groupBy('pais')
            ->map(function ($lojas, $pais) {
                return [
                    'label' => $pais,
                    'options' => $lojas->values(),
                ];
            })
            ->values()
            ->prepend([
                'label' => '',
                'options' => [
                    ['value' => null, 'label' => 'Nenhuma'],
                ],
            ]);

        return Inertia::render('Manager/Lojas/Projetos/adicionar', [
            'lojas' => $lojas
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostStoreProjectRequest $request) {
        if($request->ajax()){
            $idioma = inertia()->getShared('idioma');
            
            $projeto_loja = new ProjetoLoja;
            $projeto_loja_idioma = new ProjetoLojaIdioma;

            $slugBase = Str::slug($request['nome']);
            $slug = $slugBase;

            $count = 1;

            while (ProjetoLoja::where('slug', $slug)->exists()) {
                $slug = $slugBase . '-' . $count;
                $count++;
            }
            
            $projeto_loja->slug = $slug;
            $projeto_loja->loja_id = $request->loja_id ?? null;

            $projeto_loja->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            $projeto_loja->banner = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_banner')->extension());
            
            if ($request->file('vid') && $request->file('vid')->getError() == 0) {
                $projeto_loja->video = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('vid')->extension());
            }

            $response = $projeto_loja->save();

            $projeto_loja_idioma->nome = $request->nome;
            $projeto_loja_idioma->chamada = $request->chamada;
            $projeto_loja_idioma->dados = $request->dados;
            $projeto_loja_idioma->descricao = $request->descricao;
            $projeto_loja_idioma->produtos = $request->produtos;
            $projeto_loja_idioma->creditos = $request->creditos;
            $projeto_loja_idioma->conteudo = $request->conteudo;
            $projeto_loja_idioma->titulo_pagina = $request->titulo_pagina;
            $projeto_loja_idioma->descricao_pagina = $request->descricao_pagina;
            $projeto_loja_idioma->projeto_loja_id = $projeto_loja->id;
            $projeto_loja_idioma->idioma_id = $idioma->id;

            $response = $projeto_loja_idioma->save();

            if ($response) {
                $image = $request->file('img')->move(public_path('content/stores/projects/thumbs/'), $showroom->imagem);
                $image = $request->file('img_banner')->move(public_path('content/stores/projects/banner/'), $showroom->banner);
                
                if ($request->file('vid') && $request->file('vid')->getError() == 0) {
                    $video = $request->file('vid')->move(public_path('content/stores/projects/video/'), $showroom->video);
                }

                return to_route('Manager.Lojas.Projetos.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
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
            return Inertia::location(route('Manager.Lojas.Projetos.index'));
        }
        
        $idiomas = Idioma::query()
            ->orderBy('padrao', 'DESC')
            ->orderBy('id', 'DESC')
            ->get();

        $idioma = request('lang');

        $projeto = ProjetoLoja::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'projetosLojasIdiomas' => function ($q) use ($idioma) {
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

        if(!$projeto) {
            return Inertia::location(route('Manager.Lojas.Projetos.index'));
        }

        $idioma = inertia()->getShared('idioma');

        $projetoData = [
            'id' => $projeto->id,
            'loja_id' => $projeto->loja_id,
            'imagem' => rafator('content/stores/projects/thumbs/' . $projeto->imagem),
            'banner' => rafator('content/stores/projects/banner/' . $projeto->banner),
            'nome' => count($projeto->projetosLojasIdiomas) ? $projeto->projetosLojasIdiomas[0]->nome : null,
            'chamada' => count($projeto->projetosLojasIdiomas) ? $projeto->projetosLojasIdiomas[0]->chamada : null,
            'dados' => count($projeto->projetosLojasIdiomas) ? $projeto->projetosLojasIdiomas[0]->dados : null,
            'descricao' => count($projeto->projetosLojasIdiomas) ? $projeto->projetosLojasIdiomas[0]->descricao : null,
            'produtos' => count($projeto->projetosLojasIdiomas) ? $projeto->projetosLojasIdiomas[0]->produtos : null,
            'creditos' => count($projeto->projetosLojasIdiomas) ? $projeto->projetosLojasIdiomas[0]->creditos : null,
            'conteudo' => count($projeto->projetosLojasIdiomas) ? $projeto->projetosLojasIdiomas[0]->conteudo : null,
            'titulo_pagina' => count($projeto->projetosLojasIdiomas) ? $projeto->projetosLojasIdiomas[0]->titulo_pagina : null,
            'descricao_pagina' => count($projeto->projetosLojasIdiomas) ? $projeto->projetosLojasIdiomas[0]->descricao_pagina : null,
        ];
        
        $lojas = Loja::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'pais',
                'lojasIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function ($loja) {
                return [
                    'pais' => $loja->pais ? $loja->pais->name : 'Sem país',
                    'value' => $loja->id,
                    'label' => $loja->lojasIdiomas->isNotEmpty() ? $loja->lojasIdiomas[0]->cidade . ' - ' . $loja->lojasIdiomas[0]->estado : null,
                ];
            })
            ->groupBy('pais')
            ->map(function ($lojas, $pais) {
                return [
                    'label' => $pais,
                    'options' => $lojas->values(),
                ];
            })
            ->values()
            ->prepend([
                'label' => '',
                'options' => [
                    ['value' => null, 'label' => 'Nenhuma'],
                ],
            ]);

        return Inertia::render('Manager/Lojas/Projetos/editar', [
            'idiomas' => $idiomas,
            'idioma' => $idioma,
            'projeto' => $projetoData,
            'lojas' => $lojas
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizar(PostStoreProjectRequest $request, $id) {
        if($request->ajax()){
            $projeto_loja = ProjetoLoja::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $projeto_loja_idioma = ProjetoLojaIdioma::query()
                ->where([
                    'excluido' => null,
                    'projeto_loja_id' => $projeto_loja->id
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

            if (!$projeto_loja) {
                return to_route('Manager.Lojas.Projetos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($projeto_loja, 'projetosLojasIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Lojas.Projetos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Lojas.Projetos.index'));
            }

            if (!$projeto_loja_idioma) {
                $projeto_loja_idioma = new ProjetoLojaIdioma;

                $projeto_loja_idioma->projeto_loja_id = $projeto_loja->id;
                $projeto_loja_idioma->idioma_id = $idioma;
            } else {
                $copier = new DeepCopy();
                $projeto_lojaOriginal = $copier->copy($projeto_loja);
            }

            $slug = $projeto_loja->slug;

            if (!$request->query('lang')) {
                if ($request['nome'] !== $projeto_loja_idioma->nome) {
                    $slugBase = Str::slug($request['nome']);
                    $slug = $slugBase;
                    $count = 1;

                    while (ProjetoLoja::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                        $slug = $slugBase . '-' . $count;
                        $count++;
                    }
                }
            }

            $projeto_loja->slug = $slug;
            $projeto_loja->loja_id = $request->loja_id ?? null;

            if ($request->file('img') && $request->file('img')->getError() == 0) {
                $projeto_loja->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            }

            if ($request->file('img_banner') && $request->file('img_banner')->getError() == 0) {
                $projeto_loja->banner = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_banner')->extension());
            }

            if ($request->file('vid') && $request->file('vid')->getError() == 0) {
                $projeto_loja->video = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('vid')->extension());
            }

            $projeto_loja_idioma->nome = $request->nome;
            $projeto_loja_idioma->chamada = $request->chamada;
            $projeto_loja_idioma->dados = $request->dados;
            $projeto_loja_idioma->descricao = $request->descricao;
            $projeto_loja_idioma->produtos = $request->produtos;
            $projeto_loja_idioma->creditos = $request->creditos;
            $projeto_loja_idioma->conteudo = $request->conteudo;
            $projeto_loja_idioma->titulo_pagina = $request->titulo_pagina;
            $projeto_loja_idioma->descricao_pagina = $request->descricao_pagina;

            $response = $projeto_loja->save();
            $response = $projeto_loja_idioma->save();

            if ($response) {
                if ($request->file('img') && $request->file('img')->getError() == 0) {
                    if ($projeto_loja->imagem && isset($projeto_lojaOriginal) && File::exists('content/stores/projects/thumbs/' . $projeto_lojaOriginal->imagem)) {
                        File::delete('content/stores/projects/thumbs/' . $projeto_lojaOriginal->imagem);
                    }
                    
                    $image = $request->file('img')->move(public_path('content/stores/projects/thumbs/'), $projeto_loja->imagem);
                }
                
                if ($request->file('img_banner') && $request->file('img_banner')->getError() == 0) {
                    if ($projeto_loja->banner && isset($projeto_lojaOriginal) && File::exists('content/stores/projects/banner/' . $projeto_lojaOriginal->banner)) {
                        File::delete('content/stores/projects/banner/' . $projeto_lojaOriginal->banner);
                    }
                    
                    $image = $request->file('img_banner')->move(public_path('content/stores/projects/banner/'), $projeto_loja->banner);
                }

                if ($request->file('vid') && $request->file('vid')->getError() == 0) {
                    if ($projeto_loja->video && isset($projeto_lojaOriginal) && File::exists('content/stores/projects/video/' . $projeto_lojaOriginal->video)) {
                        File::delete('content/stores/projects/video/' . $projeto_lojaOriginal->video);
                    }
                    
                    $image = $request->file('vid')->move(public_path('content/stores/projects/video/'), $projeto_loja->video);
                }

                return to_route('Manager.Lojas.Projetos.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }
        }

        return to_route('Manager.Lojas.Projetos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
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

            $exclusao = ProjetoLoja::query()
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

            $response = ProjetoLoja::query()
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
                    $registro = ProjetoLoja::query()
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
    
    /**
     * Download the file of the specified resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function baixarVideo($id) {
        if (!$id) {
            return redirect()->route('Manager.Lojas.Produtos.index');
        }

        $projeto = ProjetoLoja::query()
            ->where([
                'id' => $id,
                'excluido' => NULL,
            ])
            ->first();

        if (!$projeto) {
            return redirect()->route('Manager.Lojas.Produtos.index');
        }

        $caminho = public_path('content/stores/projects/video/' . $projeto->video);

        $extensao = pathinfo($caminho)['extension'];

        if (!File::exists($caminho)) {
            return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Não foi possível encontrar o arquivo!']);
        }

        return response()->download($caminho, $projeto->slug . '.' . $extensao);
    }
};