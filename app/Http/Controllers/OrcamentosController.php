<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\FaseProjeto;
use App\Models\Conteudo;

class OrcamentosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $chamadaFases = Conteudo::query()
            ->where([
                'excluido' => NULL,
                'id' => 19
            ])
            ->with([
                'conteudosIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->first();

        if ($chamadaFases) {
            $chamadaFases = [
                'id' => $chamadaFases->id,
                'titulo' => $chamadaFases->conteudosIdiomas->isNotEmpty() ? $chamadaFases->conteudosIdiomas[0]->titulo : null,
                'subtitulo' => $chamadaFases->conteudosIdiomas->isNotEmpty() ? $chamadaFases->conteudosIdiomas[0]->subtitulo : null,
            ];
        }

        $fasesProjetos = FaseProjeto::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'fasesProjetosIdiomas' => function ($q) use ($idioma) {
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
            ->map(function($fase) {
                return [
                    'id' => $fase->id,
                    'imagem' => rafator('content/stages/thumbs/' . $fase->imagem),
                    'titulo' => $fase->fasesProjetosIdiomas->isNotEmpty() ? $fase->fasesProjetosIdiomas[0]->titulo : null,
                    'descricao' => $fase->fasesProjetosIdiomas->isNotEmpty() ? $fase->fasesProjetosIdiomas[0]->descricao : null
                ];
            });
        
        $chamadaForm = Conteudo::query()
            ->where([
                'excluido' => NULL,
                'id' => 14
            ])
            ->with([
                'conteudosIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->first();

        if ($chamadaForm) {
            $chamadaForm = [
                'id' => $chamadaForm->id,
                'titulo' => $chamadaForm->conteudosIdiomas->isNotEmpty() ? $chamadaForm->conteudosIdiomas[0]->titulo : null,
                'texto' => $chamadaForm->conteudosIdiomas->isNotEmpty() ? $chamadaForm->conteudosIdiomas[0]->texto : null,
            ];
        }
        
        return Inertia::render('Orcamentos', [
            'chamadaFases' => $chamadaFases,
            'fasesProjetos' => $fasesProjetos,
            'chamadaForm' => $chamadaForm,
        ]);
    }
};