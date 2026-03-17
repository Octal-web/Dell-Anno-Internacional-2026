<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Acontecimento extends Model {
    protected $table = 'acontecimentos';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function acontecimentosIdiomas()
    {
        return $this->hasMany(AcontecimentoIdioma::class);
    }
}