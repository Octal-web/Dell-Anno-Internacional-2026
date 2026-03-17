<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Produto;
use App\Models\Ambiente;
use App\Models\AmbienteIdioma;
use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostProductEnvironmentRequest;

use Carbon\Carbon;
use Illuminate\Support\Facades\Response;


class AmbientesProdutosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id) {
        if (!$id) {
            return Inertia::location(route('Manager.Produtos.index'));
        }
        
        $idioma = inertia()->getShared('idioma');

        $produto = Produto::query()
            ->where([
                'excluido' => NULL,
                'id' => $id
            ])
            ->with([
                'produtosIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                },
                'ambientes' => function ($q)  {
                    $q->where([
                        'excluido' => null
                    ])
                    ->orderBy('ordem', 'ASC')
                    ->orderBy('id', 'DESC')
                    ->with([
                        'ambientesIdiomas' => function ($query) {
                            $query->whereHas('idiomas', function ($secr) {
                                $secr->Where('padrao', true);
                            })
                            ->orderBy('idioma_id', 'DESC');
                        },
                        'projetos' => function ($query) {
                            $query->where([
                                'excluido' => null
                            ])
                            ->orderBy('ordem', 'ASC')
                            ->orderBy('id', 'DESC')
                            ->with([
                                'projetosIdiomas' => function ($r) {
                                    $r->whereHas('idiomas', function ($i) {
                                        $i->where('padrao', true);
                                    })
                                    ->orderBy('idioma_id', 'DESC');
                                },
                            ]);
                        },
                    ]);
                },
            ])
            ->first();

        if(!$produto) {
            return Inertia::location(route('Manager.Produtos.index'));
        }

        $produtoData = [
            'id' => $produto->id,
            'nome' => count($produto->produtosIdiomas) ? $produto->produtosIdiomas[0]->nome : null,
            'ambientes' => $produto->ambientes->map(function ($ambiente) {
                return [
                    'id' => $ambiente->id,
                    'visivel' => $ambiente->visivel ? true : false,
                    'nome' => count($ambiente->ambientesIdiomas) ? $ambiente->ambientesIdiomas[0]->nome : null,
                ];
            })->values()->all(),
        ];

        $produtoData['projetos'] = $produto->ambientes->flatMap(function ($ambiente) {
            $nomeAmbiente = count($ambiente->ambientesIdiomas)
                ? $ambiente->ambientesIdiomas[0]->nome
                : null;

            return $ambiente->projetos->values()->map(function ($projeto, $index) use ($nomeAmbiente) {
                return [
                    'id' => $projeto->id,
                    'visivel' => (bool) $projeto->visivel,
                    'imagem' => rafator('content/projects/thumbs/' . $projeto->imagem),
                    'nome' => "{$nomeAmbiente} " . ($index + 1),
                ];
            });
        })->values()->all();

        return Inertia::render('Manager/Produtos/Ambientes/index', [
            'produto' => $produtoData,
        ]);
    }

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

        return Inertia::render('Manager/Produtos/Ambientes/adicionar', [
            'id' => $id
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostProductEnvironmentRequest $request, $id) {
        if (!$id) {
            return Inertia::location(route('Manager.Produtos.index'));
        }
        
        if($request->ajax()){
            $idioma = inertia()->getShared('idioma');
            
            $ambiente = new Ambiente;
            $ambiente_idioma = new AmbienteIdioma;

            $ambiente->produto_id = $id;

            $response = $ambiente->save();

            $ambiente_idioma->nome = $request->nome;
            $ambiente_idioma->descricao_curta = $request->descricao_curta;
            $ambiente_idioma->descricao = $request->descricao;

            $ambiente_idioma->ambiente_id = $ambiente->id;
            $ambiente_idioma->idioma_id = $idioma->id;

            $response = $ambiente_idioma->save();

            if ($response) {
                return to_route('Manager.Produtos.Ambientes.index', ['id' => $id])->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
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

        $ambiente = Ambiente::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'ambientesIdiomas' => function ($q) use ($idioma) {
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
                },
            ])
            ->first();

        if(!$ambiente) {
            return Inertia::location(route('Manager.Produtos.index'));
        }

        $idioma = inertia()->getShared('idioma');

        $ambiente = [
            'id' => $ambiente->id,
            'produto_id' => $ambiente->produto_id,
            'nome' => count($ambiente->ambientesIdiomas) ? $ambiente->ambientesIdiomas[0]->nome : null,
            'descricao_curta' => count($ambiente->ambientesIdiomas) ? $ambiente->ambientesIdiomas[0]->descricao_curta : null,
            'descricao' => count($ambiente->ambientesIdiomas) ? $ambiente->ambientesIdiomas[0]->descricao : null,
        ];

        return Inertia::render('Manager/Produtos/Ambientes/editar', [
            'idiomas' => $idiomas,
            'idioma' => $idioma,
            'ambiente' => $ambiente,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizar(PostProductEnvironmentRequest $request, $id) {
        if($request->ajax()){
            $ambiente = Ambiente::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $ambiente_idioma = AmbienteIdioma::query()
                ->where([
                    'excluido' => null,
                    'ambiente_id' => $ambiente->id
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

            if (!$ambiente) {
                return to_route('Manager.Produtos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($ambiente, 'imagensIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Produtos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Produtos.index'));
            }

            if (!$ambiente_idioma) {
                $ambiente_idioma = new AmbienteIdioma;

                $ambiente_idioma->ambiente_id = $ambiente->id;
                $ambiente_idioma->idioma_id = $idioma;
            }

            $ambiente_idioma->nome = $request->nome;
            $ambiente_idioma->descricao_curta = $request->descricao_curta;
            $ambiente_idioma->descricao = $request->descricao;

            $response = $ambiente->save();
            $response = $ambiente_idioma->save();

            if ($response) {
                return to_route('Manager.Produtos.Ambientes.index', ['id' => $ambiente->produto_id])->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
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

            $exclusao = Ambiente::query()
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

            $response = Ambiente::query()
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
                    $registro = Ambiente::query()
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
}