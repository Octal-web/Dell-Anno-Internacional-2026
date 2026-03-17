<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Conteudo;
use App\Models\Imagem;

use Illuminate\Http\Request;
use Inertia\Inertia;

use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

class ImagensController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function conteudo($id) {
        if (!$id) {
            return Inertia::location(route('Manager.Home.index'));
        }

        $conteudo = Conteudo::query()
            ->where([
                'excluido' => NULL,
                'id' => $id
            ])
            ->with([
                'imagens' => function ($q) {
                    $q->where([
                        'excluido' => NULL
                    ])
                    ->orderBy('ordem', 'ASC')
                    ->orderBy('id', 'DESC'); 
                }

            ])
            ->whereHas('parametro', function($q) {
                $q->where([
                    'galeria' => true,
                ]);
            })
            ->first();

        if(!$conteudo) {
            return Inertia::location(route('Manager.Home.index'));
        }

        $conteudoData = [
            'id' => $conteudo->id,
            'descricao' => $conteudo->parametro->descricao,
            'controladora' => $conteudo->controladora,
            'imagens' => $conteudo->imagens->map(function ($img) {
                return [
                    'id' => $img->id,
                    'visivel' => $img->visivel ? true : false,
                    'imagem' => asset('content/carousel/' . $img->imagem),
                ];
            })->values()->all(),
        ];

        return Inertia::render('Manager/Imagens/conteudo', [
            'conteudo' => $conteudoData,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(Request $request, $id) {
        if ($request->ajax()) {
            $conteudo = Conteudo::query()
                ->where([
                    'excluido' => NULL,
                    'id' => $id
                ])
                ->whereHas('parametro', function($q) {
                    $q->where(['galeria' => true]);
                })
                ->first();

            if (!$conteudo) {
                return Inertia::location(route('Manager.Home.index'));
            }

            foreach ($request->file('images') as $image) {
                $imagem = new Imagem;

                $imagem->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($image['img']->extension());

                $imagem->controladora = $conteudo->controladora;
                $imagem->acao = $conteudo->acao;
                $imagem->conteudo_id = $conteudo->id;

                $response = $imagem->save();

                if ($response) {
                    $image['img']->move(public_path('content/carousel/'), $imagem->imagem);
                } else {
                    return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Erro ao salvar imagem']);
                }
            }

            return redirect()->back()->with('message', ['type' => 'success', 'msg' => 'Imagens adicionadas com sucesso!']);
        }

        return redirect()->back();
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

            $exclusao = Imagem::query()
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

            $response = Imagem::query()
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
                    $registro = Imagem::query()
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