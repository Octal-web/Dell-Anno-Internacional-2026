<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use App\Models\Loja;
use App\Models\LojaIdioma;
use App\Models\Idioma;
use App\Models\Cidade;
use App\Models\Estado;
use App\Models\Pais;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostStoreRequest;

use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

class LojasController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $lojas = Loja::query()
            ->where([
                'excluido' => NULL
            ])
            ->with([
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
            ->map(function($loja) {
                return [
                    'id' => $loja->id,
                    'visivel' => $loja->visivel,
                    'imagem' => rafator('content/stores/s/' . $loja->imagem),
                    'nome' => ($loja->lojasIdiomas->isNotEmpty() ? $loja->lojasIdiomas[0]->cidade : null) . ($loja->lojasIdiomas->isNotEmpty() ?  ' - ' . $loja->lojasIdiomas[0]->estado : null),
                ];
            });

        return Inertia::render('Manager/Lojas/index', [
            'lojas' => $lojas
        ]);
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function adicionar() {
        $idiomas = Idioma::query()
            ->orderBy('padrao', 'DESC')
            ->orderBy('id', 'DESC')
            ->get();

        $idioma = request('lang');

        $estados = Estado::select('id', 'nome')->get()->map(function ($estado) {
            return [
                'value' => $estado->id,
                'label' => $estado->nome,
            ];
        });

        $paises = Pais::select('id', 'name')->get()->map(function($pais) {
            return [
                'value' => $pais->id,
                'label' => $pais->name
            ];
        });

        return Inertia::render('Manager/Lojas/adicionar', [
            'estados' => $estados,
            'paises' => $paises
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostStoreRequest $request) {
        if($request->ajax()){
            $idioma = inertia()->getShared('idioma');
            
            $loja = new Loja;
            $loja_idioma = new LojaIdioma;

            $slugBase = Str::slug($request['cidade']);
            $slug = $slugBase;

            $count = 1;

            while (Loja::where('slug', $slug)->exists()) {
                $slug = $slugBase . '-' . $count;
                $count++;
            }
            
            $loja->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());

            if ($request->file('img_logo') && $request->file('img_logo')->getError() == 0) {
                $loja->logo = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_logo')->extension());
            }

            if ($request->file('img_showroom') && $request->file('img_showroom')->getError() == 0) {
                $loja->imagem_showroom = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_showroom')->extension());
            }

            $loja->link_lp = $request->link_lp ?? null;
            $loja->link_showroom = $request->link_showroom ?? null;
            $loja->pais_id = $request->pais_id;

            $response = $loja->save();

            $loja_idioma->cidade = $request->cidade;
            $loja_idioma->estado = $request->estado ?? null;
            $loja_idioma->endereco = $request->endereco;
            $loja_idioma->contato = $request->contato;
            $loja_idioma->horario_atendimento = $request->horario_atendimento;
            $loja_idioma->chamada = $request->chamada ?? null;
            $loja_idioma->titulo_pagina = $request->titulo_pagina;
            $loja_idioma->descricao_pagina = $request->descricao_pagina;

            $loja_idioma->loja_id = $loja->id;
            $loja_idioma->idioma_id = $idioma->id;

            $response = $loja_idioma->save();

            if ($response) {
                $image = $request->file('img')->move(public_path('content/stores/b/'), $loja->imagem);
                $image = $request->file('img_alt')->move(public_path('content/stores/s/'), $loja->imagem);
                
                if ($request->file('img_logo') && $request->file('img_logo')->getError() == 0) {
                    $image = $request->file('img_logo')->move(public_path('content/stores/logo/'), $loja->logo);
                }

                if ($request->file('img_showroom') && $request->file('img_showroom')->getError() == 0) {
                    $image = $request->file('img_showroom')->move(public_path('content/stores/showroom/'), $loja->imagem_showroom);
                }

                return to_route('Manager.Lojas.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
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
            return Inertia::location(route('Manager.Lojas.index'));
        }
        
        $idiomas = Idioma::query()
            ->orderBy('padrao', 'DESC')
            ->orderBy('id', 'DESC')
            ->get();

        $idioma = request('lang');

        $loja = Loja::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'lojasIdiomas' => function ($q) use ($idioma) {
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

        if(!$loja) {
            return Inertia::location(route('Manager.Lojas.index'));
        }

        $idioma = inertia()->getShared('idioma');

        $loja = [
            'id' => $loja->id,
            'link_lp' => $loja->link_lp ?? null,
            'link_showroom' => $loja->link_showroom ?? null,
            'pais_id' => $loja->pais_id,
            'imagem' => asset('content/stores/s/' . $loja->imagem),
            'logo' => $loja->logo ? asset('content/stores/logo/' . $loja->logo) : null,
            'imagem_showroom' => $loja->imagem_showroom ? asset('content/stores/showroom/' . $loja->imagem_showroom) : null,
            'cidade' => count($loja->lojasIdiomas) ? $loja->lojasIdiomas[0]->cidade : null,
            'estado' => count($loja->lojasIdiomas) ? $loja->lojasIdiomas[0]->estado : null,
            'endereco' => count($loja->lojasIdiomas) ? $loja->lojasIdiomas[0]->endereco : null,
            'contato' => count($loja->lojasIdiomas) ? $loja->lojasIdiomas[0]->contato : null,
            'horario_atendimento' => count($loja->lojasIdiomas) ? $loja->lojasIdiomas[0]->horario_atendimento : null,
            'chamada' => count($loja->lojasIdiomas) ? $loja->lojasIdiomas[0]->chamada : null,
            'titulo_pagina' => count($loja->lojasIdiomas) ? $loja->lojasIdiomas[0]->titulo_pagina : null,
            'descricao_pagina' => count($loja->lojasIdiomas) ? $loja->lojasIdiomas[0]->descricao_pagina : null,
            'estados' => $loja->estados->pluck('id'),
            'cidades' => $loja->cidades->pluck('id'),
            'emails_lojas' => $loja->emails->pluck('email')
        ];

        $selectCidades = Cidade::whereIn('id', $loja['cidades'])
            ->orderBy('nome')
            ->get()
            ->map(fn($cidade) => [
                'value' => $cidade->id,
                'label' => $cidade->nome . ' - ' . $cidade->estado->codigo,
            ]);

        $estados = Estado::select('id', 'nome')->get()->map(function ($estado) {
            return [
                'value' => $estado->id,
                'label' => $estado->nome,
            ];
        });

        $paises = Pais::select('id', 'name')->get()->map(function($pais) {
            return [
                'value' => $pais->id,
                'label' => $pais->name
            ];
        });

        return Inertia::render('Manager/Lojas/editar', [
            'idiomas' => $idiomas,
            'idioma' => $idioma,
            'loja' => $loja,
            'selectCidades' => $selectCidades,
            'estados' => $estados,
            'paises' => $paises
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizar(PostStoreRequest $request, $id) {
        if($request->ajax()){
            $loja = Loja::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $loja_idioma = LojaIdioma::query()
                ->where([
                    'excluido' => null,
                    'loja_id' => $loja->id
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

            if (!$loja) {
                return to_route('Manager.Lojas.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($loja, 'lojasIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Lojas.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Lojas.index'));
            }

            if (!$loja_idioma) {
                $loja_idioma = new LojaIdioma;

                $loja_idioma->loja_id = $loja->id;
                $loja_idioma->idioma_id = $idioma;
            } else {
                $copier = new DeepCopy();
                $lojaOriginal = $copier->copy($loja);
            }

            $slug = $loja->slug;

            if (!$request->query('lang')) {
                if ($request['cidade'] !== $loja->cidade) {
                    $slugBase = Str::slug($request['cidade']);
                    $slug = $slugBase;
                    $count = 1;

                    while (Loja::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                        $slug = $slugBase . '-' . $count;
                        $count++;
                    }
                }
            }

            $loja->slug = $slug;

            if ($request->file('img') && $request->file('img')->getError() == 0) {
                $loja->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            }
            
            if ($request->file('img_logo') && $request->file('img_logo')->getError() == 0) {
                $loja->logo = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_logo')->extension());
            }

            if ($request->file('img_showroom') && $request->file('img_showroom')->getError() == 0) {
                $loja->imagem_showroom = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_showroom')->extension());
            }
            
            $loja->link_lp = $request->link_lp ?? null;
            $loja->link_showroom = $request->link_showroom ?? null;
            $loja->pais_id = $request->pais_id;
            
            $loja_idioma->cidade = $request->cidade;
            $loja_idioma->estado = $request->estado ?? null;
            $loja_idioma->endereco = $request->endereco;
            $loja_idioma->contato = $request->contato;
            $loja_idioma->horario_atendimento = $request->horario_atendimento;
            $loja_idioma->chamada = $request->chamada ?? null;
            $loja_idioma->titulo_pagina = $request->titulo_pagina;
            $loja_idioma->descricao_pagina = $request->descricao_pagina;

            $response = $loja->save();
            $response = $loja_idioma->save();

            if ($response) {
                if ($request->file('img') && $request->file('img')->getError() == 0) {
                    if ($loja->imagem && isset($lojaOriginal) && File::exists('content/stores/b/' . $lojaOriginal->imagem)) {
                        File::delete('content/stores/b/' . $lojaOriginal->imagem);
                    }

                    if ($loja->imagem && isset($lojaOriginal) && File::exists('content/stores/s/' . $lojaOriginal->imagem)) {
                        File::delete('content/stores/s/' . $lojaOriginal->imagem);
                    }

                    $image = $request->file('img')->move(public_path('content/stores/b/'), $loja->imagem);
                    $image = $request->file('img_alt')->move(public_path('content/stores/s/'), $loja->imagem);
                }

                if ($request->file('img_logo') && $request->file('img_logo')->getError() == 0) {
                    if ($loja->logo && isset($lojaOriginal) && File::exists('content/stores/logo/' . $lojaOriginal->logo)) {
                        File::delete('content/stores/logo/' . $lojaOriginal->logo);
                    }
                    
                    $image = $request->file('img_logo')->move(public_path('content/stores/logo/'), $loja->logo);
                }

                if ($request->file('img_showroom') && $request->file('img_showroom')->getError() == 0) {
                    if ($loja->showroom && isset($lojaOriginal) && File::exists('content/stores/showroom/' . $lojaOriginal->showroom)) {
                        File::delete('content/stores/showroom/' . $lojaOriginal->showroom);
                    }
                    
                    $image = $request->file('img_showroom')->move(public_path('content/stores/showroom/'), $loja->showroom);
                }

                return to_route('Manager.Lojas.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }
        }

        return to_route('Manager.Lojas.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
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

            $exclusao = Loja::query()
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

            $response = Loja::query()
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
                    $registro = Loja::query()
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