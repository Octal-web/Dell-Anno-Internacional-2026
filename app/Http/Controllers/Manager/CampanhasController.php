<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use App\Models\Campanha;
use App\Models\CampanhaIdioma;
use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostCampaignRequest;

use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

class CampanhasController extends Controller
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

        return Inertia::render('Manager/Campanhas/adicionar');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostCampaignRequest $request) {
        if($request->ajax()){
            $idioma = inertia()->getShared('idioma');
            
            $campanha = new Campanha;
            $campanha_idioma = new CampanhaIdioma;

            $campanha->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            
            // $campanha->ano = $request->ano;
            $campanha->link = $request->link;

            $response = $campanha->save();

            $campanha_idioma->titulo = $request->titulo;
            $campanha_idioma->descricao = $request->descricao;

            $campanha_idioma->campanha_id = $campanha->id;
            $campanha_idioma->idioma_id = $idioma->id;

            $response = $campanha_idioma->save();

            if ($response) {
                $image = $request->file('img')->move(public_path('content/campaigns/thumbs/'), $campanha->imagem);

                return to_route('Manager.Home.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
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
            return Inertia::location(route('Manager.Home.index'));
        }
        
        $idiomas = Idioma::query()
            ->orderBy('padrao', 'DESC')
            ->orderBy('id', 'DESC')
            ->get();

        $idioma = request('lang');

        $campanha = Campanha::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'campanhasIdiomas' => function ($q) use ($idioma) {
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

        if(!$campanha) {
            return Inertia::location(route('Manager.Home.index'));
        }

        $idioma = inertia()->getShared('idioma');

        $campanha = [
            'id' => $campanha->id,
            // 'ano' => $campanha->ano,
            'link' => $campanha->link,
            'imagem' => asset('content/campaigns/thumbs/' . $campanha->imagem),
            'titulo' => count($campanha->campanhasIdiomas) ? $campanha->campanhasIdiomas[0]->titulo : null,
            'descricao' => count($campanha->campanhasIdiomas) ? $campanha->campanhasIdiomas[0]->descricao : null
        ];

        return Inertia::render('Manager/Campanhas/editar', [
            'idiomas' => $idiomas,
            'idioma' => $idioma,
            'campanha' => $campanha
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizar(PostCampaignRequest $request, $id) {
        if($request->ajax()){
            $campanha = Campanha::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $campanha_idioma = CampanhaIdioma::query()
                ->where([
                    'excluido' => null,
                    'campanha_id' => $campanha->id
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

            if (!$campanha) {
                return to_route('Manager.Home.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($campanha, 'campanhasIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Home.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Home.index'));
            }

            if (!$campanha_idioma) {
                $campanha_idioma = new CampanhaIdioma;

                $campanha_idioma->campanha_id = $campanha->id;
                $campanha_idioma->idioma_id = $idioma;
            } else {
                $copier = new DeepCopy();
                $campanhaOriginal = $copier->copy($campanha);
            }

            // $campanha->ano = $request->ano;
            $campanha->link = $request->link;

            if ($request->file('img') && $request->file('img')->getError() == 0) {
                $campanha->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            }
            
            $campanha_idioma->titulo = $request->titulo;
            $campanha_idioma->descricao = $request->descricao;

            $response = $campanha->save();
            $response = $campanha_idioma->save();

            if ($response) {
                if ($request->file('img') && $request->file('img')->getError() == 0) {
                    if ($campanha->imagem && isset($campanhaOriginal) && File::exists('content/campaigns/thumbs/' . $campanhaOriginal->imagem)) {
                        File::delete('content/campaigns/thumbs/' . $campanhaOriginal->imagem);
                    }

                    $image = $request->file('img')->move(public_path('content/campaigns/thumbs/'), $campanha->imagem);
                }

                return to_route('Manager.Home.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }
        }

        return to_route('Manager.Home.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
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

            $exclusao = Campanha::query()
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

            $response = Campanha::query()
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
                    $registro = Campanha::query()
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