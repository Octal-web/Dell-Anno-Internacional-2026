<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Cidade;

class CidadesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function carregar(Request $request) {
        if($request->ajax()){
            $request->validate([
                'q' => 'required',
            ]);

            $searchTerm = request('q');

            $cidades = Cidade::query()
                ->where('nome', 'LIKE', '%' . $searchTerm . '%')
                ->with('estado')
                ->orderBy('condado')
                ->orderBy('nome')
                ->get()
                ->groupBy('condado')
                ->map(function ($group, $condado) {
                    return [
                        'label' => $condado,
                        'options' => $group->map(function ($cidade) {
                            return [
                                'value' => $cidade->id,
                                'label' => $cidade->nome . ' - ' . $cidade->estado->codigo,
                            ];
                        })->values(),
                    ];
                })
                ->values();

            return response()->json([
                'cidades' => $cidades
            ]);
        }
        else {
            return Inertia::location(route('Manager.Home.index'));
        }
    }
}