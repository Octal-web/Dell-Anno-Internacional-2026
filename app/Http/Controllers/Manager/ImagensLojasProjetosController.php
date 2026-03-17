<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\ProjetoLoja;
use App\Models\ImagemProjetoLoja;

use Illuminate\Http\Request;
use Inertia\Inertia;

use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

class ImagensLojasProjetosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id) {
        if (!$id) {
            return Inertia::location(route('Manager.Lojas.Projetos.index'));
        }

        $projeto = ProjetoLoja::query()
            ->where([
                'excluido' => NULL,
                'id' => $id
            ])
            ->with([
                'projetosLojasIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                },
                'imagens' => function ($q) {
                    $q->where([
                        'excluido' => NULL
                    ])
                    ->orderBy('ordem', 'ASC')
                    ->orderBy('id', 'DESC'); 
                }

            ])
            ->first();

        if(!$projeto) {
            return Inertia::location(route('Manager.Lojas.Projetos.index'));
        }

        $projetoData = [
            'id' => $projeto->id,
            'nome' => $projeto->projetosLojasIdiomas->isNotEmpty() ? $projeto->projetosLojasIdiomas[0]->nome : null,
            'imagens' => $projeto->imagens->map(function ($img) {
                return [
                    'id' => $img->id,
                    'visivel' => $img->visivel ? true : false,
                    'imagem' => asset('content/stores/projects/gallery/s/' . $img->imagem),
                    'imagem_completa' => asset('content/stores/projects/gallery/b/' . $img->imagem),
                ];
            })->values()->all(),
        ];

        return Inertia::render('Manager/Lojas/Projetos/Imagens/index', [
            'projeto' => $projetoData,
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
            $projeto = ProjetoLoja::query()
                ->where([
                    'excluido' => NULL,
                    'id' => $id
                ])
                ->first();

            if (!$projeto) {
                return Inertia::location(route('Manager.Lojas.Projetos.index'));
            }

            foreach ($request->file('images') as $image) {
                $imagem = new ImagemProjetoLoja;

                $imagem->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($image['img']->extension());

                $imagem->projeto_loja_id = $projeto->id;

                $response = $imagem->save();

                if ($response) {
                    $image['img_alt']->move(public_path('content/stores/projects/gallery/s/'), $imagem->imagem);
                    $image['img']->move(public_path('content/stores/projects/gallery/b/'), $imagem->imagem);
                } else {
                    return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Erro ao salvar imagem']);
                }
            }

            return redirect()->back()->with('message', ['type' => 'success', 'msg' => 'Imagens adicionadas com sucesso!']);
        }

        return redirect()->back();
    }

    /**
     * Crop the specified resource image.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function cortar(Request $request, $id)
    {
        if ($request->ajax()) {
            if (!$id) {
                return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Registro não encontrado!']);
            }

            $imagem = ImagemProjetoLoja::query()
                ->where([
                    'id' => $id,
                    'excluido' => NULL
                ])
                ->first();

            if (!$imagem) {
                return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Registro não encontrado!']);
            }

            if ($request->hasFile('img')) {
                $path = public_path('content/stores/projects/gallery/s/' . $imagem->imagem);

                if (file_exists($path)) {
                    @unlink($path);
                }

                $request->file('img')->move(public_path('content/stores/projects/gallery/s/'), $imagem->imagem);

                return redirect()->back()->with('message', ['type' => 'success', 'msg' => 'Imagem cortada com sucesso!']);
            }

            return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Nenhuma imagem enviada.']);
        }

        return $request->header('referer');
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

            $exclusao = ImagemProjetoLoja::query()
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

            $response = ImagemProjetoLoja::query()
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
                    $registro = ImagemProjetoLoja::query()
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