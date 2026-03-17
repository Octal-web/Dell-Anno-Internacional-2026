<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use App\Models\Projeto;
use App\Models\ProjetoIdioma;
use App\Models\Ambiente;
use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostProjectRequest;

use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

class ProjetosProdutosController extends Controller
{
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function adicionar($id) {
        if (!$id) {
            return Inertia::location(route('Manager.Produtos.index'));
        }
        
        $idiomas = Idioma::query()
            ->orderBy('padrao', 'DESC')
            ->orderBy('id', 'DESC')
            ->get();

        $idioma = request('lang');

        $ambientes = Ambiente::query()
            ->where([
                'excluido' => null,
                'visivel' => true
            ])
            ->with([
                'produto' => function ($q) use ($idioma) {
                    $q->where([
                        'excluido' => null,
                        'visivel' => true
                    ])
                    ->with([
                        'produtosIdiomas' => function ($qi) use ($idioma) {
                            $qi->whereHas('idiomas', function ($ri) use ($idioma) {
                                $ri->where('codigo', $idioma)
                                   ->orWhere('padrao', true);
                            })
                            ->orderBy('idioma_id', 'DESC');
                        }
                    ]);
                },
                'ambientesIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                },
            ])
            ->get()
            ->groupBy(function($ambiente) {
                return $ambiente->produto ? $ambiente->produto->produtosIdiomas[0]?->nome : 'Sem produto';
            })
            ->map(function($ambientesPorProduto, $produtoNome) {
                return [
                    'label' => $produtoNome,
                    'options' => $ambientesPorProduto->map(function($ambiente) {
                        return [
                            'value' => $ambiente->id,
                            'label' => $ambiente->ambientesIdiomas->isNotEmpty()
                                ? $ambiente->ambientesIdiomas[0]->nome
                                : null,
                        ];
                    })->values(),
                ];
            })
            ->values();

        return Inertia::render('Manager/Produtos/Projetos/adicionar', [
            'id' => $id,
            'ambientes' => $ambientes
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostProjectRequest $request) {
        if($request->ajax()){
            $idioma = inertia()->getShared('idioma');

            $ambiente = Ambiente::with('ambientesIdiomas')
                ->where([
                    'excluido' => null,
                    'id' => $request->ambiente_id
                ])
                ->with('ambientesIdiomas', function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                })
                ->first();

            if (!$ambiente || !$ambiente->ambientesIdiomas->count()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ambiente inválido ou sem tradução disponível.'
                ], 422);
            }
            
            $projeto = new Projeto;
            $projeto_idioma = new ProjetoIdioma;

            $slugBase = Str::slug($ambiente->ambientesIdiomas[0]->nome);

            $count = Projeto::where('ambiente_id', $ambiente->id)
                ->whereNull('excluido')
                ->count();

            $slug = "{$slugBase}-" . ($count + 1);

            $projeto->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            
            $projeto->slug = $slug;
            
            $projeto->ambiente_id = $request->ambiente_id;

            $response = $projeto->save();

            $projeto_idioma->detalhes = $request->detalhes;
            $projeto_idioma->conteudo = $request->conteudo;

            $projeto_idioma->projeto_id = $projeto->id;
            $projeto_idioma->idioma_id = $idioma->id;

            $response = $projeto_idioma->save();

            if ($response) {
                $image = $request->file('img')->move(public_path('content/projects/thumbs/'), $projeto->imagem);

                return to_route('Manager.Produtos.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
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

        $projeto = Projeto::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'projetosIdiomas' => function ($query) {
                    $query->whereHas('idiomas', function ($secr) {
                        $secr->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                },
            ])
            ->first();

        if(!$projeto) {
            return Inertia::location(route('Manager.Produtos.index'));
        }

        $idioma = inertia()->getShared('idioma');

        $projetoData = [
            'id' => $projeto->id,
            'imagem' => asset('content/projects/thumbs/' . $projeto->imagem),
            'ambiente_id' => $projeto->ambiente_id,
            'detalhes' => count($projeto->projetosIdiomas) ? $projeto->projetosIdiomas[0]->detalhes : null,
            'conteudo' => count($projeto->projetosIdiomas) ? $projeto->projetosIdiomas[0]->conteudo : null,
        ];
        
        $ambientes = Ambiente::query()
            ->where([
                'excluido' => null,
                'visivel' => true
            ])
            ->with([
                'produto' => function ($q) use ($idioma) {
                    $q->where([
                        'excluido' => null,
                        'visivel' => true
                    ])
                    ->with([
                        'produtosIdiomas' => function ($qi) use ($idioma) {
                            $qi->whereHas('idiomas', function ($ri) use ($idioma) {
                                $ri->where('codigo', $idioma)
                                   ->orWhere('padrao', true);
                            })
                            ->orderBy('idioma_id', 'DESC');
                        }
                    ]);
                },
                'ambientesIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                },
            ])
            ->get()
            ->groupBy(function($ambiente) {
                return $ambiente->produto ? $ambiente->produto->produtosIdiomas[0]?->nome : 'Sem produto';
            })
            ->map(function($ambientesPorProduto, $produtoNome) {
                return [
                    'label' => $produtoNome,
                    'options' => $ambientesPorProduto->map(function($ambiente) {
                        return [
                            'value' => $ambiente->id,
                            'label' => $ambiente->ambientesIdiomas->isNotEmpty()
                                ? $ambiente->ambientesIdiomas[0]->nome
                                : null,
                        ];
                    })->values(),
                ];
            })
            ->values();

        return Inertia::render('Manager/Produtos/Projetos/editar', [
            'idiomas' => $idiomas,
            'idioma' => $idioma,
            'projeto' => $projetoData,
            'ambientes' => $ambientes
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizar(PostProjectRequest $request, $id) {
        if($request->ajax()){
            $projeto = Projeto::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $projeto_idioma = ProjetoIdioma::query()
                ->where([
                    'excluido' => null,
                    'projeto_id' => $projeto->id
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

            if (!$projeto) {
                return to_route('Manager.Produtos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($projeto, 'projetoIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Produtos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Produtos.index'));
            }

            if (!$projeto_idioma) {
                $projeto_idioma = new ProjetoIdioma;

                $projeto_idioma->projeto_id = $projeto->id;
                $projeto_idioma->idioma_id = $idioma;
            } else {
                $copier = new DeepCopy();
                $projetoOriginal = $copier->copy($projeto);
            }

            if ($request->file('img') && $request->file('img')->getError() == 0) {
                $projeto->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            }

            $projeto->ambiente_id = $request->ambiente_id;
            $projeto_idioma->detalhes = $request->detalhes;
            $projeto_idioma->conteudo = $request->conteudo;

            $response = $projeto->save();
            $response = $projeto_idioma->save();

            if ($response) {
                if ($request->file('img') && $request->file('img')->getError() == 0) {
                    if ($projeto->imagem && isset($projetoOriginal) && File::exists('content/projects/thumbs/' . $projetoOriginal->imagem)) {
                        File::delete('content/projects/thumbs/' . $projetoOriginal->imagem);
                    }
                    
                    $image = $request->file('img')->move(public_path('content/projects/thumbs/'), $projeto->imagem);
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

            $exclusao = Projeto::query()
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

            $response = Projeto::query()
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
        if ($request->ajax()) {
            $erros = [];

            if ($request->odr && is_array($request->odr)) {

                // Contadores separados por ambiente
                $contadores = [];

                foreach ($request->odr as $key => $projetoId) {

                    $projeto = Projeto::query()
                        ->where([
                            'excluido' => null,
                            'id' => $projetoId
                        ])
                        ->with([
                            'ambiente' => function ($query) {
                                $query->where([
                                    'excluido' => null
                                ])
                                ->orderBy('ordem', 'ASC')
                                ->orderBy('id', 'DESC')
                                ->with([
                                    'ambientesIdiomas' => function ($r) {
                                        $r->whereHas('idiomas', function ($i) {
                                            $i->where('padrao', true);
                                        })
                                        ->orderBy('idioma_id', 'DESC');
                                    },
                                ]);
                            },
                        ])
                        ->first();

                    if (!$projeto || !$projeto->ambiente || !$projeto->ambiente->ambientesIdiomas->count()) {
                        $erros[] = $projetoId;
                        continue;
                    }

                    $nomeAmbiente = $projeto->ambiente->ambientesIdiomas[0]->nome;
                    $slugBase = Str::slug($nomeAmbiente);

                    if (!isset($contadores[$slugBase])) {
                        $contadores[$slugBase] = 1;
                    }

                    $slug = "{$slugBase}-{$contadores[$slugBase]}";

                    $contadores[$slugBase]++;

                    $atualizado = $projeto->update([
                        'ordem' => $key,
                        'slug'  => $slug,
                    ]);

                    if (!$atualizado) {
                        $erros[] = $projetoId;
                    }
                }
            }

            if (!count($erros)) {
                return redirect()->back()->with('message', [
                    'type' => 'success',
                    'msg'  => 'Registros reordenados com sucesso!'
                ]);
            } else {
                return redirect()->back()->with('message', [
                    'type' => 'error',
                    'msg'  => 'Alguns registros não foram reordenados, tente novamente mais tarde!'
                ]);
            }
        }

        return redirect()->back();
    }
};