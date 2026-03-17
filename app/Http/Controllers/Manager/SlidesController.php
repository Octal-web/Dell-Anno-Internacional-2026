<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Slide;
use App\Models\SlideIdioma;
use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostSlideRequest;

use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

class SlidesController extends Controller
{
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function adicionar($tipo) {
        if (!$tipo || !in_array($tipo, ['imagem', 'video'])) {
            return Inertia::location(route('Manager.Home.index'));
        }

        $idiomas = Idioma::query()
            ->orderBy('padrao', 'DESC')
            ->orderBy('id', 'DESC')
            ->get();

        $idioma = request('lang');

        return Inertia::render('Manager/Slides/adicionar', [
            'tipo' => $tipo
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostSlideRequest $request, $tipo) {
        if($request->ajax()){
            if (!$tipo || !in_array($tipo, ['imagem', 'video'])) {
                return Inertia::location(route('Manager.Home.index'));
            }

            $idioma = inertia()->getShared('idioma');
            
            $slide = new Slide;
            $slide_idioma = new SlideIdioma;

            if ($tipo == 'imagem') {
                $slide->tipo = 'imagem';

                $slide->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
                $slide->imagem_mobile = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_mobile')->extension());
            } else if ($tipo == 'video') {
                $slide->tipo = 'video';

                $slide->video = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('vid')->extension());
                $slide->video_mobile = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('vid_mobile')->extension());
            }

            $response = $slide->save();

            $slide_idioma->titulo = $request->titulo;
            $slide_idioma->descricao = $request->descricao;
            $slide_idioma->link = $request->link;
            $slide_idioma->texto_botao = $request->texto_botao;

            $slide_idioma->slide_id = $slide->id;
            $slide_idioma->idioma_id = $idioma->id;

            $response = $slide_idioma->save();

            if ($response) {
                if ($tipo == 'imagem') {
                    $image = $request->file('img')->move(public_path('content/slides/d/'), $slide->imagem);
                    $image = $request->file('img_mobile')->move(public_path('content/slides/m/'), $slide->imagem_mobile);
                } else if ($tipo == 'video') {
                    $video = $request->file('vid')->move(public_path('content/slides/videos/d/'), $slide->video);
                    $video = $request->file('vid_mobile')->move(public_path('content/slides/videos/m/'), $slide->video_mobile);
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

        $slide = Slide::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'slidesIdiomas' => function ($q) use ($idioma) {
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

        if(!$slide) {
            return Inertia::location(route('Manager.Home.index'));
        }

        $idioma = inertia()->getShared('idioma');

        $slideData = [
            'id' => $slide->id,
            'tipo' => $slide->tipo,
            'titulo' => count($slide->slidesIdiomas) ? $slide->slidesIdiomas[0]->titulo : null,
            'descricao' => count($slide->slidesIdiomas) ? $slide->slidesIdiomas[0]->descricao : null,
            'link' => count($slide->slidesIdiomas) ? $slide->slidesIdiomas[0]->link : null,
            'texto_botao' => count($slide->slidesIdiomas) ? $slide->slidesIdiomas[0]->texto_botao : null,
        ];

        if ($slide->tipo === 'imagem') {
            $slideData['imagem'] = rafator('content/slides/d/' . $slide->imagem);
            $slideData['imagem_mobile'] = rafator('content/slides/m/' . $slide->imagem_mobile);
        }
        
        return Inertia::render('Manager/Slides/editar', [
            'idiomas' => $idiomas,
            'idioma' => $idioma,
            'slide' => $slideData
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizar(PostSlideRequest $request, $id) {
        if($request->ajax()){
            $slide = Slide::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $slide_idioma = SlideIdioma::query()
                ->where([
                    'excluido' => null,
                    'slide_id' => $slide->id
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

            if (!$slide) {
                return to_route('Manager.Home.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($slide, 'slidesIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Home.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Home.index'));
            }

            if (!$slide_idioma) {
                $slide_idioma = new SlideIdioma;

                $slide_idioma->slide_id = $slide->id;
                $slide_idioma->idioma_id = $idioma;
            } else {
                $copier = new DeepCopy();
                $slideOriginal = $copier->copy($slide);
            }

            if ($slide->tipo == 'imagem') {
                if ($request->file('img') && $request->file('img')->isValid()) {
                    $slide->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
                }

                if ($request->file('img_mobile') && $request->file('img_mobile')->isValid()) {
                    $slide->imagem_mobile = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_mobile')->extension());
                }
            } elseif ($slide->tipo == 'video') {
                if ($request->file('vid') && $request->file('vid')->isValid()) {
                    $slide->video = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('vid')->extension());
                }

                if ($request->file('vid_mobile') && $request->file('vid_mobile')->isValid()) {
                    $slide->video_mobile = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('vid_mobile')->extension());
                }
            }

            $slide_idioma->titulo = $request->titulo;
            $slide_idioma->descricao = $request->descricao;
            $slide_idioma->link = $request->link;
            $slide_idioma->texto_botao = $request->texto_botao;

            $response = $slide->save();
            $response = $slide_idioma->save();

            if ($response) {
                if ($slide->tipo == 'imagem') {
                    if ($request->file('img') && $request->file('img')->isValid()) {
                        if ($slide->imagem && isset($slideOriginal) && File::exists(public_path('content/slides/d/' . $slideOriginal->imagem))) {
                            File::delete(public_path('content/slides/d/' . $slideOriginal->imagem));
                        }
                        $request->file('img')->move(public_path('content/slides/d/'), $slide->imagem);
                    }

                    if ($request->file('img_mobile') && $request->file('img_mobile')->isValid()) {
                        if ($slide->imagem_mobile && isset($slideOriginal) && File::exists(public_path('content/slides/m/' . $slideOriginal->imagem_mobile))) {
                            File::delete(public_path('content/slides/m/' . $slideOriginal->imagem_mobile));
                        }
                        $request->file('img_mobile')->move(public_path('content/slides/m/'), $slide->imagem_mobile);
                    }
                }

                if ($slide->tipo == 'video') {
                    if ($request->file('vid') && $request->file('vid')->isValid()) {
                        if ($slide->video && isset($slideOriginal) && File::exists(public_path('content/slides/videos/d/' . $slideOriginal->video))) {
                            File::delete(public_path('content/slides/videos/d/' . $slideOriginal->video));
                        }
                        $request->file('vid')->move(public_path('content/slides/videos/d/'), $slide->video);
                    }

                    if ($request->file('vid_mobile') && $request->file('vid_mobile')->isValid()) {
                        if ($slide->video_mobile && isset($slideOriginal) && File::exists(public_path('content/slides/videos/m/' . $slideOriginal->video_mobile))) {
                            File::delete(public_path('content/slides/videos/m/' . $slideOriginal->video_mobile));
                        }
                        $request->file('vid_mobile')->move(public_path('content/slides/videos/m/'), $slide->video_mobile);
                    }
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

            $exclusao = Slide::query()
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
                return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Registro não encontrado!']);
            }

            $response = Slide::query()
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
                    $registro = Slide::query()
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
    public function baixarVideo($id, $video) {
        if (!$id || !$video || !in_array($video, ['desktop', 'mobile'])) {
            return redirect()->route('Manager.Home.index');
        }

        $slide = Slide::query()
            ->where([
                'id' => $id,
                'excluido' => NULL,
            ])
            ->first();

        if (!$slide) {
            return redirect()->route('Manager.Home.index');
        }

        if ($video == 'desktop') {
            $caminho = public_path('content/slides/videos/d/' . $slide->video);
        } else if ($video == 'mobile') {
            $caminho = public_path('content/slides/videos/m/' . $slide->video_mobile);
        }

        $extensao = pathinfo($caminho)['extension'];

        if (!File::exists($caminho)) {
            return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Não foi possível encontrar o arquivo!']);
        }

        return response()->download($caminho, 'Vídeo ' . $video . '.' . $extensao);
    }
}