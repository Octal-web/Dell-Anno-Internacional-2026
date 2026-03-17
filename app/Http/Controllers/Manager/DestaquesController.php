<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use App\Models\Destaque;
use App\Models\DestaqueIdioma;
use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostHighlightRequest;

use Carbon\Carbon;
use App\Services\ImageCompressor;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

class DestaquesController extends Controller
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

        return Inertia::render('Manager/Destaques/adicionar');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostHighlightRequest $request, ImageCompressor $compressor) {
        if($request->ajax()){
            $idioma = inertia()->getShared('idioma');
            
            $destaque = new Destaque;
            $destaque_idioma = new DestaqueIdioma;

            if ($request->file('img') && $request->file('img')->getError() == 0) {
                $destaque->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            }

            if ($request->file('vid') && $request->file('vid')->getError() == 0) {
                $destaque->video = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('vid')->extension());
            }

            $destaque->tipo = $request->tipo;
            $destaque->tamanho = $request->tamanho;

            $response = $destaque->save();

            $destaque_idioma->titulo = $request->titulo;
            $destaque_idioma->texto = $request->texto;
            $destaque_idioma->link = $request->link ?? null;
            $destaque_idioma->texto_botao = $request->texto_botao ?? null;

            $destaque_idioma->destaque_id = $destaque->id;
            $destaque_idioma->idioma_id = $idioma->id;

            $response = $destaque_idioma->save();

            if ($response) {
                if ($request->file('img') && $request->file('img')->getError() == 0) {
                    $compressor->compressOrFallback($request->file('img')->getRealPath(), public_path('content/highlights/thumbs/' . $destaque->imagem));
                }
                
                if ($request->file('vid') && $request->file('vid')->getError() == 0) {
                    $video = $request->file('vid')->move(public_path('content/highlights/video/'), $destaque->video);
                }

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

        $destaque = Destaque::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'destaquesIdiomas' => function ($q) use ($idioma) {
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

        if(!$destaque) {
            return Inertia::location(route('Manager.Home.index'));
        }

        $idioma = inertia()->getShared('idioma');

        $destaque = [
            'id' => $destaque->id,
            'link' => $destaque->link,
            'tipo' => $destaque->tipo,
            'tamanho' => $destaque->tamanho,
            'imagem' => $destaque->imagem ? asset('content/highlights/thumbs/' . $destaque->imagem) : null,
            'titulo' => count($destaque->destaquesIdiomas) ? $destaque->destaquesIdiomas[0]->titulo : null,
            'texto' => count($destaque->destaquesIdiomas) ? $destaque->destaquesIdiomas[0]->texto : null,
            'link' => count($destaque->destaquesIdiomas) ? $destaque->destaquesIdiomas[0]->link : null,
            'texto_botao' => count($destaque->destaquesIdiomas) ? $destaque->destaquesIdiomas[0]->texto_botao : null
        ];

        return Inertia::render('Manager/Destaques/editar', [
            'idiomas' => $idiomas,
            'idioma' => $idioma,
            'destaque' => $destaque
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizar(PostHighlightRequest $request, $id) {
        if($request->ajax()){
            $destaque = Destaque::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $destaque_idioma = DestaqueIdioma::query()
                ->where([
                    'excluido' => null,
                    'destaque_id' => $destaque->id
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

            if (!$destaque) {
                return to_route('Manager.Home.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($destaque, 'destaquesIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Home.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Home.index'));
            }

            if (!$destaque_idioma) {
                $destaque_idioma = new DestaqueIdioma;

                $destaque_idioma->destaque_id = $destaque->id;
                $destaque_idioma->idioma_id = $idioma;
            } else {
                $copier = new DeepCopy();
                $destaqueOriginal = $copier->copy($destaque);
            }

            $destaque->tamanho = $request->tamanho;

            if ($request->file('img') && $request->file('img')->getError() == 0) {
                $destaque->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            }

            if ($request->file('vid') && $request->file('vid')->getError() == 0) {
                $destaque->video = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('vid')->extension());
            }

            $destaque_idioma->titulo = $request->titulo;
            $destaque_idioma->texto = $request->texto;
            $destaque_idioma->link = $request->link ?? null;
            $destaque_idioma->texto_botao = $request->texto_botao ?? null;

            $response = $destaque->save();
            $response = $destaque_idioma->save();

            if ($response) {
                if ($request->file('img') && $request->file('img')->getError() == 0) {
                    if ($destaque->imagem && isset($destaqueOriginal) && File::exists('content/highlights/thumbs/' . $destaqueOriginal->imagem)) {
                        File::delete('content/highlights/thumbs/' . $destaqueOriginal->imagem);
                    }

                    $image = $request->file('img')->move(public_path('content/highlights/thumbs/'), $destaque->imagem);
                }
                
                if ($request->file('vid') && $request->file('vid')->getError() == 0) {
                    if ($destaque->video && isset($destaqueOriginal) && File::exists('content/highlights/video/' . $destaqueOriginal->video)) {
                        File::delete('content/highlights/video/' . $destaqueOriginal->video);
                    }

                    $image = $request->file('vid')->move(public_path('content/highlights/video/'), $destaque->video);
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

            $exclusao = Destaque::query()
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

            $response = Destaque::query()
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
                    $registro = Destaque::query()
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
            return redirect()->route('Manager.Home.index');
        }

        $destaque = Destaque::query()
            ->where([
                'id' => $id,
                'excluido' => NULL,
                'tipo' => 'video'
            ])
            ->first();

        if (!$destaque) {
            return redirect()->route('Manager.Home.index');
        }

        $caminho = public_path('content/highlights/video/' . $destaque->video);

        $extensao = pathinfo($caminho)['extension'];

        if (!File::exists($caminho)) {
            return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Não foi possível encontrar o arquivo!']);
        }

        return response()->download($caminho, 'Vídeo ' . $video . '.' . $extensao);
    }
};