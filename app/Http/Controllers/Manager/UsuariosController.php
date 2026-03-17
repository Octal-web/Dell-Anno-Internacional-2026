<?php

namespace App\Http\Controllers\Manager;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Auth;

class UsuariosController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    public function login() {
        if (Auth::user()) {
            return Inertia::location(route('Manager.Home.index'));
        }

        if (isset(session('url')['intended'])) {
            return Inertia::render('Manager/Usuarios/login', [
                'message' => [
                    'type' => 'error',
                    'message' => 'Você precisa fazer login para acessar essa página.'
                ]
            ]);
        }

        return Inertia::render('Manager/Usuarios/login');
    }

    public function authenticate(Request $request) {
        $creds = $request->only(['email', 'password']);

        if ($request->input('email') == null || $request->input('password') == null) {
            return Inertia::render('Manager/Usuarios/login', [
                'message' => [
                    'type' => 'error',
                    'message' => 'Por favor, informe seu e-mail e sua senha.'
                ]
            ]);
        } else {
            if(Auth::attempt($creds)) {
                
                $request->session()->regenerate();
     
                return redirect()->intended('manager/home');
            } else {
                return Inertia::render('Manager/Usuarios/login', [
                    'message' => [
                        'type' => 'error',
                        'message' => 'E-mail ou senha inválidos.'
                    ]
                ]);
            }
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Inertia::location(route('Manager.Usuarios.login'));
    }
}