<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use App\Models\Etapa;
use App\Models\EtapaIdioma;
use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostStepRequest;

use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

class EtapasController extends Controller
{
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

        return Inertia::render('Manager/Etapas/adicionar');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostStepRequest $request) {
        if($request->ajax()){
            $idioma = inertia()->getShared('idioma');
            
            $etapa = new Etapa;
            $etapa_idioma = new EtapaIdioma;

            $etapa->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());

            $response = $etapa->save();

            $etapa_idioma->titulo = $request->titulo;
            $etapa_idioma->descricao = $request->descricao;

            $etapa_idioma->etapa_id = $etapa->id;
            $etapa_idioma->idioma_id = $idioma->id;

            $response = $etapa_idioma->save();

            if ($response) {
                $image = $request->file('img')->move(public_path('content/steps/thumbs/'), $etapa->imagem);

                return to_route('Manager.Institucional.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
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
            return Inertia::location(route('Manager.Institucional.index'));
        }
        
        $idiomas = Idioma::query()
            ->orderBy('padrao', 'DESC')
            ->orderBy('id', 'DESC')
            ->get();

        $idioma = request('lang');

        $etapa = Etapa::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'etapasIdiomas' => function ($q) use ($idioma) {
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

        if(!$etapa) {
            return Inertia::location(route('Manager.Institucional.index'));
        }

        $idioma = inertia()->getShared('idioma');

        $etapa = [
            'id' => $etapa->id,
            'imagem' => asset('content/steps/thumbs/' . $etapa->imagem),
            'titulo' => count($etapa->etapasIdiomas) ? $etapa->etapasIdiomas[0]->titulo : null,
            'descricao' => count($etapa->etapasIdiomas) ? $etapa->etapasIdiomas[0]->descricao : null
        ];

        return Inertia::render('Manager/Etapas/editar', [
            'idiomas' => $idiomas,
            'idioma' => $idioma,
            'etapa' => $etapa
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizar(PostStepRequest $request, $id) {
        if($request->ajax()){
            $etapa = Etapa::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $etapa_idioma = EtapaIdioma::query()
                ->where([
                    'excluido' => null,
                    'etapa_id' => $etapa->id
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

            if (!$etapa) {
                return to_route('Manager.Institucional.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($etapa, 'etapasIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Institucional.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Institucional.index'));
            }

            if (!$etapa_idioma) {
                $etapa_idioma = new EtapaIdioma;

                $etapa_idioma->etapa_id = $etapa->id;
                $etapa_idioma->idioma_id = $idioma;
            } else {
                $copier = new DeepCopy();
                $etapaOriginal = $copier->copy($etapa);
            }

            if ($request->file('img') && $request->file('img')->getError() == 0) {
                $etapa->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            }
            
            $etapa_idioma->titulo = $request->titulo;
            $etapa_idioma->descricao = $request->descricao;

            $response = $etapa->save();
            $response = $etapa_idioma->save();

            if ($response) {
                if ($request->file('img') && $request->file('img')->getError() == 0) {
                    if ($etapa->imagem && isset($etapaOriginal) && File::exists('content/steps/thumbs/' . $etapaOriginal->imagem)) {
                        File::delete('content/steps/thumbs/' . $etapaOriginal->imagem);
                    }

                    $image = $request->file('img')->move(public_path('content/steps/thumbs/'), $etapa->imagem);
                }

                return to_route('Manager.Institucional.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }
        }

        return to_route('Manager.Institucional.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
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

            $exclusao = Etapa::query()
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

            $response = Etapa::query()
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
                    $registro = Etapa::query()
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