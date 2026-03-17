<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FaseProjeto extends Model {
    protected $table = 'fases_projetos';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function fasesProjetosIdiomas()
    {
        return $this->hasMany(FaseProjetoIdioma::class);
    }
}