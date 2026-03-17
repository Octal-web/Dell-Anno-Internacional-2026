<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use App\Models\Showroom;
use App\Models\ShowroomIdioma;
use App\Models\Loja;
use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostShowroomRequest;

use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

class ShowroomsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $showrooms = Showroom::query()
            ->where([
                'excluido' => NULL
            ])
            ->with([
                'showroomsIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($showroom) {
                return [
                    'id' => $showroom->id,
                    'visivel' => $showroom->visivel,
                    'imagem' => rafator('content/showrooms/thumbs/' . $showroom->imagem),
                    'nome' => $showroom->showroomsIdiomas->isNotEmpty() ? $showroom->showroomsIdiomas[0]->nome : null,
                ];
            });

        return Inertia::render('Manager/Showrooms/index', [
            'showrooms' => $showrooms
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

        return Inertia::render('Manager/Showrooms/adicionar', [
            'lojas' => $lojas
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostShowroomRequest $request) {
        if($request->ajax()){
            $idioma = inertia()->getShared('idioma');
            
            $showroom = new Showroom;
            $showroom_idioma = new ShowroomIdioma;

            $slugBase = Str::slug($request['nome']);
            $slug = $slugBase;

            $count = 1;

            while (Showroom::where('slug', $slug)->exists()) {
                $slug = $slugBase . '-' . $count;
                $count++;
            }
            
            $showroom->slug = $slug;
            $showroom->loja_id = $request->loja_id ?? null;
            
            $showroom->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            $showroom->banner = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_banner')->extension());

            $response = $showroom->save();

            $showroom_idioma->nome = $request->nome;
            $showroom_idioma->chamada = $request->chamada;
            $showroom_idioma->texto_chamada = $request->texto_chamada;
            $showroom_idioma->titulo_pagina = $request->titulo_pagina;
            $showroom_idioma->descricao_pagina = $request->descricao_pagina;

            $showroom_idioma->showroom_id = $showroom->id;
            $showroom_idioma->idioma_id = $idioma->id;

            $response = $showroom_idioma->save();

            if ($response) {
                $image = $request->file('img')->move(public_path('content/showrooms/thumbs/'), $showroom->imagem);
                $image = $request->file('img_banner')->move(public_path('content/showrooms/banner/'), $showroom->banner);

                return to_route('Manager.Showrooms.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
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
            return Inertia::location(route('Manager.Showrooms.index'));
        }
        
        $idiomas = Idioma::query()
            ->orderBy('padrao', 'DESC')
            ->orderBy('id', 'DESC')
            ->get();

        $idioma = request('lang');

        $showroom = Showroom::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'showroomsIdiomas' => function ($q) use ($idioma) {
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

        if(!$showroom) {
            return Inertia::location(route('Manager.Showrooms.index'));
        }

        $idioma = inertia()->getShared('idioma');

        $showroomData = [
            'id' => $showroom->id,
            'loja_id' => $showroom->loja_id,
            'imagem' => rafator('content/showrooms/thumbs/' . $showroom->imagem),
            'banner' => rafator('content/showrooms/banner/' . $showroom->banner),
            'nome' => count($showroom->showroomsIdiomas) ? $showroom->showroomsIdiomas[0]->nome : null,
            'chamada' => count($showroom->showroomsIdiomas) ? $showroom->showroomsIdiomas[0]->chamada : null,
            'texto_chamada' => count($showroom->showroomsIdiomas) ? $showroom->showroomsIdiomas[0]->texto_chamada : null,
            'titulo_pagina' => count($showroom->showroomsIdiomas) ? $showroom->showroomsIdiomas[0]->titulo_pagina : null,
            'descricao_pagina' => count($showroom->showroomsIdiomas) ? $showroom->showroomsIdiomas[0]->descricao_pagina : null,
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

        return Inertia::render('Manager/Showrooms/editar', [
            'idiomas' => $idiomas,
            'idioma' => $idioma,
            'showroom' => $showroomData,
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
    public function atualizar(PostShowroomRequest $request, $id) {
        if($request->ajax()){
            $showroom = Showroom::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $showroom_idioma = ShowroomIdioma::query()
                ->where([
                    'excluido' => null,
                    'showroom_id' => $showroom->id
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

            if (!$showroom) {
                return to_route('Manager.Showrooms.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($showroom, 'showroomsIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Showrooms.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Showrooms.index'));
            }

            if (!$showroom_idioma) {
                $showroom_idioma = new ShowroomIdioma;

                $showroom_idioma->showroom_id = $showroom->id;
                $showroom_idioma->idioma_id = $idioma;
            } else {
                $copier = new DeepCopy();
                $showroomOriginal = $copier->copy($showroom);
            }

            $slug = $showroom->slug;

            if (!$request->query('lang')) {
                if ($request['nome'] !== $showroom_idioma->nome) {
                    $slugBase = Str::slug($request['nome']);
                    $slug = $slugBase;
                    $count = 1;

                    while (Showroom::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                        $slug = $slugBase . '-' . $count;
                        $count++;
                    }
                }
            }

            $showroom->slug = $slug;
            $showroom->loja_id = $request->loja_id ?? null;

            if ($request->file('img') && $request->file('img')->getError() == 0) {
                $showroom->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            }

            if ($request->file('img_banner') && $request->file('img_banner')->getError() == 0) {
                $showroom->banner = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_banner')->extension());
            }

            $showroom_idioma->nome = $request->nome;
            $showroom_idioma->chamada = $request->chamada;
            $showroom_idioma->texto_chamada = $request->texto_chamada;
            $showroom_idioma->titulo_pagina = $request->titulo_pagina;
            $showroom_idioma->descricao_pagina = $request->descricao_pagina;

            $response = $showroom->save();
            $response = $showroom_idioma->save();

            if ($response) {
                if ($request->file('img') && $request->file('img')->getError() == 0) {
                    if ($showroom->imagem && isset($showroomOriginal) && File::exists('content/showrooms/thumbs/' . $showroomOriginal->imagem)) {
                        File::delete('content/showrooms/thumbs/' . $showroomOriginal->imagem);
                    }
                    
                    $image = $request->file('img')->move(public_path('content/showrooms/thumbs/'), $showroom->imagem);
                }
                
                if ($request->file('img_banner') && $request->file('img_banner')->getError() == 0) {
                    if ($showroom->banner && isset($showroomOriginal) && File::exists('content/showrooms/banner/' . $showroomOriginal->banner)) {
                        File::delete('content/showrooms/banner/' . $showroomOriginal->banner);
                    }
                    
                    $image = $request->file('img_banner')->move(public_path('content/showrooms/banner/'), $showroom->banner);
                }

                return to_route('Manager.Showrooms.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }
        }

        return to_route('Manager.Showrooms.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
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

            $exclusao = Showroom::query()
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

            $response = Showroom::query()
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
                    $registro = Showroom::query()
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