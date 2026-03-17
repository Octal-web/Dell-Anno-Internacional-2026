<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use App\Models\CatalogoCategoria;
use App\Models\CatalogoCategoriaIdioma;

use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostCatalogCategoryRequest;

use Carbon\Carbon;
use Illuminate\Support\Facades\Response;

class CatalogosCategoriasController extends Controller
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
        
        return Inertia::render('Manager/Catalogos/Categorias/adicionar');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostCatalogCategoryRequest $request) {
        if ($request->ajax()) {
            $idioma = inertia()->getShared('idioma');
            
            $catalogo_categoria = new CatalogoCategoria;
            $catalogo_categoria_idioma = new CatalogoCategoriaIdioma;

            $catalogo_categoria->save();

            $catalogo_categoria_idioma->titulo = $request->titulo;
            $catalogo_categoria_idioma->catalogo_categoria_id = $catalogo_categoria->id;
            $catalogo_categoria_idioma->idioma_id = $idioma->id;

            $response = $catalogo_categoria_idioma->save();

            if ($response) {
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

        $catalogo_categoria = CatalogoCategoria::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'catalogosCategoriasIdiomas' => function ($q) use ($idioma) {
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

        if(!$catalogo_categoria) {
            return Inertia::location(route('Manager.Catalogos.index'));
        }

        $idioma = inertia()->getShared('idioma');
        
        $catalogoData = [
            'id' => $catalogo_categoria->id,
            'titulo' => count($catalogo_categoria->catalogosCategoriasIdiomas) ? $catalogo_categoria->catalogosCategoriasIdiomas[0]->titulo : null,
            'descricao' => count($catalogo_categoria->catalogosCategoriasIdiomas) ? $catalogo_categoria->catalogosCategoriasIdiomas[0]->descricao : null,
        ];

        return Inertia::render('Manager/Catalogos/Categorias/editar', [
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
    public function atualizar(PostCatalogCategoryRequest $request, $id) {
        if($request->ajax()){
            $catalogo_categoria = CatalogoCategoria::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $catalogo_categoria_idioma = CatalogoCategoriaIdioma::query()
                ->where([
                    'excluido' => null,
                    'catalogo_categoria_id' => $catalogo_categoria->id
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

            if (!$catalogo_categoria) {
                return to_route('Manager.Catalogos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($catalogo_categoria, 'catalogosCategoriasIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Catalogos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Catalogos.index'));
            }

            if (!$catalogo_categoria_idioma) {
                $catalogo_categoria_idioma = new CatalogoCategoriaIdioma;

                $catalogo_categoria_idioma->catalogo_categoria_id = $catalogo_categoria->id;
                $catalogo_categoria_idioma->idioma_id = $idioma;
            }

            $catalogo_categoria_idioma->titulo = $request->titulo;
            
            $response = $catalogo_categoria->save();
            $response = $catalogo_categoria_idioma->save();

            if ($response) {
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

            $exclusao = CatalogoCategoria::query()
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

            $response = CatalogoCategoria::query()
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
                    $registro = CatalogoCategoria::query()
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