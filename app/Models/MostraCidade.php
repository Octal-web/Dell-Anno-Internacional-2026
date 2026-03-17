<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MostraCidade extends Model {
    protected $table = 'mostras_cidades';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function mostraAno()
    {
        return $this->belongsTo(MostraAno::class);
    }

    public function mostrasCidadesIdiomas()
    {
        return $this->hasMany(MostraCidadeIdioma::class);
    }

    public function ImagensMostrasCidades()
    {
        return $this->hasMany(ImagemMostraCidade::class);
    }
}