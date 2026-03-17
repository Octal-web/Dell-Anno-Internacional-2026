<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use App\Models\Catalogo;
use App\Models\CatalogoIdioma;
use App\Models\CatalogoCategoria;

use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostCatalogRequest;

use Carbon\Carbon;
use App\Services\ImageCompressor;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

class CatalogosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $catalogos = Catalogo::query()
            ->where([
                'excluido' => NULL
            ])
            ->with([
                'catalogosIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->get()
            ->map(function($catalogo) {
                return [
                    'id' => $catalogo->id,
                    'visivel' => $catalogo->visivel,
                    'imagem' => rafator('content/catalogs/thumbs/' . $catalogo->imagem),
                    'titulo' => $catalogo->catalogosIdiomas->isNotEmpty() ? $catalogo->catalogosIdiomas[0]->titulo : null,
                ];
            });

        $categorias = CatalogoCategoria::query()
            ->where([
                'excluido' => NULL
            ])
            ->with([
                'catalogosCategoriasIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->get()
            ->map(function($catalogo) {
                return [
                    'id' => $catalogo->id,
                    'visivel' => $catalogo->visivel,
                    'titulo' => $catalogo->catalogosCategoriasIdiomas->isNotEmpty() ? $catalogo->catalogosCategoriasIdiomas[0]->titulo : null,
                ];
            });

        return Inertia::render('Manager/Catalogos/index', [
            'catalogos' => $catalogos,
            'categorias' => $categorias
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
        
        return Inertia::render('Manager/Catalogos/adicionar');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostCatalogRequest $request, ImageCompressor $compressor) {
        if ($request->ajax()) {
            $idioma = inertia()->getShared('idioma');
            
            $catalogo = new Catalogo;
            $catalogo_idioma = new CatalogoIdioma;

            $catalogo->imagem = md5(uniqid('', true)) . '.' . strtolower($request->file('img')->extension());

            $catalogo->nome_original = $request->file('arq')->getClientOriginalName();
            $catalogo->catalogo_categoria_id = $request->catalogo_categoria_id;

            $catalogo->save();

            $catalogo_idioma->titulo = $request->titulo;
            $catalogo_idioma->descricao = $request->descricao;
            $catalogo_idioma->catalogo_id = $catalogo->id;
            $catalogo_idioma->idioma_id = $idioma->id;
            
            $response = $catalogo_idioma->save();

            if ($response) {
                $compressor->compressOrFallback($request->file('img')->getRealPath(), public_path('content/catalogs/thumbs/' . $catalogo->imagem));

                $request->file('arq')->move(public_path('content/catalogs/files/'), $catalogo->nome_original);

                return to_route('Manager.Catalogos.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
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
            return Inertia::location(route('Manager.Catalogos.index'));
        }
        
        $idiomas = Idioma::query()
            ->orderBy('padrao', 'DESC')
            ->orderBy('id', 'DESC')
            ->get();

        $idioma = request('lang');

        $catalogo = Catalogo::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'catalogosIdiomas' => function ($q) use ($idioma) {
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

        if(!$catalogo) {
            return Inertia::location(route('Manager.Catalogos.index'));
        }

        $idioma = inertia()->getShared('idioma');
        
        $catalogoData = [
            'id' => $catalogo->id,
            'imagem' => rafator('content/catalogs/thumbs/' . $catalogo->imagem),
            'titulo' => count($catalogo->catalogosIdiomas) ? $catalogo->catalogosIdiomas[0]->titulo : null,
            'descricao' => count($catalogo->catalogosIdiomas) ? $catalogo->catalogosIdiomas[0]->descricao : null,
        ];

        return Inertia::render('Manager/Catalogos/editar', [
            'idiomas' => $idiomas,
            'idioma' => $idioma,
            'catalogo' => $catalogoData,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizar(PostCatalogRequest $request, $id) {
        if($request->ajax()){
            $catalogo = Catalogo::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $catalogo_idioma = CatalogoIdioma::query()
                ->where([
                    'excluido' => null,
                    'catalogo_id' => $catalogo->id
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

            if (!$catalogo) {
                return to_route('Manager.Catalogos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($catalogo, 'catalogosIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Catalogos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Catalogos.index'));
            }

            if (!$catalogo_idioma) {
                $catalogo_idioma = new CatalogoIdioma;

                $catalogo_idioma->catalogo_id = $catalogo->id;
                $catalogo_idioma->idioma_id = $idioma;
            } else {
                $copier = new DeepCopy();
                $catalogoOriginal = $copier->copy($catalogo);
            }

            if ($request->file('img') && $request->file('img')->getError() == 0) {
                $catalogo->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            }

            if ($request->file('arq') && $request->file('arq')->getError() == 0) {
                $catalogo->nome_original = $request->file('arq')->getClientOriginalName();
            }

            $catalogo->catalogo_categoria_id = $request->catalogo_categoria_id;

            $catalogo_idioma->titulo = $request->titulo;
            $catalogo_idioma->descricao = $request->descricao;

            $response = $catalogo->save();
            $response = $catalogo_idioma->save();

            if ($response) {
                if ($request->file('img') && $request->file('img')->getError() == 0) {
                    if ($catalogo->imagem && isset($catalogoOriginal) && File::exists('content/catalogs/thumbs/' . $catalogoOriginal->imagem)) {
                        File::delete('content/catalogs/thumbs/' . $catalogoOriginal->imagem);
                    }
                    
                    $image = $request->file('img')->move(public_path('content/catalogs/thumbs/'), $catalogo->imagem);
                }

                if ($request->file('arq') && $request->file('arq')->getError() == 0) {
                    if ($catalogo->nome_original && isset($catalogoOriginal) && File::exists('content/catalogs/files/' . $catalogoOriginal->nome_original)) {
                        File::delete('content/catalogs/files/' . $catalogoOriginal->nome_original);
                    }
                    
                    $file = $request->file('arq')->move(public_path('content/catalogs/files/'), $catalogo->nome_original);
                }

                return to_route('Manager.Catalogos.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }
        }

        return to_route('Manager.Catalogos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
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

            $exclusao = Catalogo::query()
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

            $response = Catalogo::query()
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
                    $registro = Catalogo::query()
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
    public function baixarArquivo($id) {
        if (!$id) {
            return redirect()->route('Manager.Catalogos.index');
        }

        $catalogo = Catalogo::query()
            ->where([
                'id' => $id,
                'excluido' => NULL,
            ])
            ->first();

        if (!$catalogo) {
            return redirect()->route('Manager.Catalogos.index');
        }

        $caminho = public_path('content/catalogs/files/' . $catalogo->nome_original);

        if (!File::exists($caminho)) {
            return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Não foi possível encontrar o arquivo!']);
        }

        return response()->download($caminho);
    }
};