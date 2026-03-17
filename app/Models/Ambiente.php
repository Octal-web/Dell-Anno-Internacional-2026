<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ambiente extends Model {
    protected $table = 'ambientes';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function ambientesIdiomas()
    {
        return $this->hasMany(AmbienteIdioma::class);
    }

    public function projetos()
    {
        return $this->hasMany(Projeto::class);
    }
    
    public function produto()
    {
        return $this->belongsTo(Produto::class);
    }
}