<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PoliticasController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function privacidade() {
        return Inertia::render('PoliticaPrivacidade');
    }
};