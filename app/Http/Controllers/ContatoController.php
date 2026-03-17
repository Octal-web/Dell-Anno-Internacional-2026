<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\PostContactRequest;
use App\Services\ContactService;
use Inertia\Inertia;

class ContatoController extends Controller
{
    protected $contactService;

    public function __construct(ContactService $contactService)
    {
        parent::__construct();
        $this->contactService = $contactService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        return Inertia::render('Contato');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function enviar(PostContactRequest $request) {
        if($request->post()){
            $data = $request->validated();
        
            $contato = $this->contactService->create($data);

            return back()->with('message', [
                'type' => 'success',
                'msg' => 'Contato enviado com sucesso!',
            ]);
        }

        return Inertia::location(route('Contato.index'));
    }
};