<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Catalogo;

use Illuminate\Support\Facades\File;

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
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'catalogoCategoria.catalogosCategoriasIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                        ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                },
                'catalogosIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                        ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function ($catalogo) {
                $categoria = $catalogo->catalogoCategoria;
                $categoriaNome = $categoria && $categoria->catalogosCategoriasIdiomas->isNotEmpty()
                    ? $categoria->catalogosCategoriasIdiomas[0]->titulo
                    : null;

                return [
                    'id' => $catalogo->id,
                    'nome_original' => $catalogo->nome_original,
                    'imagem' => rafator('content/catalogs/thumbs/' . $catalogo->imagem),
                    'titulo' => $catalogo->catalogosIdiomas->isNotEmpty() ? $catalogo->catalogosIdiomas[0]->titulo : null,
                    'descricao' => $catalogo->catalogosIdiomas->isNotEmpty() ? $catalogo->catalogosIdiomas[0]->descricao : null,
                    'categoria' => $categoriaNome,
                ];
            })
            ->groupBy('categoria');

        return Inertia::render('Catalogos', [
            'catalogos' => $catalogos->map(fn($itens, $categoria) => [
                'categoria' => $categoria,
                'itens' => $itens->values(),
            ])->values()
        ]);
    }

    /**
     * Download the file of the specified resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function download($id) {
        if (!$id) {
            return redirect()->route('Catalogos.index');
        }

        $catalogo = Catalogo::query()
            ->where([
                'id' => $id,
                'excluido' => NULL,
            ])
            ->first();

        if (!$catalogo) {
            return redirect()->route('Catalogos.index');
        }

        $caminho = public_path('content/catalogs/files/' . $catalogo->nome_original);

        if (!File::exists($caminho)) {
            return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Não foi possível encontrar o arquivo!']);
        }

        return response()->download($caminho);
    }
};