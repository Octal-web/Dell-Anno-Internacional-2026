<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjetoLoja extends Model {
    protected $table = 'projetos_lojas';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function projetosLojasIdiomas()
    {
        return $this->hasMany(ProjetoLojaIdioma::class);
    }

    public function imagens()
    {
        return $this->hasMany(ImagemProjetoLoja::class);
    }

    public function loja()
    {
        return $this->belongsTo(Loja::class);
    }
}