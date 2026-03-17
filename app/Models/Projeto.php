<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Projeto extends Model {
    protected $table = 'projetos';

    protected $fillable = ['ordem', 'slug'];
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function projetosIdiomas()
    {
        return $this->hasMany(ProjetoIdioma::class);
    }

    public function imagens()
    {
        return $this->hasMany(ImagemProjeto::class);
    }

    public function ambiente()
    {
        return $this->belongsTo(Ambiente::class);
    }
}