<?php

namespace App\Http\Controllers;

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
                'estado_id' => 'required|exists:estados,id',
            ]);

            $cidades = Cidade::query()
                ->where('estado_id', $request->estado_id)
                ->select('id', 'nome', 'condado')
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
                                'label' => $cidade->nome,
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
            return Inertia::location(route('Home.index'));
        }
    }
}