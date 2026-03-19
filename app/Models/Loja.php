<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loja extends Model {
    protected $table = 'lojas';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function lojasIdiomas()
    {
        return $this->hasMany(LojaIdioma::class);
    }
    
    public function showrooms()
    {
        return $this->hasMany(Showroom::class);
    }

    public function contatos()
    {
        return $this->hasMany(Contato::class);
    }
    
    public function emails()
    {
        return $this->hasMany(LojaEmail::class);
    }
    
    public function pais()
    {
        return $this->belongsTo(Pais::class);
    }

    public function projetos() {
        return $this->hasMany(ProjetoLoja::class);
    }
    
    public function estados()
    {
        return $this->belongsToMany(Estado::class, 'loja_estado');
    }

    public function cidades()
    {
        return $this->belongsToMany(Cidade::class, 'loja_cidade');
    }
}